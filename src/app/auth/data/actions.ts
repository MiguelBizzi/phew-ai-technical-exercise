'use server'

import { actionClient } from '@/lib/safe-action'
import { loginSchema, registerSchema } from './schemas'
import { createClient } from '@/lib/supabase/server'

export const loginAction = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return {
          success: false,
          message: error.message,
        }
      }

      if (data.user) {
        return {
          success: true,
          message: 'Login successful',
          user: data.user,
        }
      }

      return {
        success: false,
        message: 'Login failed',
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'An error occurred while logging in',
      }
    }
  })

export const registerAction = actionClient
  .inputSchema(registerSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        return {
          success: false,
          message: error.message,
        }
      }

      if (data.user) {
        return {
          success: true,
          message:
            'Account created successfully. Please check your email to confirm your account.',
        }
      }

      return {
        success: false,
        message: 'Registration failed',
      }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        message: 'An error occurred while creating your account',
      }
    }
  })
