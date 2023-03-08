import { fetcher } from 'components/fetcher'
import type { AuthSecrets, Position, PositionHistory } from 'lib/types'

export class OKXHttpPrivate {
  private authSecrets: AuthSecrets

  constructor(authSecrets: AuthSecrets) {
    this.authSecrets = authSecrets
  }

  public async getPositions() {
    return fetcher<Position[]>(
      '/api/v5/account/positions',
      undefined,
      this.authSecrets
    )
  }

  public async getPosition(posId: string) {
    return fetcher<Position[]>(
      '/api/v5/account/positions',
      { posId },
      this.authSecrets
    )
  }

  public async getPositionsHistory(posId: string) {
    return fetcher<PositionHistory[]>(
      '/api/v5/account/positions-history',
      { posId },
      this.authSecrets
    )
  }
}
