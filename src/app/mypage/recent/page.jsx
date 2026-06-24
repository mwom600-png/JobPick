'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { getBookmarks, getRecentJobs, toggleBookmark } from '@/lib/userStorage'

function getJobKey(job) {
  return String(job?.id || job?.jobId || '')
}

/** 최근 시간 표시 함수 */
function formatTimeAgo(date) {
  if (!date) return ''

  const now = new Date()
  const past = new Date(date)
  const diff = Math.floor((now - past) / 1000) // seconds

  if (diff < 60) return '방금 전'
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  if (diff < 172800) return '어제'

  return `${Math.floor(diff / 86400)}일 전`
}

/** 중복 제거 */
function dedupeJobs(jobs) {
  const map = new Map()

  jobs.forEach(job => {
    const key = getJobKey(job)
    if (!map.has(key)) {
      map.set(key, job)
    }
  })

  return Array.from(map.values())
}

export default function RecentJobsPage() {
  const router = useRouter()
  const { user, isAuthenticated, mounted } = useAuth()
  const resumeUserId = user?.uid || user?.id || ''

  const [jobs, setJobs] = useState([])
  const [bookmarkIds, setBookmarkIds] = useState([])

  useEffect(() => {
    if (mounted && !isAuthenticated) router.replace('/login')
  }, [mounted, isAuthenticated, router])

  useEffect(() => {
    if (!mounted || !isAuthenticated) return

    const recent = getRecentJobs()

    setJobs(dedupeJobs(recent)) // ✅ 중복 제거
    setBookmarkIds(getBookmarks(resumeUserId).map(getJobKey))
  }, [mounted, isAuthenticated, resumeUserId])

  if (!mounted || !isAuthenticated) return null

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">최근 본 공고</h1>

      {jobs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-gray-500 text-center">
          최근 본 공고가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const jobKey = getJobKey(job)
            const isBookmarked = bookmarkIds.includes(jobKey)

            return (
              <div
                key={jobKey}
                className="bg-white border border-gray-200 rounded-xl p-5 relative"
              >
                {/* 북마크 */}
                <button
                  onClick={() => {
                    const next = toggleBookmark(job, resumeUserId)
                    setBookmarkIds(next.map(getJobKey))
                  }}
                  className="absolute top-5 right-5"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill={isBookmarked ? '#2563eb' : '#ffffff'}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 3.75C6 3.33579 6.33579 3 6.75 3H17.25C17.6642 3 18 3.33579 18 3.75V21L12 16.5L6 21V3.75Z"
                      stroke={isBookmarked ? '#2563eb' : '#94a3b8'}
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <p className="text-sm text-gray-500 mb-1 pr-8">
                  {job.company}
                </p>

                <button
                  onClick={() => {
                    if (job.sourceUrl) {
                      window.open(job.sourceUrl, '_blank', 'noopener,noreferrer')
                      return
                    }
                    router.push(`/jobs/${jobKey}`)
                  }}
                  className="text-lg font-bold text-left hover:text-primary transition-colors mb-2 pr-8 block w-full"
                >
                  {job.title || '제목 없음'}
                </button>

                {/* ⭐ 최근 본 시간 */}
                <p className="text-xs text-gray-400 mb-2">
                  {formatTimeAgo(job.viewedAt)}
                </p>

                <div className="flex gap-2 flex-wrap">
                  {job.location && (
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded text-gray-500">
                      {job.location}
                    </span>
                  )}
                  {job.career && (
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded text-gray-500">
                      {job.career}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}