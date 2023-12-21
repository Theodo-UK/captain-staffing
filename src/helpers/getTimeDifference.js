export function getTimeDifference(lastUpdated) {
  const lastUpdatedTime = new Date(lastUpdated)
  const currentTime = new Date()
  const timeDifference = currentTime - lastUpdatedTime
  const timeDifferenceInHours = Math.floor(timeDifference / 3600000)
  const timeRemainderInMinutes = Math.floor(timeDifference % 3600000 / 60000)
  return { minutes: timeRemainderInMinutes, hours: timeDifferenceInHours }
}
