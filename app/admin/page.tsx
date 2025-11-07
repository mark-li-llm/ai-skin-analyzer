import { getRecentLogs, getUserStats, getRedisClient, type AnalysisLog, type UserStats } from '@/lib/logging'
import { LogoutButton } from './LogoutButton'

export const metadata = {
  title: 'Admin Dashboard | AI Skin Analyzer',
  description: 'Usage analytics and monitoring',
}

// Force dynamic rendering (don't try to pre-render at build time)
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  // Fetch all data in parallel
  let logs: AnalysisLog[] = []
  let userStats: UserStats[] = []
  let uniqueImages: number = 0
  let error: string | null = null

  try {
    const results = await Promise.all([
      getRecentLogs(50).catch(() => []),
      getUserStats().catch(() => []),
      getRedisClient().scard('images:analyzed').catch(() => 0)
    ])

    logs = results[0]
    userStats = results[1]
    uniqueImages = results[2] as number
  } catch (e) {
    error = 'Failed to load data'
  }

  // Calculate total analyses from user stats (not just recent logs)
  const totalAnalyses = userStats.reduce((sum, user) => sum + user.totalAnalyses, 0)
  const duplicates = Math.max(0, totalAnalyses - uniqueImages)
  const duplicatePercentage = totalAnalyses > 0 ? Math.round((duplicates / totalAnalyses) * 100) : 0

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <LogoutButton />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mb-8 space-y-2">
        <p><strong>Total Analyses (All Time):</strong> {totalAnalyses}</p>
        <p><strong>Recent Logs (Last 50):</strong> {logs.length}</p>
        <p><strong>Unique Users:</strong> {userStats.length}</p>
        <p><strong>Unique Images:</strong> {uniqueImages}</p>
        <p><strong>Duplicates:</strong> {duplicates} ({duplicatePercentage}%)</p>
      </div>

      {/* User Stats */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">User Statistics</h2>
        {userStats.length === 0 ? (
          <p className="text-gray-500">No user stats found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Total Analyses</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Last Used</th>
                </tr>
              </thead>
              <tbody>
                {userStats.map((stat) => (
                  <tr key={stat.user} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {stat.user}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {stat.user.startsWith('anon-') ? 'Anonymous' : 'Named'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {stat.totalAnalyses}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {new Date(stat.lastUsed).toLocaleString('en-US', {
                        timeZone: 'America/New_York'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent Logs */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Recent Logs</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500">No logs found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Skin Type</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Confidence</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <>
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {new Date(log.timestamp).toLocaleString('en-US', {
                          timeZone: 'America/New_York'
                        })}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {log.user}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {log.analysisResult?.skinType || '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {log.analysisResult?.confidence
                          ? `${Math.round(log.analysisResult.confidence * 100)}%`
                          : '-'
                        }
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {log.duration ? `${log.duration}ms` : '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {log.status}
                      </td>
                    </tr>
                    <tr key={`${log.id}-details`}>
                      <td colSpan={6} className="border border-gray-300 px-4 py-2 bg-gray-50">
                        <details className="group">
                          <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium">
                            Show JSON
                          </summary>
                          <pre className="mt-2 p-3 bg-white border border-gray-200 rounded text-xs overflow-x-auto">
                            {JSON.stringify(log, null, 2)}
                          </pre>
                        </details>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
