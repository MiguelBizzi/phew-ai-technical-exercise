import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_BACKEND_API_URL: z.url(),
  NEXT_PUBLIC_BACKEND_API_KEY: z.string(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string(),
})

const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  NEXT_PUBLIC_BACKEND_API_KEY: process.env.NEXT_PUBLIC_BACKEND_API_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
})

if (!parsedEnv.success) {
  console.log('Invalid env variables', parsedEnv.error.flatten().fieldErrors)

  throw new Error('Invalid env variables')
}

export const env = parsedEnv.data

export const config = {
  api: {
    baseUrl: env.NEXT_PUBLIC_API_URL,
    backendUrl: env.NEXT_PUBLIC_BACKEND_API_URL,
    backendApiKey: env.NEXT_PUBLIC_BACKEND_API_KEY,
  },
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
} as const

export const { api: apiConfig, supabase: supabaseConfig } = config
