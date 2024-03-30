function formatTime(timeInSeconds) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  const hoursDisplay = hours > 0 ? hours + (hours === 1 ? ' hour ' : ' hours ') : '';
  const minutesDisplay = minutes > 0 ? minutes + (minutes === 1 ? ' minute ' : ' minutes ') : '';
  const secondsDisplay = seconds > 0 ? seconds + (seconds === 1 ? ' second' : ' seconds') : '';

  return hoursDisplay + minutesDisplay + secondsDisplay;
}

module.exports = { formatTime };
