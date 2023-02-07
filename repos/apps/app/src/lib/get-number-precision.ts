export const getNumberPrecision = (value: number) => {
  if (!isFinite(value)) {
    return 0
  }

  let e = 1
  let p = 0

  while (Math.round(value * e) / e !== value) {
    e *= 10
    p++
  }

  return p
}
