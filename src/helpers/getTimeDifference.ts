export function getTimeDifference(lastUpdated: string) {
  const lastUpdatedTime = new Date(lastUpdated);
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - lastUpdatedTime.getTime();
  const timeDifferenceInHours = Math.floor(timeDifference / 3600000);
  const timeRemainderInMinutes = Math.floor(timeDifference % 3600000 / 60000);
  return { minutes: timeRemainderInMinutes, hours: timeDifferenceInHours };
};
