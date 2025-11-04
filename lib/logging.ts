import { Redis } from '@upstash/redis';
import crypto from 'crypto';

// Lazy initialization of Redis connection
let redis: Redis | null = null;

function getRedisClient(): Redis {
  if (redis) return redis;

  const redisUrl = process.env.LOGS_REDIS_URL;

  if (redisUrl) {
    // Parse the Redis URL to extract token and host
    // Format: rediss://default:TOKEN@HOST:PORT
    const urlParts = redisUrl.match(/rediss:\/\/default:([^@]+)@([^:]+):(\d+)/);

    if (urlParts) {
      const [, token, host] = urlParts;
      // Upstash REST API URL format (without port)
      redis = new Redis({
        url: `https://${host}`,
        token: token,
      });
    } else {
      throw new Error('Invalid LOGS_REDIS_URL format');
    }
  } else if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Use default Upstash environment variables if available
    redis = Redis.fromEnv();
  } else {
    throw new Error('Redis configuration not found. Please set LOGS_REDIS_URL or UPSTASH_REDIS_REST_URL/TOKEN');
  }

  return redis;
}

// Types for logging
export interface AnalysisLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'upload' | 'analyze' | 'view_result' | 'error';
  imageHash?: string;
  analysisResult?: {
    skinType: string;
    confidence: number;
    issues: string[];
    recommendations?: string[];
  };
  duration?: number; // API response time in ms
  status: 'success' | 'error';
  errorDetails?: string;
  userAgent?: string;
  ip?: string;
}

export interface UserStats {
  user: string;
  totalAnalyses: number;
  lastUsed: string;
  averageDuration: number;
}

// Helper to generate image hash (avoid storing actual images)
export function generateImageHash(imageBuffer: Buffer): string {
  return crypto.createHash('sha256').update(imageBuffer).digest('hex').substring(0, 16);
}

// Get current date key for organizing logs by day
function getDateKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Log an analysis
export async function logAnalysis(log: Omit<AnalysisLog, 'id' | 'timestamp'>): Promise<void> {
  const logEntry: AnalysisLog = {
    ...log,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  const dateKey = getDateKey();

  try {
    const client = getRedisClient();

    // Store in daily log list
    await client.lpush(`logs:${dateKey}`, JSON.stringify(logEntry));

    // Update user stats
    await client.hincrby(`stats:user:${log.user}`, 'count', 1);
    await client.hset(`stats:user:${log.user}`, {
      lastUsed: logEntry.timestamp,
      user: log.user,
    });

    // If successful analysis, track the image hash to detect duplicates
    if (log.status === 'success' && log.imageHash) {
      await client.sadd('images:analyzed', log.imageHash);
    }

    // Set expiration for daily logs (keep for 365 days / 1 year)
    await client.expire(`logs:${dateKey}`, 365 * 24 * 60 * 60);

  } catch (error) {
    console.error('Failed to log analysis:', error);
    // Don't throw - logging failure shouldn't break the app
  }
}

// Get logs for a specific date
export async function getLogsByDate(date?: string): Promise<AnalysisLog[]> {
  const dateKey = date || getDateKey();

  try {
    const client = getRedisClient();
    const logs = await client.lrange(`logs:${dateKey}`, 0, -1);
    return logs.map(log => JSON.parse(log as string));
  } catch (error) {
    console.error('Failed to fetch logs:', error);
    return [];
  }
}

// Get user statistics
export async function getUserStats(): Promise<UserStats[]> {
  try {
    const client = getRedisClient();

    // Get all user stat keys
    const keys = await client.keys('stats:user:*');

    if (keys.length === 0) {
      return [];
    }

    const stats: UserStats[] = [];

    for (const key of keys) {
      const userStats = await client.hgetall(key as string);
      if (userStats) {
        stats.push({
          user: userStats.user as string || 'unknown',
          totalAnalyses: parseInt(userStats.count as string || '0'),
          lastUsed: userStats.lastUsed as string || '',
          averageDuration: parseInt(userStats.avgDuration as string || '0'),
        });
      }
    }

    return stats.sort((a, b) => b.totalAnalyses - a.totalAnalyses);
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return [];
  }
}

// Check if an image has been analyzed before
export async function hasImageBeenAnalyzed(imageHash: string): Promise<boolean> {
  try {
    const client = getRedisClient();
    const result = await client.sismember('images:analyzed', imageHash);
    return result === 1;
  } catch (error) {
    console.error('Failed to check image hash:', error);
    return false;
  }
}

// Get recent logs (across all dates)
export async function getRecentLogs(limit: number = 50): Promise<AnalysisLog[]> {
  try {
    const client = getRedisClient();
    const logs: AnalysisLog[] = [];
    const today = new Date();

    // Check last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const dayLogs = await client.lrange(`logs:${dateKey}`, 0, limit - logs.length - 1);

      for (const log of dayLogs) {
        logs.push(JSON.parse(log as string));
        if (logs.length >= limit) break;
      }

      if (logs.length >= limit) break;
    }

    return logs;
  } catch (error) {
    console.error('Failed to fetch recent logs:', error);
    return [];
  }
}

// Test Redis connection
export async function testRedisConnection(): Promise<boolean> {
  try {
    const client = getRedisClient();
    await client.ping();
    console.log('✅ Redis connection successful');
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return false;
  }
}