import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/useAuth'

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
})

const LoginPage = () => {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const api_baseUrl = import.meta.env.VITE_API_BASE_URL
  console.log('api_baseUrl', api_baseUrl)
  const handleGoogleLogin = () => {
    window.location.href = `${api_baseUrl}/auth/google`
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await fetch(`${api_baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })
    const resUser = await res.json()
    console.log('create account', resUser)
    if (resUser.success) {
      localStorage.setItem('token', resUser.token)
      setUser(resUser.user)
      navigate('/dashboard')
    }
  }

  return (
    <div className=" w-screen h-screen flex flex-col items-center justify-center  min-h-fit">
      <Link to="/">
        <h1 className=" text-4xl font-bold text-primary mb-12">
          Calend<span className=" text-secondary">Me</span>
        </h1>
      </Link>
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-xl text-center">Welcome Back!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className=" relative">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <EyeOff
                        className={cn(
                          'w-5 h-5 absolute top-8 right-2 text-zinc-700 cursor-pointer',
                          {
                            hidden: showPassword,
                          }
                        )}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                      <Eye
                        className={cn(
                          'w-5 h-5 absolute top-8 right-2 text-zinc-700 cursor-pointer',
                          {
                            hidden: !showPassword,
                          }
                        )}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full ">
                  Sign in
                </Button>
              </form>
            </Form>

            <Button
              variant="outline"
              className="w-full  flex items-center justify-center gap-3"
              onClick={handleGoogleLogin}>
              <FcGoogle className="mr-2 h-5 w-5 " />
              Sign in with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link
              to="/auth/register"
              className="underline hover:text-primary hover:font-semibold">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
