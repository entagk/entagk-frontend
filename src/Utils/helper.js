export const formatTime = (t) => {
  const sec = t % 60;
  const min = Math.floor(t / 60);
  // console.log(min, sec);
  return `${min >= 10 ? min : '0' + min}:${sec >= 10 ? sec : '0' + sec}`
};

export const calcFinish = (act, est, period, short, long, interval, format) => {
  const hours = format === "24-hour" ? new Date().getHours() : new Date().getHours() - 12;
  const mins = new Date().getMinutes();

  const total = (est - act);
  const result = (total * period) + ((total/ interval) * long) + (interval - 1 * (total / interval) * short) + hours * 60 + mins;

  return result;
};


export const pushNotification = (message) => {
  new Notification(message, {
    icon: 'favicon.ico',
    tag: "mohamed ali",
    requireInteraction: true,
    renotify: true
  });
}