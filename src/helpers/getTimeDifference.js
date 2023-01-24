export function getTimeDifference(lastUpdated) {
  const lastUpdatedTime = new Date(lastUpdated)
  const currentTime = new Date()
  const timeDifference = currentTime - lastUpdatedTime
  const timeDifferenceInMinutes = Math.floor(timeDifference / 60000)
  return timeDifferenceInMinutes
}
