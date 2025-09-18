'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  showLoader?: boolean
}

export default function AuthGuard({
  children,
  redirectTo = '/auth/login',
  showLoader = true
}: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          console.log('User not authenticated, redirecting to:', redirectTo)
          setIsAuthenticated(false)
          router.push(redirectTo)
          return
        }

        console.log('User authenticated:', user.id)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        router.push(redirectTo)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id)

      if (event === 'SIGNED_OUT' || !session?.user) {
        setIsAuthenticated(false)
        router.push(redirectTo)
      } else if (event === 'SIGNED_IN' && session?.user) {
        setIsAuthenticated(true)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, redirectTo])

  // Show loading state
  if (isLoading && showLoader) {
    return (
      <div className="min-h-screen bg-[#0b021c] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-[#afafaf]">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Render children if authenticated
  return <>{children}</>
}