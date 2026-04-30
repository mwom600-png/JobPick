'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { addResumes, getBookmarks, getResumes, pushRecentJob, removeResume, toggleBookmark } from '@/lib/userStorage'
import { DASHBOARD_JOBS } from '@/lib/jobs'

export default function LandingPage() {
  const router = useRouter()
  const { user, isAuthenticated, mounted } = useAuth()
  const [resumes, setResumes] = useState([])
  const fileInputRef = useRef(null)
  const [showSavedResumes, setShowSavedResumes] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisDone, setAnalysisDone] = useState(false)
  const [selectedResume, setSelectedResume] = useState(null)
  const [bookmarkIds, setBookmarkIds] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const handleGetStarted = () => {
    router.push('/login')
  }

  const handleShowSavedClick = () => {
    if (!isAuthenticated) return
    setShowSavedResumes((prev) => !prev)
  }

  const handleNewUploadClick = () => {
    if (!isAuthenticated) return
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e) => {
    if (!isAuthenticated) {
      e.target.value = ''
      return
    }
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const validTypes = ['.pdf', '.doc', '.docx']
    const validFiles = files.filter((f) => {
      const ext = '.' + f.name.split('.').pop().toLowerCase()
      return validTypes.includes(ext)
    })

    if (!validFiles.length) {
      alert('PDF, DOC, DOCX 파일만 업로드 가능합니다.')
      e.target.value = ''
      return
    }

    const dateStr = new Date()
      .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .replace(/\. /g, '.')
      .replace(/\.$/, '')

    const mapped = validFiles.map((f) => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: Math.round(f.size / 1024) + ' KB',
      date: dateStr,
    }))

    setResumes(addResumes(mapped))
    setShowSavedResumes(true)
    e.target.value = ''
  }

  useEffect(() => {
    setResumes(getResumes())
    setBookmarkIds(getBookmarks().map((item) => item.id))
  }, [])

  const name = user?.name || '홍길동'

  const handleResumeAnalyze = (resume) => {
    if (!isAuthenticated) return
    setSelectedResume(resume)
    setAnalysisDone(false)
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisDone(true)
    }, 1000)
  }

  const handleDeleteResume = (resumeId) => {
    const next = removeResume(resumeId)
    setResumes(next)
    if (selectedResume?.id === resumeId) {
      setSelectedResume(null)
      setAnalysisDone(false)
    }
  }

  const handleGoJob = (job) => {
    pushRecentJob(job)
    router.push(`/jobs/${job.id}`)
  }

  const handleToggleBookmark = (job) => {
    const next = toggleBookmark(job)
    setBookmarkIds(next.map((item) => item.id))
  }

  const CATEGORIES = [
    '전체', 'IT/개발', '디자인', '마케팅', '영업', '회계', '금융/보험', '교육', '의료/바이오', '건축/시설', '공공/복지', '미디어/문화/스포츠', '고객상담/TM', '운전/운송/배송', '법무/사무/총무'
  ]

  const filteredPopularJobs = selectedCategory === '전체' 
    ? DASHBOARD_JOBS.slice(0, 10)
    : DASHBOARD_JOBS.filter((job) => job.category === selectedCategory).slice(0, 10)

  const recommendedJobs = DASHBOARD_JOBS.filter((job) => job.matchRate >= 75).slice(0, 5)

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      <section className={isAuthenticated ? "py-8" : "text-center py-12"}>
        {isAuthenticated ? (
          <>
            <h1 className="text-2xl font-bold mb-1">
              안녕하세요, <span className="text-primary">{name}</span> 님!
            </h1>
            <p className="text-gray-500">AI 기반 이력서/채용공고 매칭 서비스예요.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-primary mb-2">로그인을 해주세요!</h1>
            <p className="text-gray-500 mb-6">AI 기반 이력서/채용공고 매칭 서비스예요.</p>
            <button
              onClick={handleGetStarted}
              className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              로그인하고 시작하기
            </button>
          </>
        )}
      </section>

      <section className="mt-6 md:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* AI 커리어 매칭 분석 1 */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 flex flex-col min-h-[600px]">
            <h2 className="text-lg font-bold mb-2">⭐ AI 커리어 매칭 분석</h2>
            <p className="text-gray-600 text-xs mb-3">
              로그인 후 이력서를 업로드하면 AI가 분석하여 맞춤 채용공고를 추천해드립니다.
            </p>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 bg-white flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={handleShowSavedClick}
                  disabled={!isAuthenticated}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    showSavedResumes ? 'bg-primary text-white' : 'bg-slate-100 text-gray-700'
                  } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  등록한 이력서 불러오기
                </button>
                <button
                  type="button"
                  onClick={handleNewUploadClick}
                  disabled={!isAuthenticated}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-white ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  새 이력서 등록하기
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {isAuthenticated
                  ? 'PDF, DOC, DOCX 파일을 업로드하거나, 등록한 이력서를 선택해 분석해보세요.'
                  : 'AI 커리어 매칭 분석은 로그인/회원가입 후 사용할 수 있습니다.'}
              </p>
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="mb-2 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium"
                >
                  로그인하고 사용하기
                </button>
              )}
              {showSavedResumes && (
                <div className="flex flex-col gap-2 mt-2">
                  {resumes.length === 0 ? (
                    <p className="text-xs text-gray-500">등록된 이력서가 없습니다. 새 이력서를 등록해 주세요.</p>
                  ) : (
                    resumes.map((r) => (
                      <div key={r.id} className={`flex items-center justify-between gap-2 p-2 border rounded-lg bg-white ${
                        selectedResume?.id === r.id ? 'border-primary' : 'border-gray-200'
                      }`}>
                        <button
                          type="button"
                          onClick={() => handleResumeAnalyze(r)}
                          className="flex items-center gap-2 text-left flex-1"
                        >
                          <span className="text-lg">📄</span>
                          <div className="flex flex-col">
                            <span className="font-medium text-xs">{r.name}</span>
                            <span className="text-xs text-gray-500">
                              {r.size} · {r.date}
                            </span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteResume(r.id)}
                          className="text-xs px-2 py-1 rounded bg-red-50 text-red-600"
                        >
                          삭제
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
              {isAnalyzing && (
                <div className="mt-3 p-3 bg-white/80 rounded-lg flex items-center gap-2 text-xs text-gray-700">
                  <div className="w-4 h-4 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                  <span>AI가 이력서를 분석하고 있어요...</span>
                </div>
              )}
            </div>
            {analysisDone && (
              <div className="mt-3 bg-white rounded-xl p-3 border border-blue-200">
                <p className="text-xs text-gray-700 mb-2 font-medium">
                  {name} 님의 이력서 기준으로 아래 채용 공고를 추천드려요.
                </p>
                <div className="flex flex-col gap-2">
                  {DASHBOARD_JOBS.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-center justify-between gap-2 border border-gray-200 rounded-lg p-2">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">{job.company}</p>
                        <button onClick={() => handleGoJob(job)} className="font-medium text-xs text-left hover:text-primary transition-colors">
                          {job.title}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.matchRate && (
                          <span className="text-primary font-bold text-sm">{job.matchRate}%</span>
                        )}
                        <button onClick={() => handleToggleBookmark(job)} aria-label="북마크">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarkIds.includes(job.id) ? '#2563eb' : '#ffffff'} xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 3.75C6 3.33579 6.33579 3 6.75 3H17.25C17.6642 3 18 3.33579 18 3.75V21L12 16.5L6 21V3.75Z"
                              stroke="#94a3b8"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isAuthenticated && (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/jobs')}
                  className="px-4 py-1.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-xs"
                >
                  채용공고로 이동
                </button>
              </div>
            )}
          </div>

          {/* 인기 공고 */}
          <div className="bg-white rounded-xl p-3 border border-gray-200 flex flex-col min-h-[600px]">
            <h2 className="text-base font-bold mb-2">인기 공고</h2>
            <div className="mb-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2 py-1.5 border border-gray-200 rounded-md text-xs bg-white w-full"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[540px] flex flex-col gap-2">
              {filteredPopularJobs.map((job) => (
                <div key={job.id} className="relative bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                  <button onClick={() => handleToggleBookmark(job)} className="absolute top-2 right-2" aria-label="북마크">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarkIds.includes(job.id) ? '#2563eb' : '#ffffff'} xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 3.75C6 3.33579 6.33579 3 6.75 3H17.25C17.6642 3 18 3.33579 18 3.75V21L12 16.5L6 21V3.75Z"
                        stroke="#94a3b8"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button onClick={() => handleGoJob(job)} className="font-semibold mb-1 hover:text-primary transition-colors text-left text-xs">
                    {job.title}
                  </button>
                  <p className="text-xs text-gray-500 mb-1">{job.company}</p>
                  <div className="flex gap-1 flex-wrap">
                    <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-gray-500">{job.career}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-gray-500">{job.location}</span>
                  </div>
                </div>
              ))}
              {filteredPopularJobs.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-4">선택한 카테고리의 공고가 없습니다.</p>
              )}
            </div>
          </div>

          {/* AI 커리어 매칭 분석 2 (반복) */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 flex flex-col min-h-[600px]">
            <h2 className="text-lg font-bold mb-2">⭐ AI 커리어 매칭 분석</h2>
            <p className="text-gray-600 text-xs mb-3">
              로그인 후 이력서를 업로드하면 AI가 분석하여 맞춤 채용공고를 추천해드립니다.
            </p>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 bg-white flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={handleShowSavedClick}
                  disabled={!isAuthenticated}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    showSavedResumes ? 'bg-primary text-white' : 'bg-slate-100 text-gray-700'
                  } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  등록한 이력서 불러오기
                </button>
                <button
                  type="button"
                  onClick={handleNewUploadClick}
                  disabled={!isAuthenticated}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-white ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  새 이력서 등록하기
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {isAuthenticated
                  ? 'PDF, DOC, DOCX 파일을 업로드하거나, 등록한 이력서를 선택해 분석해보세요.'
                  : 'AI 커리어 매칭 분석은 로그인/회원가입 후 사용할 수 있습니다.'}
              </p>
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="mb-2 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium"
                >
                  로그인하고 사용하기
                </button>
              )}
              {showSavedResumes && (
                <div className="flex flex-col gap-2 mt-2">
                  {resumes.length === 0 ? (
                    <p className="text-xs text-gray-500">등록된 이력서가 없습니다. 새 이력서를 등록해 주세요.</p>
                  ) : (
                    resumes.map((r) => (
                      <div key={r.id} className={`flex items-center justify-between gap-2 p-2 border rounded-lg bg-white ${
                        selectedResume?.id === r.id ? 'border-primary' : 'border-gray-200'
                      }`}>
                        <button
                          type="button"
                          onClick={() => handleResumeAnalyze(r)}
                          className="flex items-center gap-2 text-left flex-1"
                        >
                          <span className="text-lg">📄</span>
                          <div className="flex flex-col">
                            <span className="font-medium text-xs">{r.name}</span>
                            <span className="text-xs text-gray-500">
                              {r.size} · {r.date}
                            </span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteResume(r.id)}
                          className="text-xs px-2 py-1 rounded bg-red-50 text-red-600"
                        >
                          삭제
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
              {isAnalyzing && (
                <div className="mt-3 p-3 bg-white/80 rounded-lg flex items-center gap-2 text-xs text-gray-700">
                  <div className="w-4 h-4 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                  <span>AI가 이력서를 분석하고 있어요...</span>
                </div>
              )}
            </div>
            {analysisDone && (
              <div className="mt-3 bg-white rounded-xl p-3 border border-blue-200">
                <p className="text-xs text-gray-700 mb-2 font-medium">
                  {name} 님의 이력서 기준으로 아래 채용 공고를 추천드려요.
                </p>
                <div className="flex flex-col gap-2">
                  {DASHBOARD_JOBS.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-center justify-between gap-2 border border-gray-200 rounded-lg p-2">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">{job.company}</p>
                        <button onClick={() => handleGoJob(job)} className="font-medium text-xs text-left hover:text-primary transition-colors">
                          {job.title}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.matchRate && (
                          <span className="text-primary font-bold text-sm">{job.matchRate}%</span>
                        )}
                        <button onClick={() => handleToggleBookmark(job)} aria-label="북마크">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarkIds.includes(job.id) ? '#2563eb' : '#ffffff'} xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 3.75C6 3.33579 6.33579 3 6.75 3H17.25C17.6642 3 18 3.33579 18 3.75V21L12 16.5L6 21V3.75Z"
                              stroke="#94a3b8"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isAuthenticated && (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/jobs')}
                  className="px-4 py-1.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-xs"
                >
                  채용공고로 이동
                </button>
              </div>
            )}
          </div>

          {/* 채용공고 */}
          <div className="bg-white rounded-xl p-3 border border-gray-200 flex flex-col min-h-[600px]">
            <h2 className="text-base font-bold mb-2">채용공고</h2>
            <div className="flex-1 overflow-y-auto max-h-[540px] flex flex-col gap-2">
              {DASHBOARD_JOBS.slice(0, 10).map((job) => (
                <div key={job.id} className="relative bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                  <button onClick={() => handleToggleBookmark(job)} className="absolute top-2 right-2" aria-label="북마크">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarkIds.includes(job.id) ? '#2563eb' : '#ffffff'} xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 3.75C6 3.33579 6.33579 3 6.75 3H17.25C17.6642 3 18 3.33579 18 3.75V21L12 16.5L6 21V3.75Z"
                        stroke="#94a3b8"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button onClick={() => handleGoJob(job)} className="font-semibold mb-1 hover:text-primary transition-colors text-left text-xs">
                    {job.title}
                  </button>
                  <p className="text-xs text-gray-500 mb-1">{job.company}</p>
                  <div className="flex gap-1 flex-wrap">
                    <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-gray-500">{job.career}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-gray-500">{job.location}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    {job.matchRate && (
                      <span className="text-primary font-bold text-xs">{job.matchRate}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
