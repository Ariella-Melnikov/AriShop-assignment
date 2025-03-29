const baseUrl = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL
  : '/api'

export const http = {
  get: async (url: string) => {
    const res = await fetch(`${baseUrl}${url}`)
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  post: async (url: string, body: any) => {
    const res = await fetch(`${baseUrl}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  put: async (url: string, body: any) => {
    const res = await fetch(`${baseUrl}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  }
}
