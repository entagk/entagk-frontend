import { useLayoutEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { stringToColor } from "../helper";

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

    g
      .enter()
      .append("path")
      .attr("fill", (d) => stringToColor(d?.data.name))
      .transition()
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

    g
      .append("title")
      .text(
        (d) =>
          `${d.data.name}: ${d.data.totalMins.toFixed(2).toLocaleString()} Mins`
      );

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
    <svg
      viewBox={[-radius, -radius, width, height]}
      ref={svgRef}
      width={width}
      height={height}
    ></svg>
  );
};

export default Pie;
