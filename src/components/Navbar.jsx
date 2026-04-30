'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'
import SlideMenu from './SlideMenu'
import NotificationPanel from './NotificationPanel'

function TabIcon({ type, active }) {
  const stroke = active ? '#2563eb' : '#94a3b8'
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
  return <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5" {...common} /><path d="M5 20C5 16.5 8 14.5 12 14.5C16 14.5 19 16.5 19 20" {...common} /></svg>
}

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const { unreadCount } = useNotifications()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)

  const showMinimal =
    pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password'
  const brandLogoSrc = '/brand-logo.svg'

  const mobileTabs = [
    { href: '/', label: '홈', icon: 'home', match: (p) => p === '/' },
    { href: '/jobs', label: '채용정보', icon: 'jobs', match: (p) => p.startsWith('/jobs') },
    { href: '/intern', label: '신입·인턴', icon: 'intern', match: (p) => p.startsWith('/intern') },
    { href: '/mypage', label: '마이페이지', icon: 'mypage', match: (p) => p.startsWith('/mypage') },
  ]

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="hidden md:flex items-center justify-between px-10 py-6 min-h-[88px]">
          <Link href="/" className="flex items-center gap-3 font-bold text-2xl text-primary">
            <img src={brandLogoSrc} alt="JOB PICK 로고" className="w-12 h-12 object-contain" />
            <span>JOB PICK</span>
          </Link>
          <div className="flex items-center gap-4">
            {showMinimal ? (
              <>
                <Link href="/login" className="text-gray-800 text-sm hover:text-primary transition-colors">
                  로그인
                </Link>
                <Link href="/signup" className="text-gray-800 text-sm hover:text-primary transition-colors">
                  회원가입
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => setNotificationOpen(true)}
                  className="relative p-2 text-xl hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="알림"
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C8.96 4 6.5 6.46 6.5 9.5V13.3L5 15.2V16H19V15.2L17.5 13.3V9.5C17.5 6.46 15.04 4 12 4Z" stroke="#111827" strokeWidth="2.2" strokeLinejoin="round" />
                    <path d="M10 18C10.4 19.2 11.1 20 12 20C12.9 20 13.6 19.2 14 18" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-primary text-white text-xs font-medium rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setMenuOpen(true)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700 transition-colors"
                >
                  메뉴
                </button>
                {!isAuthenticated && (
                  <>
                    <Link href="/login" className="text-gray-800 text-sm hover:text-primary transition-colors">
                      로그인
                    </Link>
                    <Link href="/signup" className="text-gray-800 text-sm hover:text-primary transition-colors">
                      회원가입
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="md:hidden flex items-center justify-between px-4 py-3 min-h-[56px]">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <img src={brandLogoSrc} alt="JOB PICK 로고" className="w-8 h-8 object-contain" />
            <span>JOB PICK</span>
          </Link>
          {!showMinimal && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNotificationOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="알림"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4C8.96 4 6.5 6.46 6.5 9.5V13.3L5 15.2V16H19V15.2L17.5 13.3V9.5C17.5 6.46 15.04 4 12 4Z" stroke="#111827" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M10 18C10.4 19.2 11.1 20 12 20C12.9 20 13.6 19.2 14 18" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 flex items-center justify-center bg-primary text-white text-[10px] font-medium rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="메뉴"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 7H20" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 12H20" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 17H20" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </nav>

      {!showMinimal && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
          <ul className="grid grid-cols-4 h-[72px]">
            {mobileTabs.map((tab) => {
              const active = tab.match(pathname)
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className="h-full flex flex-col items-center justify-center gap-1"
                    aria-label={tab.label}
                  >
                    <TabIcon type={tab.icon} active={active} />
                    <span className={`text-xs ${active ? 'text-primary font-semibold' : 'text-slate-500'}`}>{tab.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}

      <SlideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <NotificationPanel isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />
    </>
  )
}
