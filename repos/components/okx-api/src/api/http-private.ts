import { fetcher } from 'components/fetcher'
import type { AuthSecrets } from 'lib/types'

export class OKXHttpPrivate {
  private authSecrets: AuthSecrets

  constructor(authSecrets: AuthSecrets) {
    this.authSecrets = authSecrets
  }

  public async getPositions() {
    return fetcher('/api/v5/account/positions', undefined, this.authSecrets)
  }
}
