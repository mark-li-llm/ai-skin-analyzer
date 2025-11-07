import { Redis } from '@upstash/redis';
import crypto from 'crypto';

// Lazy initialization of Redis connection
let redis: Redis | null = null;

export function getRedisClient(): Redis {
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
    return logs.map(log => {
      // Upstash REST API auto-deserializes JSON, check if already parsed
      if (typeof log === 'string') {
        return JSON.parse(log);
      }
      return log as AnalysisLog;
    });
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

    // Build array of promises for parallel execution
    const promises = keys.map(key => client.hgetall(key as string));

    // Execute all queries in parallel using allSettled for better error handling
    const results = await Promise.allSettled(promises);

    // Process successful results
    const stats: UserStats[] = [];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      // Skip failed queries
      if (result.status === 'rejected') {
        console.warn(`Failed to fetch stats for ${keys[i]}:`, result.reason);
        continue;
      }

      const userStats = result.value;
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
    const today = new Date();

    // Build array of date keys for parallel queries
    // Reduced from 90 to 14 days for better performance
    const promises: Promise<any[]>[] = [];
    const dateKeys: string[] = [];

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      dateKeys.push(dateKey);

      // Get all logs for each day (we'll limit the total later)
      promises.push(client.lrange(`logs:${dateKey}`, 0, -1));
    }

    // Execute all queries in parallel using allSettled for better error handling
    const results = await Promise.allSettled(promises);

    // Process results and flatten into single array
    const logs: AnalysisLog[] = [];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      // Skip failed queries
      if (result.status === 'rejected') {
        console.warn(`Failed to fetch logs for ${dateKeys[i]}:`, result.reason);
        continue;
      }

      const dayLogs = result.value;

      for (const log of dayLogs) {
        // Upstash REST API auto-deserializes JSON, check if already parsed
        const parsedLog = typeof log === 'string' ? JSON.parse(log) : log;
        logs.push(parsedLog as AnalysisLog);

        // Stop processing once we have enough logs
        if (logs.length >= limit) {
          return logs.slice(0, limit);
        }
      }
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