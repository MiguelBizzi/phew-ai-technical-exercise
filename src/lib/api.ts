import { apiConfig } from './env'

export function phewApi(path: string, init?: RequestInit) {
  const url = `${apiConfig.backendUrl}${path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': apiConfig.backendApiKey,
    ...(init?.headers as Record<string, string>),
  }

  return fetch(url, {
    ...init,
    headers,
  })
}

export function publicApi(path: string, init?: RequestInit) {
  const url = `${apiConfig.baseUrl}${path}`

  return fetch(url, {
    ...init,
  })
}
