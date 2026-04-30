'use client'

import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext(null)

const INITIAL_NOTIFICATIONS = [
  { id: 1, category: 'company', icon: '✨', title: '새로운 매칭 공고', content: '지민님과 95% 일치하는 당근마켓 공고가 올라왔어요', time: '3시간 전', read: false },
  { id: 2, category: 'resume', icon: '🔔', title: '이력서 업데이트 추천', content: '이력서를 업데이트하면 더 정확한 매칭을 받을 수 있어요', time: '1일 전', read: true },
  { id: 3, category: 'system', icon: '�', title: '시스템 업데이트', content: 'JobPick 서비스가 더 안정적으로 개선되었습니다.', time: '2일 전', read: true },
]

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getBadgeByCategory = () => {
    const counts = { resume: 0, company: 0 }
    notifications
      .filter((n) => !n.read)
      .forEach((n) => {
        if (n.category === 'resume') counts.resume++
        else if (n.category === 'company') counts.company++
      })
    return counts
  }

  const badgeCounts = getBadgeByCategory()

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        badgeCounts,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
