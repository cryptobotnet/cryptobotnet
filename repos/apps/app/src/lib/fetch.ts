export const fetchAPIRoute = async <T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<{ data: T; error: null } | { data: null; error: string }> => {
  let response

  try {
    response = await fetch(endpoint, {
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
