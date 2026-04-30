'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

function InputIcon({ type }) {
  const common = { stroke: '#64748b', strokeWidth: '2', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (type === 'mail') return <svg width="18" height="18" viewBox="0 0 24 24"><rect x="3.5" y="6" width="17" height="12" rx="2" {...common} /><path d="M4.5 7L12 12.5L19.5 7" {...common} /></svg>
  if (type === 'lock') return <svg width="18" height="18" viewBox="0 0 24 24"><rect x="5.5" y="10.5" width="13" height="9.5" rx="2" {...common} /><path d="M8.5 10.5V8.5C8.5 6.6 10.1 5 12 5C13.9 5 15.5 6.6 15.5 8.5V10.5" {...common} /></svg>
  if (type === 'eye') return <svg width="18" height="18" viewBox="0 0 24 24"><path d="M3.5 12C5.3 8.3 8.4 6.5 12 6.5C15.6 6.5 18.7 8.3 20.5 12C18.7 15.7 15.6 17.5 12 17.5C8.4 17.5 5.3 15.7 3.5 12Z" {...common} /><circle cx="12" cy="12" r="2.8" {...common} /></svg>
  return <svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 4L20 20" {...common} /><path d="M9.2 9.2A3.8 3.8 0 0 0 12 15.8A3.8 3.8 0 0 0 14.8 13" {...common} /><path d="M6.4 6.4C5.2 7.4 4.2 8.6 3.5 12C5.3 15.7 8.4 17.5 12 17.5C14 17.5 15.8 16.9 17.3 15.9" {...common} /><path d="M9.7 6.7C10.4 6.6 11.2 6.5 12 6.5C15.6 6.5 18.7 8.3 20.5 12C20 13.1 19.5 14 18.8 14.8" {...common} /></svg>
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { login, mounted } = useAuth()
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')
    if (!mounted) {
      console.warn('[Login] 제출 차단: 아직 mounted 되지 않음')
      return
    }
    if (email && password) {
      const result = login(email, password)
      if (result.ok) {
        router.replace('/')
        return
      }

      if (result.reason === 'not_found') {
        console.warn('[Login] 로그인 실패(not_found): 회원가입 페이지로 이동', { email })
        router.replace(`/signup?email=${encodeURIComponent(email)}`)
        return
      }

      console.warn('[Login] 로그인 실패', { reason: result.reason, email })
      setErrorMessage('아이디 또는 비밀번호가 잘못되었습니다. 아이디와 비밀번호를 정확히 입력해주세요')
    }
  }

  return (
    <main className="min-h-[calc(100vh-60px)] flex items-center justify-center py-20 px-8 bg-gradient-to-br from-sky-100 to-sky-50">
      <div className="w-full max-w-[560px] bg-white rounded-2xl p-12 min-h-[760px] shadow-lg flex flex-col justify-center">
        <div className="flex items-center justify-center gap-2 font-bold text-3xl text-gray-800 mb-8">
          <img src="/brand-logo.svg" alt="JOB PICK 로고" className="w-8 h-8 object-contain" />
          <span>JOB PICK</span>
        </div>
        <h1 className="text-2xl font-bold text-center mb-10">로그인</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">이메일</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <span className="mr-2 opacity-80"><InputIcon type="mail" /></span>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 py-3 border-none outline-none"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">비밀번호</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <span className="mr-2 opacity-80"><InputIcon type="lock" /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 py-3 border-none outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-1 p-1"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                <InputIcon type={showPassword ? 'eyeOff' : 'eye'} />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" />
              로그인 상태 유지
            </label>
            <Link href="/forgot-password" className="text-primary font-medium hover:underline">
              비밀번호 찾기
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            로그인
          </button>
          {errorMessage && (
            <p className="text-sm text-red-600 text-center -mt-2">{errorMessage}</p>
          )}
          <p className="text-center text-sm text-gray-500">
            아직 계정이 없으신가요?{' '}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
