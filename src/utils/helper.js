export const formatTime = (t) => {
  const sec = t % 60;
  const min = Math.floor(t / 60);
  // console.log(min, sec);
  return `${min >= 10 ? min : '0' + min}:${sec >= 10 ? sec : '0' + sec}`
};

export const updatedAt = (t) => {
  const now = new Date(Date.now());
  const date = new Date(t);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };

  if (now.getFullYear() === date.getFullYear()) {
    if (now.getMonth() === date.getMonth()) {
      if (now.getDate() === date.getDate()) {
        if (now.getHours() === date.getHours()) {
          if (now.getMinutes() === date.getMinutes()) {
            return `Updated now`
          } else {
            return `Updated ${now.getMinutes() - date.getMinutes()} Min ago`;
          }
        } else {
          return `Updated ${now.getHours() - date.getHours()} Hours ago`;
        }
      } else {
        return `Updated ${now.getDate() - date.getDate()} Days ago`;
      }
    } else {
      return `Updated ${date.toLocaleDateString('en', options).split(',')[0]} ago`;
    }
  } else {
    return `Updated ${date.toLocaleDateString('en', options)} ago`;
  }
}

export const pushNotification = (message) => {
  // eslint-disable-next-line
  if (typeof window?.Notification !== undefined) {
    new window.Notification(message, {
      icon: 'favicon.ico',
      tag: "mohamed ali",
      requireInteraction: true,
      renotify: true
    });
  }
};

export const getPages = (current, numberOfPages) => {
  if (numberOfPages <= 5) {
    return Array(numberOfPages).fill(0).map((e, i) => i + 1);
  }

  let pages = [current];
  if (current === 1) {
    pages.push(2);
    if (numberOfPages > current + 2) {
      pages.push('...');
    }
    pages.push(numberOfPages);
  } else {
    if (numberOfPages !== current) {
      if (current - 1 > 2) {
        pages.unshift(current - 1);
        pages.unshift("...");
      } else if (current !== 2) {
        pages.unshift(2);
      }

      if (numberOfPages - current >= 2) {
        pages.push(current + 1);
        if (numberOfPages - current > 2) pages.push("...")
      }
      pages.push(numberOfPages);
    } else {
      pages.unshift(numberOfPages - 1);
      if (numberOfPages - 2 > 1) {
        pages.unshift('...');
      }
    }
    pages.unshift(1);
  }

  return pages;
};
