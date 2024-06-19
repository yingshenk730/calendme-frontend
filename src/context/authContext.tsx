import { createContext, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

interface User {
  _id: string
  email: string
  googleId?: string
  isNewUser: boolean
  isGoogle?: boolean
  avatar?: string // Ensure this includes all properties you might use
  username: string
  createdAt?: string
  updatedAt?: string
}

export const AuthContext = createContext<{
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  logout: () => void
}>({
  user: null,
  setUser: () => {},
  logout: () => {},
})
const api_url = import.meta.env.VITE_API_BASE_URL

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()
  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    navigate('/auth/login')
  }

  useEffect(() => {
    const getUserInfo = async () => {
      // if (!user) return

      const token = localStorage.getItem('token')
      if (!token) {
        setUser(null)
        return
      }
      try {
        const res = await fetch(`${api_url}/auth/get-user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        console.log('API call completed:', data)
        if (data?.success) {
          setUser(data?.user)
        } else {
          setUser(null)
        }
      } catch (e) {
        if (e instanceof Error) {
          throw new Error(e.message)
        } else {
          throw new Error('An unknown error occurred')
        }
      }
    }
    getUserInfo()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
