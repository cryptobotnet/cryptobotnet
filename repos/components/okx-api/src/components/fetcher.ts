import fetch from 'cross-fetch'
import queryString from 'querystring'

import { Endpoints } from 'lib/constants'
import { sign } from 'components/sign'
import type { AuthSecrets } from 'components/types'

export const fetcher = async (
  endpoint: string,
  params?: Record<string, string>,
  authSecrets?: AuthSecrets
) => {
  let path = endpoint

  if (params) {
    for (const key of Object.keys(params || {})) {
      if (params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    }

    path += '?' + queryString.encode(params)
  }

  let headers

  if (authSecrets) {
    const { apiKey, passphrase, secretKey } = authSecrets
    const { timestamp, signedBase64 } = sign({
      secretKey,
      method: 'GET',
      path,
      type: 'http'
    })

    headers = {
      'OK-ACCESS-KEY': apiKey,
      'OK-ACCESS-TIMESTAMP': String(timestamp),
      'OK-ACCESS-SIGN': signedBase64,
      'OK-ACCESS-PASSPHRASE': passphrase
    }
  }

  let response

  try {
    response = await fetch(`${Endpoints.HTTP_API}${path}`, {
      ...(headers && { headers })
    })
  } catch {}

  let data = null
  let error = null

  try {
    const json = await response?.json()

    data = json.data ?? null

    const errorCode = json.sCode ?? json.code
    const errorMessage = json.sCode ? json.sMsg : json.msg

    error =
      errorCode === '0' ? null : `${errorCode} ${errorMessage || 'no message'}`
  } catch {}

  if (response?.status !== 200) {
    error = `GET-request failed with code ${response?.status} on endpoint ${endpoint}`
  }

  return { data, error }
}
