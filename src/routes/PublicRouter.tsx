import React from 'react'
import { useAuth } from '@/context/useAuth'
import { Navigate } from 'react-router-dom'

const PublicRouter = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  if (user) {
    return <Navigate to="/dashboard" replace />
  } else {
    return children
  }
}

export default PublicRouter
