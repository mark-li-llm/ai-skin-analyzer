require('dotenv').config({ path: '.env.local' })
const { Redis } = require('@upstash/redis')

async function checkAllLogs() {
  const redisUrl = process.env.LOGS_REDIS_URL
  const urlParts = redisUrl.match(/rediss:\/\/default:([^@]+)@([^:]+):(\d+)/)
  const [, token, host] = urlParts

  const redis = new Redis({
    url: `https://${host}`,
    token: token,
  })

  console.log('🔍 Checking all log keys in Redis...\n')

  // Get all log keys
  const allKeys = await redis.keys('logs:*')
  console.log(`Found ${allKeys.length} date keys:\n`)

  let totalLogs = 0
  for (const key of allKeys) {
    const count = await redis.llen(key)
    totalLogs += count
    console.log(`${key}: ${count} logs`)

    // Get all logs for this date
    const logs = await redis.lrange(key, 0, -1)
    logs.forEach((log, i) => {
      const parsed = typeof log === 'string' ? JSON.parse(log) : log
      console.log(`  - Log ${i+1}: ${parsed.user} at ${parsed.timestamp}`)
    })
    console.log()
  }

  console.log(`\n📊 Total logs in Redis: ${totalLogs}`)

  // Check user stats
  console.log('\n👥 User Stats:')
  const userKeys = await redis.keys('stats:user:*')
  let totalFromStats = 0
  for (const key of userKeys) {
    const stats = await redis.hgetall(key)
    const count = parseInt(stats.count)
    totalFromStats += count
    console.log(`${stats.user}: count=${count}, lastUsed=${stats.lastUsed}`)
  }

  console.log(`\n📈 Total from stats: ${totalFromStats}`)
  console.log(`\n⚠️  Difference: ${totalFromStats - totalLogs} missing logs`)
}

checkAllLogs().catch(console.error)
