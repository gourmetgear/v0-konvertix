"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { User } from "lucide-react"

interface ProfileAvatarProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export default function ProfileAvatar({ className = "", size = "md" }: ProfileAvatarProps) {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  }

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('profile_picture_url')
            .eq('id', user.id)
            .single()

          if (error) {
            console.error('Error fetching profile:', error)
          } else if (profile?.profile_picture_url) {
            setProfilePictureUrl(profile.profile_picture_url)
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  if (isLoading) {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-full animate-pulse`} />
    )
  }

  if (profilePictureUrl) {
    return (
      <img
        src={profilePictureUrl}
        alt="Profile"
        className={`${sizeClasses[size]} ${className} rounded-full object-cover border border-[#3f3f3f]`}
        onError={() => setProfilePictureUrl(null)}
      />
    )
  }

  // Fallback to gradient with user icon
  return (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-full flex items-center justify-center`}>
      <User className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'} text-white`} />
    </div>
  )
}