import React, { useLayoutEffect, useRef } from 'react';
import * as d3 from 'd3';
import { formatTime } from '../../../helper';

const dayNames = [
  'Sun', 'Mon',
  'Tue', 'Wed',
  'Thu', 'Fri', 'Sat'
];

function Calendar(
  {
    data
  }
) {
  const svgRef = useRef();
  const width = window.innerWidth;

  const X = d3.map(data, d => new Date(d.day));
  const Y = d3.map(data, d => d.totalMins / 60);
  const I = d3.range(X.length);

  const cellSize = width / 55;

  const timeWeek = d3.utcSunday;
  const weekDays = 7;
  const height = cellSize * (weekDays + 2);

  const color = d3.scaleSequential(["#ebedf082", '#66bd63', '#1a9850', "#006837"]);

  // Construct formats.
  const formatMonth = d3.utcFormat("%b");

  // Compute titles.
  const formatDate = d3.utcFormat("%B %-d, %Y");
  const title = i => `${formatDate(X[i])}\n${formatTime(Y[i] * 60)} (HH:MM)`;

  const yearData = d3.groups(I, i => X[i].getUTCFullYear()).reverse();

  useLayoutEffect(() => {
    const svg = d3.select(svgRef.current);

    const year = svg.selectAll("g")
      .data(yearData)
      .join("g")
      .attr("transform", `translate(35,20)`);

    year.append("g")
      .attr("text-anchor", "end")
      .selectAll("text")
      .data(d3.range(7))
      .join("text")
      .attr("x", -5)
      .attr("y", i => (i + 0.5) * cellSize)
      .attr("dy", "0.31em")
      .attr('font-size', '1.2rm')
      .text(i => dayNames[i]);

    const cell = year.append("g")
      .selectAll("rect")
      .data(([, I]) => I)
      .join("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", i => timeWeek.count(d3.utcYear(X[i]), X[i]) * cellSize + 0.5)
      .attr("y", i => X[i].getUTCDay() * cellSize + 0.5)
      .attr("fill", i => color(Y[i]));

    if (title)
      cell.append("title")
        .text(title);

    const month = year.append("g")
      .selectAll("g")
      .data(([, I]) => d3.utcMonths(d3.utcMonth(X[I[0]]), X[I[I.length - 1]]))
      .join("g");

    month.append("text")
      .attr("x", d => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2)
      .attr("y", -5)
      .attr('font-size', '1.2rm')
      .text(formatMonth);


    return () => {
      svg.selectAll('*').remove();
    }
    // eslint-disable-next-line
  }, [data])

  return (
    <svg
      width={width}
      height={height}
      viewBox={[0, 0, width, height]}
      style={{ maxWidth: "100%", height: "auto", width: '100%' }}
      fontFamily={"sans-serif"}
      fontSize={10}
      ref={svgRef}></svg>
  )
}

export default Calendar;
