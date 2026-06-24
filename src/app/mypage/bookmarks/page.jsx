'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { getBookmarks, toggleBookmark } from '@/lib/userStorage'

export default function BookmarksPage() {
  const router = useRouter()
  const { user, isAuthenticated, mounted } = useAuth()
  const resumeUserId = user?.uid || user?.id || ''

  const [jobs, setJobs] = useState([])

  // 필터 상태
  const [filters, setFilters] = useState({
    urgent: false,
    entry: false,
    ai: false
  })

  // 로그인 체크
  useEffect(() => {
    if (mounted && !isAuthenticated) router.replace('/login')
  }, [mounted, isAuthenticated, router])

  // 북마크 로딩
  useEffect(() => {
    if (!mounted || !isAuthenticated) return
    setJobs(getBookmarks(resumeUserId))
  }, [mounted, isAuthenticated, resumeUserId])

  // 필터링
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (filters.urgent) {
        const deadline = job.deadline || ''
        const isUrgent = deadline.includes('D-') || job.urgent === true
        if (!isUrgent) return false
      }

      if (filters.entry) {
        const career = job.career || ''
        const isEntry =
          career.includes('신입') || career.includes('무관')
        if (!isEntry) return false
      }

      if (filters.ai) {
        const title = job.title || ''
        const isAI =
          title.includes('AI') ||
          title.includes('LLM') ||
          title.includes('데이터') ||
          job.category === 'AI'
        if (!isAI) return false
      }

      return true
    })
  }, [jobs, filters])

  if (!mounted || !isAuthenticated) return null

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">북마크 공고</h1>

      {/* ================= 필터 ================= */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() =>
            setFilters(prev => ({ ...prev, urgent: !prev.urgent }))
          }
          className={`px-3 py-1 rounded-full border transition ${
            filters.urgent
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-600'
          }`}
        >
          마감임박
        </button>

        <button
          onClick={() =>
            setFilters(prev => ({ ...prev, entry: !prev.entry }))
          }
          className={`px-3 py-1 rounded-full border transition ${
            filters.entry
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-600'
          }`}
        >
          신입가능
        </button>

        <button
          onClick={() =>
            setFilters(prev => ({ ...prev, ai: !prev.ai }))
          }
          className={`px-3 py-1 rounded-full border transition ${
            filters.ai
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-600'
          }`}
        >
          AI직무
        </button>
      </div>

      {/* ================= 리스트 ================= */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white border rounded-2xl p-8 text-gray-500">
          조건에 맞는 북마크 공고가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-xl p-4 relative"
            >
              {/* 북마크 아이콘 (메인과 동일) */}
              <button
                onClick={() =>
                  setJobs(toggleBookmark(job, resumeUserId))
                }
                className="absolute top-4 right-4"
                aria-label="북마크"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="#2563eb"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 3.75C6 3.33579 6.33579 3 6.75 3H17.25C17.6642 3 18 3.33579 18 3.75V21L12 16.5L6 21V3.75Z"
                    stroke="#2563eb"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <p className="text-gray-500">{job.company}</p>

              <button
                onClick={() => router.push(`/jobs/${job.id}`)}
                className="font-semibold hover:text-blue-500 transition-colors"
              >
                {job.title}
              </button>

              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-slate-100 rounded text-gray-500">
                  {job.location}
                </span>
                <span className="text-xs px-2 py-1 bg-slate-100 rounded text-gray-500">
                  {job.career}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}