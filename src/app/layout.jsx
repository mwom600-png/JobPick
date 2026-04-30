import { AuthProvider } from '@/context/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'
import Navbar from '@/components/Navbar'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import './globals.css'

export const metadata = {
  title: 'JOB PICK - AI 기반 이력서/채용공고 매칭',
  description: 'AI 기반 이력서/채용공고 매칭 서비스',
  manifest: '/manifest.json',
  icons: {
    icon: '/brand-logo.svg',
    apple: '/brand-logo.svg',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 text-gray-800 pb-20 md:pb-0">
        <AuthProvider>
          <NotificationProvider>
            <ServiceWorkerRegistration />
            <Navbar />
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}