export const formatTime = (t) => {
  const sec = t % 60;
  const min = Math.floor(t / 60);
  // console.log(min, sec);
  return `${min > 10 ? min : '0' + min}:${sec >= 10 ? sec : '0' + sec}`
} 