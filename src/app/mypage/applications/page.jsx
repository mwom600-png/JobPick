'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function ApplicationStatusPage() {
  const router = useRouter()
  const { isAuthenticated, mounted } = useAuth()

  useEffect(() => {
    if (mounted && !isAuthenticated) router.replace('/login')
  }, [mounted, isAuthenticated, router])

  useEffect(() => {
    if (mounted && isAuthenticated) router.replace('/mypage')
  }, [mounted, isAuthenticated, router])
 
  return null
 }
