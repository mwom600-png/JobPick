'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function MenuIcon({ type, active }) {
  const stroke = active ? '#ffffff' : '#475569'
  const common = { stroke, strokeWidth: '2', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }

  if (type === 'home') {
    return <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 10.5L12 4L20 10.5V20H14.5V14.5H9.5V20H4V10.5Z" {...common} /></svg>
  }
  if (type === 'jobs') {
    return <svg width="22" height="22" viewBox="0 0 24 24"><rect x="3.5" y="7" width="17" height="12.5" rx="2" {...common} /><path d="M8 7V5.5H16V7" {...common} /></svg>
  }
  if (type === 'intern') {
    return <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 10L12 5L20 10L12 14L4 10Z" {...common} /><path d="M7 12V15.5C8.8 17 10.2 17.7 12 17.7C13.8 17.7 15.2 17 17 15.5V12" {...common} /></svg>
  }
  if (type === 'resume') {
    return <svg width="22" height="22" viewBox="0 0 24 24"><path d="M7 3.5H14L18 7.5V20H7V3.5Z" {...common} /><path d="M14 3.5V7.5H18" {...common} /><path d="M9.5 12H15.5M9.5 15H15.5" {...common} /></svg>
  }
  if (type === 'recent') {
    return <svg width="22" height="22" viewBox="0 0 24 24"><path d="M3.5 12C5.3 8.3 8.4 6.5 12 6.5C15.6 6.5 18.7 8.3 20.5 12C18.7 15.7 15.6 17.5 12 17.5C8.4 17.5 5.3 15.7 3.5 12Z" {...common} /><circle cx="12" cy="12" r="2.8" {...common} /></svg>
  }
  if (type === 'bookmarks') {
    return <svg width="22" height="22" viewBox="0 0 24 24"><rect x="4" y="4.5" width="9" height="15" rx="1.8" {...common} /><rect x="11" y="8" width="9" height="11.5" rx="1.8" {...common} /></svg>
  }
  return <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5" {...common} /><path d="M5 20C5 16.5 8 14.5 12 14.5C16 14.5 19 16.5 19 20" {...common} /></svg>
}

export default function SlideMenu({ isOpen, onClose }) {
  const pathname = usePathname()

  if (!isOpen) return null

  const mainItems = [
    { href: '/', icon: 'home', label: '홈' },
    { href: '/jobs', icon: 'jobs', label: '채용공고' },
    { href: '/intern', icon: 'intern', label: '신입·인턴' },
  ]

  const myPageItems = [
    { href: '/mypage/resumes', icon: 'resume', label: '이력서 관리' },
    { href: '/mypage/recent', icon: 'recent', label: '최근 본 공고' },
    { href: '/mypage/bookmarks', icon: 'bookmarks', label: '관심기업' },
    { href: '/mypage', icon: 'mypage', label: '마이페이지' },
  ]

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 flex flex-col animate-slide-in-left"
        role="dialog"
        aria-label="메뉴"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-primary">메뉴</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="메뉴 닫기"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <p className="text-xs text-gray-400 font-medium mb-3">메인</p>
            <ul className="space-y-1">
              {mainItems.map((item) => {
                const isActive = pathname === item.href || (item.href === '/jobs' && pathname.startsWith('/jobs'))
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive ? 'bg-primary text-white' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-lg"><MenuIcon type={item.icon} active={isActive} /></span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-3">마이페이지</p>
            <ul className="space-y-1">
              {myPageItems.map((item) => {
                const isActive = pathname === item.href
                return (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive ? 'bg-primary text-white' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg"><MenuIcon type={item.icon} active={isActive} /></span>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                </li>
              )})}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  )
}
