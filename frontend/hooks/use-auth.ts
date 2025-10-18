"use client"

import { useState, useCallback, useEffect } from "react"
import {
  login as apiLogin,
  logout as apiLogout,
  getAuthState,
  getMe,
} from "@/lib/api"

export function useAuth() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const authState = getAuthState()

  useEffect(() => {
    async function checkUser() {
      try {
        await getMe()
      } catch (e) {
        // error is handled in getMe, which sets authState to null
      } finally {
        setIsInitialLoading(false)
      }
    }
    checkUser()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsProcessing(true)
    setError(null)
    try {
      await apiLogin(email, password)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      return false
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsProcessing(true)
    try {
      await apiLogout()
      // router.push('/') // Optional: redirect after logout
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed"
      setError(message)
      return false
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return {
    isAuthenticated: !!authState,
    user: authState,
    isLoading: isProcessing || isInitialLoading, // Combined loading state
    isProcessing,
    isInitialLoading,
    error,
    login,
    logout,
  }
}
