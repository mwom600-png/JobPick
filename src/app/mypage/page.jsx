'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

function ActivityIcon({ type }) {
  const common = { stroke: '#475569', strokeWidth: '2', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (type === 'resume') return <svg width="22" height="22" viewBox="0 0 24 24"><path d="M7 3.5H14L18 7.5V20H7V3.5Z" {...common} /><path d="M14 3.5V7.5H18" {...common} /><path d="M9.5 12H15.5M9.5 15H15.5" {...common} /></svg>
  if (type === 'recent') return <svg width="22" height="22" viewBox="0 0 24 24"><path d="M3.5 12C5.3 8.3 8.4 6.5 12 6.5C15.6 6.5 18.7 8.3 20.5 12C18.7 15.7 15.6 17.5 12 17.5C8.4 17.5 5.3 15.7 3.5 12Z" {...common} /><circle cx="12" cy="12" r="2.8" {...common} /></svg>
  return <svg width="22" height="22" viewBox="0 0 24 24"><rect x="4" y="4.5" width="9" height="15" rx="1.8" {...common} /><rect x="11" y="8" width="9" height="11.5" rx="1.8" {...common} /></svg>
}

const ACTIVITY_ITEMS = [
  { href: '/mypage/resumes', icon: 'resume', label: '이력서 관리', key: 'resumes' },
  { href: '/mypage/recent', icon: 'recent', label: '최근 본 공고', key: 'recent' },
  { href: '/mypage/bookmarks', icon: 'bookmarks', label: '관심기업', key: 'bookmarks' },
]

export default function MyPage() {
  const { user, isAuthenticated, mounted, logout, updateProfile } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [nicknameDraft, setNicknameDraft] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace('/login')
    }
  }, [mounted, isAuthenticated, router])

  useEffect(() => {
    if (!mounted) return
    setNicknameDraft(user?.name || '')
  }, [mounted, user?.name])

  const handleLogout = () => {
    logout()
    router.replace('/')
  }

  if (!mounted || !isAuthenticated) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  const name = user?.name || '홍길동'
  const email = user?.email || 'example@email.com'
  const initial = name.charAt(0)
  const profileImage = user?.profileImage || null

  const handleNicknameSave = async () => {
    const next = String(nicknameDraft || '').trim()
    if (!next) return
    setIsSaving(true)
    try {
      updateProfile({ name: next })
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePickPhoto = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type?.startsWith('image/')) {
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null
      if (dataUrl) updateProfile({ profileImage: dataUrl })
      e.target.value = ''
    }
    reader.onerror = () => {
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    updateProfile({ profileImage: null })
  }

  const handleWithdraw = () => {
    setShowWithdrawModal(true)
  }

  const confirmWithdraw = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jobpick_user')
      localStorage.removeItem('jobpick_accounts')
      localStorage.removeItem('jobpick_resumes')
      localStorage.removeItem('jobpick_recent_jobs')
      localStorage.removeItem('jobpick_bookmarks')
    }
    logout()
    router.replace('/')
  }

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      {/* 프로필 카드 */}
      <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary text-2xl font-bold flex-shrink-0 overflow-hidden shadow-lg">
              {profileImage ? (
                <img src={profileImage} alt="프로필" className="w-full h-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{name} 님</h2>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium hover:bg-gray-50 transition-colors"
          >
            편집
          </button>
        </div>

        {isEditing && (
          <div className="flex flex-col gap-3 bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex gap-2">
              <input
                value={nicknameDraft}
                onChange={(e) => setNicknameDraft(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                placeholder="닉네임"
              />
              <button
                type="button"
                onClick={handleNicknameSave}
                disabled={isSaving}
                className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
              >
                저장
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <button
                type="button"
                onClick={handlePickPhoto}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                사진 첨부
              </button>
              {profileImage && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 내 활동 */}
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4">내 활동</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ACTIVITY_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-2xl text-primary"><ActivityIcon type={item.icon} /></span>
                <span className="font-medium text-sm text-gray-800">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 계정 관리 */}
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4">계정 관리</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl border-2 border-red-500 bg-red-50 text-red-600 font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors text-sm"
          >
            <span className="text-base">↪</span>
            로그아웃
          </button>
          <button
            onClick={handleWithdraw}
            className="w-full py-3 rounded-xl border-2 border-gray-300 bg-gray-50 text-gray-600 font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm"
          >
            <span className="text-base">🗑</span>
            회원탈퇴
          </button>
        </div>
      </section>

      {/* 회원탈퇴 확인 모달 */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">회원탈퇴</h3>
            <p className="text-gray-600 mb-6">
              정말로 회원탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmWithdraw}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
