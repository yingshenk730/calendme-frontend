import { FcGoogle } from 'react-icons/fc'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
// import { Label } from '../ui/label'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Mail } from 'lucide-react'

export function UserAuthForm() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const api_baseUrl = import.meta.env.VITE_API_BASE_URL
  function handleClick() {
    navigate('/auth/register', { state: { email } })
  }
  const handleGoogleLogin = () => {
    window.location.href = `${api_baseUrl}/auth/google`
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6">
        <div className="grid ">
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            className="  focus:border-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button onClick={handleClick}>
          <Mail className="w-4 h-4 mr-3" />
          Sign Up with Email
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" onClick={handleGoogleLogin}>
        <FcGoogle className="mr-2 h-4 w-4" />
        <p className=" text-zinc-800 font-medium">Sign Up with Google</p>
      </Button>
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="underline hover:text-primary hover:font-semibold">
          Sign in
        </Link>
      </div>
    </div>
  )
}
