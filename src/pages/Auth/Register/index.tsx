import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { FcGoogle } from 'react-icons/fc'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
const formSchema = z
  .object({
    username: z.string().min(1, {
      message: 'Username is required',
    }),
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const RegisterPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const inputEmail = location.state?.email || ''
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const api_baseUrl = import.meta.env.VITE_API_BASE_URL
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: inputEmail,
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await fetch(`${api_baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    })
    const resUser = await res.json()

    if (resUser.success) {
      localStorage.setItem('token', resUser.token)
      navigate('/auth/login')
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${api_baseUrl}/auth/google`
  }

  return (
    <div className=" w-screen h-screen flex items-center justify-center  min-h-fit">
      <Card className="w-[400px] ">
        <CardHeader>
          <CardTitle className="text-xl text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} className=" " />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full ">
                  Create an account
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
            Already have an account?{' '}
            <Link to="/auth/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage
