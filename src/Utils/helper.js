export const formatTime = (t) => {
  const sec = t % 60;
  const min = Math.floor(t / 60);
  // console.log(min, sec);
  return `${min >= 10 ? min : '0' + min}:${sec >= 10 ? sec : '0' + sec}`
};

export const pushNotification = (message) => {
  // eslint-disable-next-line
  if (typeof Notification !== undefined) {
    new Notification(message, {
      icon: 'favicon.ico',
      tag: "mohamed ali",
      requireInteraction: true,
      renotify: true
    });
  }
};