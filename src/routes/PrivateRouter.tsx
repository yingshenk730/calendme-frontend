import { useAuth } from '@/context/useAuth'
import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRouter = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()

  return user ? children : <Navigate to="/auth/login" replace />
}

export default PrivateRouter
