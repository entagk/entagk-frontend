import { useLayoutEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { stringToColor, formatTime } from "../helper";

import './style.css';
import ChartReport from "./ChartReport";

const Pie = ({ data }) => {
  const width = window.innerWidth;
  const height = Math.min(width, 500);

  const radius = Math.min(width, height) / 2;

  const arc = useMemo(
    () =>
      d3
        .arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius - 1)
        .cornerRadius(10)
        .padAngle(0.01),
    // eslint-disable-next-line
    []
  );

  const pie = useMemo(
    () =>
      d3
        .pie()
        .padAngle(1 / radius)
        .sort(null)
        .value((d) => d.totalMins),
    // eslint-disable-next-line
    []
  );

  const maxTotalMins = data.reduce((p, c) => p + c.totalMins, 0);

  const svgRef = useRef();

  useLayoutEffect(() => {
    const svg = d3.select(svgRef.current);

    const g = svg
      .append("g")
      .selectAll("g")
      .data(pie(data));

    const angleInterpolation = d3.interpolate(
      pie.startAngle()(),
      pie.endAngle()()
    )

    const path = g
      .enter()
      .append("path")
      .attr("fill", (d) => stringToColor(d?.data.name))

    path.transition()
      .duration(1000)
      .attrTween("d", (d) => {
        let originalEnd = d.endAngle;
        return (t) => {
          let currentAngle = angleInterpolation(t);
          if (currentAngle < d.startAngle) {
            return "";
          }

          d.endAngle = Math.min(currentAngle, originalEnd);

          return arc(d);
        };
      });

    path
      .append("title")
      .text(
        (d) =>
          `${d.data.name}: ${d.data.totalMins?.toFixed(2)?.toLocaleString()} Mins`
      );

    const centerText = svg
      .append('g')
      .attr("text-anchor", "middle")
      .append('text')
      .attr('transform', `translate(50%, 50%)`)
      .style('font', '18px sans-serif');

    centerText
      .append('tspan')
      .text('Total Time:')
      .attr('font-weight', 'bold');

    centerText
      .append('tspan')
      .text(formatTime(data.reduce((p, c) => p + c.totalMins, 0), 'hh:mm:ss'))
      .attr('dy', 20)
      .attr('x', 0);

    svg
      .append("g")
      .selectAll()
      .data(pie(data))
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .join("text")
      .attr("transform", (d) => {
        return `translate(${arc.centroid(d)})`;
      })
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.1)
          .append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text(
            (d) =>
              `${((d.data.totalMins / maxTotalMins) * 100)
                .toFixed(0)
                .toLocaleString("en-US")}%`
          )
          .style("font", "16px sans-serif")
          .style("font-weight", "bold")
          .style("text-anchor", "middle")
          .style("text-align", "center")
          .style("color", "white")
      );

    return () => svg.selectAll('*').remove();
    // eslint-disable-next-line
  }, [data]);

  return (
    <>
    <svg
      viewBox={[-width/2, -height/2, width, height]}
      ref={svgRef}
      width={width}
      height={height}
    ></svg>
    <ChartReport rows={data} totalTime={maxTotalMins} />
    </>
  );
};

export default Pie;
