import * as d3 from 'd3';

export const formatTime = (t, format = "mm:ss") => {
  if (format === 'mm:ss') {
    const sec = (t % 60).toFixed();
    const min = Math.floor(t / 60).toFixed();

    return `${min >= 10 ? min : '0' + min}:${sec >= 10 ? sec : '0' + sec}`
  } else {
    const hours = Math.floor(t / 60).toFixed();
    const minutes = Math.floor(t % 60).toFixed();
    const seconds = Math.floor((t - hours * 60 - minutes) * 60).toFixed();

    const hDisplay = hours < 10 ? '0' + hours : hours;
    const mDisplay = minutes < 10 ? '0' + minutes : minutes;
    const sDisplay = seconds < 10 ? '0' + seconds : seconds;

    return `${hDisplay}:${mDisplay}:${sDisplay}`;
  }
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

export const onScroll = (setPage, totalKey, tasksLenKey, tasksCurrentPageKey, tasksContainer = 'tasks-container', tasksList = 'tasks-list') => {
  const handleScrolling = () => {
    let scrollTop = document.querySelector(`.${tasksContainer}`)?.scrollTop;
    let scrollHeight = document.querySelector(`.${tasksList}`)?.scrollHeight;
    let clientHeight = document.querySelector(`.${tasksContainer}`)?.clientHeight;
    const total = Number(localStorage.getItem(totalKey));
    const tasksLen = Number(localStorage.getItem(tasksLenKey));
    const currentPage = Number(localStorage.getItem(tasksCurrentPageKey));

    if (
      Math.ceil(scrollTop + clientHeight) >= scrollHeight &&
      total > tasksLen
    ) {
      // console.log(currentPage + 1);
      setPage(currentPage + 1);
    }
  }

  document.querySelector(`.${tasksContainer}`)?.addEventListener('scroll', handleScrolling);
  return () => document.querySelector(`.${tasksContainer}`)?.removeEventListener('scroll', handleScrolling);
}

export const stringToColor = (string) => {
  let hash = 0;
  let i;
  for (i = 0; i < string?.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  return color;
};

export function wrapText(selection) {
  selection.each(function () {
    const node = d3.select(this);
    const rectWidth = +node.attr("data-width");
    let word;
    const words = node.text().length > 12 ? node.text().split(" ").reverse() : [node.text()];
    let line = [];
    const x = node.attr("x");
    const y = node.attr("y");
    let tspan = node.text("").append("tspan").attr("x", x).attr("y", y);
    let lineNumber = 0;
    while (words.length > 1) {
      word = words.pop();
      line.push(word);
      tspan.text(line.join(" "));
      const tspanLength = tspan.node().getComputedTextLength();
      if (tspanLength > rectWidth && line.length !== 1) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = addTspan(word);
      }
    }

    addTspan(words.pop());

    function addTspan(text) {
      const fontSize = 12;
      lineNumber += 1;
      return node
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", `${lineNumber * 2 + fontSize}px`)
        .text(text);
    }
  });
}

export function getWeekStartAndEnd(date) {
  const day = date ? new Date(date) : new Date();

  const start = new Date(day.setDate((day.getDate() - day.getDay() + 0))).toJSON().split('T')[0];
  const end = new Date(day.setDate(day.getDate() + 6)).toJSON().split('T')[0];

  return [start, end];
}

export function getMonthRange(year, month) {
  const start = `${year}-${month + 1 < 10 ? "0" + (month + 1) : month + 1}-01`;
  const end = `${year}-${month + 1 < 10 ? "0" + (month + 1) : month + 1}-${new Date(year, month + 1, 0).getDate()}`;

  return [start, end];
}

export const calcDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const different = (endDate - startDate) / 1000 / 60 / 60 / 24;

  const days = [start, end,];
  for (let i = 1; i < different; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    days.push(date.toJSON().split('T')[0]);
  }

  return days;
}

export const newDate = (date = "", type = '+', num = 0) => {
  const oldDate = date ? new Date(date) : new Date();

  return new Date(
    oldDate.setDate(
      type === '+' ?
        oldDate.getDate() + num :
        oldDate.getDate() - num
    )
  ).toJSON()?.split('T')[0]
}

export const filterDuplicatedData = (data, property) => {
  const seen = new Set();

  return data.filter(ele => {
    const propValue = ele[property];
    if (seen.has(propValue)) {
      return false;
    } else {
      seen.add(propValue);
      return true;
    }
  })
}

export const types = [
  { name: "Work", code: "1F4BC" },
  { name: "Sport", code: "26BD" },
  { name: "Entertainment", code: "1F389" },
  { name: "Gaming", code: "1F3AE" },
  { name: "Shopping", code: "1F6CD" },
  { name: "Social networking", code: "1F310" },
  { name: "Read", code: "1F4DA" },
  { name: "Study", code: "1F4D6" },
  { name: "Coding", code: "1F4BB" },
  { name: "Designing", code: "1F3A8" },
  { name: "Planning", code: "1F4C5" },
  { name: "Nothing", code: "1F6AB" }
];
