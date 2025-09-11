'use client'

import { BookOpen, Video } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAction } from 'next-safe-action/hooks'
import { loginAction, registerAction } from '@/server/actions/auth-actions'
import {
  loginSchema,
  registerSchema,
  type LoginForm,
  type RegisterForm,
} from '@/types/auth-forms'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function Auth() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const router = useRouter()

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const { execute: executeLogin, status: loginStatus } = useAction(
    loginAction,
    {
      onSuccess: (data) => {
        if (data.data.success) {
          toast.success(data.data.message)
          router.push('/')
        } else {
          loginForm.setError('password', {
            message: data.data.message,
          })
        }
      },
      onError: () => {
        loginForm.setError('password', {
          message: 'An error occurred while logging in, please try again.',
        })
      },
    },
  )

  const { execute: executeRegister, status: registerStatus } = useAction(
    registerAction,
    {
      onSuccess: (data) => {
        if (data.data.success) {
          toast.success(data.data.message)
          setActiveTab('signin')
          registerForm.reset()
        } else {
          registerForm.setError('password', {
            message: data.data.message,
          })
        }
      },
      onError: () => {
        registerForm.setError('password', {
          message:
            'An error occurred while creating an account, please try again.',
        })
      },
    },
  )

  function handleLogin(data: LoginForm) {
    executeLogin(data)
  }

  function handleRegister(data: RegisterForm) {
    executeRegister(data)
  }

  useEffect(() => {
    if (activeTab === 'signin') {
      loginForm.reset()
    } else {
      registerForm.reset()
    }
  }, [activeTab, loginForm, registerForm])

  const isLoginLoading = loginStatus === 'executing'
  const isRegisterLoading = registerStatus === 'executing'

  return (
    <div className="bg-primary flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-8 flex items-center justify-center gap-2">
              <div className="from-primary to-secondary rounded-lg bg-linear-to-br p-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Article Summarizer</span>
            </div>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="signin"
              className="w-full"
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as 'signin' | 'signup')
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-4">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(handleLogin)}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your@email.com"
                              type="email"
                              disabled={isLoginLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="••••••••"
                              type="password"
                              disabled={isLoginLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoginLoading}
                    >
                      {isLoginLoading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      Sign In
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup" className="mt-4">
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(handleRegister)}
                    className="space-y-4"
                  >
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your full name"
                              type="text"
                              disabled={isRegisterLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your@email.com"
                              type="email"
                              disabled={isRegisterLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="••••••••"
                              type="password"
                              disabled={isRegisterLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isRegisterLoading}
                    >
                      {isRegisterLoading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      Create Account
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
