export const fetchAPIRoute = async <T = null>(
  endpoint: string,
  params?: Record<string, string | number>
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

  if (response?.status !== 200) {
    error = `GET-request failed with code ${response?.status} on endpoint ${endpoint}`
  }

  return { data, error }
}

export const fetchServerRoute = async (
  endpoint: string,
  params?: Record<string, string | number>
): Promise<{ error: string | null }> => {
  let response

  try {
    response = await fetch(`${process.env.SERVER_ORIGIN}${endpoint}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
  } catch {}

  let error = null

  if (response?.status !== 200) {
    error = `GET-request failed with code ${response?.status} on server endpoint ${endpoint}`
  }

  return { error }
}
