const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN

export const fetcher = async <T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<{ data: T; error: null } | { data: null; error: string }> => {
  let response

  if (!API_ORIGIN) {
    return { data: null, error: 'No API origin' }
  }

  try {
    response = await fetch(`${API_ORIGIN}${endpoint}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
  } catch {}

  let data = null
  let error = null

  try {
    const json = await response?.json()

    data = json.data
    error = json.error
  } catch {}

  return { data, error }
}
