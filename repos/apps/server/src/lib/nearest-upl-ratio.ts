export const getNearestUplRatio = (saved: number, current: number) =>
  current >= saved
    ? getMultipleOfFiveDown(current)
    : getMultipleOfFiveUp(current)

/*
-7 -> -5
-5 -> -5
-2 ->  0
 0 ->  0 
 2 ->  0
 5 ->  5
 7 ->  5
*/
const getMultipleOfFiveDown = (value: number) =>
  value < 0 ? Math.round(value / 5) * 5 : Math.floor(value / 5) * 5

/*
-7 -> -10
-5 -> -5
-2 -> -5
 0 ->  0
 2 ->  5
 5 ->  5
 7 ->  10
*/
const getMultipleOfFiveUp = (value: number) =>
  value < 0 ? Math.floor(value / 5) * 5 : Math.ceil(value / 5) * 5
