'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

function InputIcon({ type }) {
  const common = { stroke: '#64748b', strokeWidth: '2', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (type === 'user') return <svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.3" {...common} /><path d="M5 19C5 15.8 7.9 14 12 14C16.1 14 19 15.8 19 19" {...common} /></svg>
  if (type === 'mail') return <svg width="18" height="18" viewBox="0 0 24 24"><rect x="3.5" y="6" width="17" height="12" rx="2" {...common} /><path d="M4.5 7L12 12.5L19.5 7" {...common} /></svg>
  if (type === 'lock') return <svg width="18" height="18" viewBox="0 0 24 24"><rect x="5.5" y="10.5" width="13" height="9.5" rx="2" {...common} /><path d="M8.5 10.5V8.5C8.5 6.6 10.1 5 12 5C13.9 5 15.5 6.6 15.5 8.5V10.5" {...common} /></svg>
  if (type === 'eye') return <svg width="18" height="18" viewBox="0 0 24 24"><path d="M3.5 12C5.3 8.3 8.4 6.5 12 6.5C15.6 6.5 18.7 8.3 20.5 12C18.7 15.7 15.6 17.5 12 17.5C8.4 17.5 5.3 15.7 3.5 12Z" {...common} /><circle cx="12" cy="12" r="2.8" {...common} /></svg>
  return <svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 4L20 20" {...common} /><path d="M9.2 9.2A3.8 3.8 0 0 0 12 15.8A3.8 3.8 0 0 0 14.8 13" {...common} /><path d="M6.4 6.4C5.2 7.4 4.2 8.6 3.5 12C5.3 15.7 8.4 17.5 12 17.5C14 17.5 15.8 16.9 17.3 15.9" {...common} /><path d="M9.7 6.7C10.4 6.6 11.2 6.5 12 6.5C15.6 6.5 18.7 8.3 20.5 12C20 13.1 19.5 14 18.8 14.8" {...common} /></svg>
}

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [marketingAgreed, setMarketingAgreed] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { signup } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const queryEmail = params.get('email')
    if (queryEmail) setEmail(queryEmail)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')
    if (!termsAgreed) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
    if (password.length < 8) {
      alert('비밀번호는 최소 8자 이상 입력해주세요.')
      return
    }
    const result = signup(name, email, password)
    if (!result.ok && result.reason === 'already_exists') {
      setErrorMessage('이미 가입되어있는 사용자입니다.')
      return
    }
    router.replace('/')
  }

  return (
    <main className="min-h-[calc(100vh-60px)] flex items-center justify-center py-20 px-8 bg-gradient-to-br from-sky-100 to-sky-50">
      <div className="w-full max-w-[560px] bg-white rounded-2xl p-12 min-h-[920px] shadow-lg flex flex-col justify-center">
        <div className="flex items-center justify-center gap-2 font-bold text-4xl text-gray-800 mb-8">
          <img src="/brand-logo.svg" alt="JOB PICK 로고" className="w-8 h-8 object-contain" />
          <span>JOB PICK</span>
        </div>
        <h1 className="text-2xl font-bold text-center mb-10">회원가입</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">이름</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <span className="mr-2 opacity-80"><InputIcon type="user" /></span>
              <input
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 py-3 border-none outline-none"
                required
              />
            </div>
          </div>
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
                placeholder="........"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 py-3 border-none outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-1 p-1"
              >
                <InputIcon type={showPassword ? 'eyeOff' : 'eye'} />
              </button>
            </div>
            <span className="text-xs text-gray-500">최소 8자 이상 입력해주세요</span>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">비밀번호 확인</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <span className="mr-2 opacity-80"><InputIcon type="lock" /></span>
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="........"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="flex-1 py-3 border-none outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="ml-1 p-1"
              >
                <InputIcon type={showPasswordConfirm ? 'eyeOff' : 'eye'} />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} required />
              (필수) 이용약관 및 개인정보 처리방침에 동의합니다
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={marketingAgreed} onChange={(e) => setMarketingAgreed(e.target.checked)} />
              (선택) 마케팅 정보 수신에 동의합니다
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            회원가입
          </button>
          {errorMessage && (
            <p className="text-sm text-red-600 text-center -mt-2">{errorMessage}</p>
          )}
          <p className="text-center text-sm text-gray-500">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              로그인
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
