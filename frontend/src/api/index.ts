import axios from 'axios'

export interface Transaction {
  id: string
  debitedAccountId: string
  creditedAccountId: string
  value: number
  createdAt: string
  debitedUsername: string
  creditedUsername: string
}

interface FilterParams {
  date?: string
  type?: 'cash-in' | 'cash-out'
}

const http = axios.create({ baseURL: '/' })

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message
    const text = Array.isArray(message) ? message[0] : message
    return Promise.reject(new Error(text ?? `Erro ${err.response?.status ?? 'de rede'}`))
  },
)

function stripAt(username: string): string {
  return username.replace(/^@/, '').trim()
}

export async function register(username: string, password: string): Promise<void> {
  await http.post('/auth/register', { username: stripAt(username), password })
}

export async function login(username: string, password: string): Promise<string> {
  const { data } = await http.post<{ token: string }>('/auth/login', { username: stripAt(username), password })
  localStorage.setItem('token', data.token)
  return data.token
}

export function logout(): void {
  localStorage.removeItem('token')
}

export async function getBalance(): Promise<number> {
  const { data } = await http.get<{ balance: number }>('/accounts/balance')
  return Number(data.balance)
}

export async function transfer(creditedUsername: string, value: number): Promise<void> {
  await http.post('/transactions/transfer', { creditedUsername: stripAt(creditedUsername), value })
}

export async function getTransactions(filters: FilterParams = {}): Promise<Transaction[]> {
  const { data } = await http.get<Transaction[]>('/transactions', { params: filters })
  return data
}

export function getAccountId(): string {
  const token = localStorage.getItem('token')
  if (!token) return ''
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { accountId?: string }
    return payload.accountId ?? ''
  } catch {
    return ''
  }
}

export function getUsername(): string {
  const token = localStorage.getItem('token')
  if (!token) return ''
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { username?: string }
    return payload.username ?? ''
  } catch {
    return ''
  }
}
