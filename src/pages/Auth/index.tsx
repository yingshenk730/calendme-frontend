import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const AuthPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  console.log(token)
  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    } else {
      localStorage.setItem('token', token)
    }
    navigate('/dashboard')
  }, [navigate]) //eslint-disable-line

  return <div>process....</div>
}

export default AuthPage
