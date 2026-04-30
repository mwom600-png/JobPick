'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AUTH_KEY = 'jobpick_user'
const ACCOUNTS_KEY = 'jobpick_accounts'
const RESET_TOKENS_KEY = 'jobpick_reset_tokens'

const AuthContext = createContext(null)

function readResetTokens() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(RESET_TOKENS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeResetTokens(tokens) {
  if (typeof window === 'undefined') return
  localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens))
}

function generateResetToken() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY)
      const savedAccounts = localStorage.getItem(ACCOUNTS_KEY)
      setUser(saved ? JSON.parse(saved) : null)
      setAccounts(savedAccounts ? JSON.parse(savedAccounts) : [])
    } catch (error) {
      console.error('인증 정보 로딩 실패:', error)
      localStorage.removeItem(AUTH_KEY)
      localStorage.removeItem(ACCOUNTS_KEY)
      setUser(null)
      setAccounts([])
    }
    setMounted(true)
  }, [])

  const login = (email, password) => {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    let sourceAccounts = accounts

    if (!sourceAccounts?.length && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(ACCOUNTS_KEY)
        sourceAccounts = raw ? JSON.parse(raw) : []
      } catch (error) {
        console.warn('[Auth] accounts 로딩 실패(localStorage 파싱 오류):', error)
        sourceAccounts = []
      }
    }

    const account = sourceAccounts.find((item) => item.email === normalizedEmail)

    if (!account) {
      console.warn('[Auth] 로그인 실패: 가입된 이메일 없음', { email: normalizedEmail })
      return { ok: false, reason: 'not_found' }
    }
    if (account.password !== password) {
      console.warn('[Auth] 로그인 실패: 비밀번호 불일치', { email: normalizedEmail })
      return { ok: false, reason: 'invalid_password' }
    }

    const userData = {
      email: account.email,
      name: account.name || '홍길동',
      profileImage: account.profileImage || null,
    }
    setUser(userData)
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData))
    console.info('[Auth] 로그인 성공', { email: normalizedEmail })
    return { ok: true }
  }

  const signup = (name, email, password) => {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const alreadyExists = accounts.some((item) => item.email === normalizedEmail)

    if (alreadyExists) {
      return { ok: false, reason: 'already_exists' }
    }

    const newAccount = {
      email: normalizedEmail,
      name: name || '홍길동',
      profileImage: null,
      password,
    }
    const nextAccounts = [...accounts, newAccount]
    setAccounts(nextAccounts)
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(nextAccounts))

    const userData = { email: normalizedEmail, name: newAccount.name, profileImage: null }
    setUser(userData)
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData))
    return { ok: true }
  }

  const updateProfile = ({ name, profileImage }) => {
    if (!user?.email) return { ok: false, reason: 'not_authenticated' }

    const nextUser = {
      ...user,
      ...(name !== undefined ? { name } : null),
      ...(profileImage !== undefined ? { profileImage } : null),
    }

    setUser(nextUser)
    localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser))

    const normalizedEmail = String(user.email).trim().toLowerCase()
    const nextAccounts = accounts.map((a) =>
      a.email === normalizedEmail
        ? {
            ...a,
            ...(name !== undefined ? { name } : null),
            ...(profileImage !== undefined ? { profileImage } : null),
          }
        : a
    )
    setAccounts(nextAccounts)
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(nextAccounts))

    return { ok: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
  }

  /** 가입된 이메일이면 재설정 토큰을 저장하고, 클라이언트에서 열 수 있는 링크를 반환합니다. (실제 메일 발송은 서버 없이 시뮬레이션) */
  const requestPasswordReset = (email) => {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const account = accounts.find((item) => item.email === normalizedEmail)
    if (!account) {
      return { ok: false, reason: 'not_found' }
    }
    const token = generateResetToken()
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000
    const prev = readResetTokens()
    const next = [...prev.filter((t) => t.email !== normalizedEmail), { token, email: normalizedEmail, expiresAt }]
    writeResetTokens(next)

    const resetUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/reset-password?token=${encodeURIComponent(token)}`
        : ''
    return { ok: true, resetUrl }
  }

  const resetPasswordWithToken = (token, newPassword) => {
    if (!token || !newPassword) {
      return { ok: false, reason: 'invalid' }
    }
    const tokens = readResetTokens()
    const entry = tokens.find((t) => t.token === token && t.expiresAt > Date.now())
    if (!entry) {
      return { ok: false, reason: 'expired_or_invalid' }
    }
    const nextAccounts = accounts.map((a) =>
      a.email === entry.email ? { ...a, password: newPassword } : a
    )
    setAccounts(nextAccounts)
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(nextAccounts))
    writeResetTokens(tokens.filter((t) => t.token !== token))
    return { ok: true }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        requestPasswordReset,
        resetPasswordWithToken,
        updateProfile,
        isAuthenticated: !!user,
        mounted,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
