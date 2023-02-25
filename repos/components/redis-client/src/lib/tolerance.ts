// import numeral from 'numeral'

export const getTolerantBounds = (currentPrice: number) => {
  const log10 = Math.abs(Math.trunc(Math.log10(currentPrice)))

  /* NOTE: tolerance is percent value between 0.5% and 0.005% */
  const tolerance =
    log10 >= 4
      ? 0.005 / 100
      : log10 === 3
      ? 0.01 / 100
      : log10 === 2
      ? 0.05 / 100
      : log10 === 1
      ? 0.25 / 100
      : 0.5 / 100

  /* NOTE: multiply by 1e8 to avoid float numbers with high precision */
  const lowerBound = Math.trunc(currentPrice * (1 - tolerance) * 1e8)
  const upperBound = Math.trunc(currentPrice * (1 + tolerance) * 1e8)

  // console.log(
  //   log10,
  //   numeral(tolerance).format('0,0[.][00000000]').replace(',', ' '),
  //   currentPrice,
  //   numeral(lowerBound)
  //     .divide(1e8)
  //     .format('0,0[.][00000000]')
  //     .replace(',', ' '),
  //   numeral(upperBound).divide(1e8).format('0,0[.][00000000]').replace(',', ' ')
  // )

  return [lowerBound, upperBound]
}
