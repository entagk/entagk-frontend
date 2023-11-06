import { useRef, useEffect, useLayoutEffect } from "react";
import * as d3 from "d3";
import { wrapText, stringToColor } from "../../helper";

import './style.css';
import ChartReport from "./ChartReport";

function Chart({ data }) {
  const maxMins = Math.ceil(d3.max(data, (d) => d?.totalMins) / 10) * 10;

  const width = window.innerWidth,
    marginTop = 30,
    marginRight = 30,
    marginBottom = 20,
    marginLeft = 80,
    height = (50 * data.length) + marginTop + marginBottom;

  const gx = useRef(),
    gy = useRef(),
    barsRef = useRef(),
    labelsRef = useRef();

  // Declare the y (vertical position) scale
  const y = d3
    .scaleBand()
    .domain(
      d3.groupSort(
        data,
        ([d]) => -d?.totalMins,
        (d) => d?.name
      )
    )
    .range([marginTop, height - marginBottom])
    .padding(0.1);

  // Declare the x (horizontal position) scale.
  const x = d3
    .scaleLinear()
    .domain([0, maxMins])
    .range([marginLeft, width - marginRight]);

  useEffect(
    () => {
      void d3.select(gx.current)
        .call(d3.axisTop(x).ticks(width / 80, "m"))
        .call((g) =>
          g
            .selectAll(".tick line")
            .clone()
            .attr("y2", height - marginTop - marginBottom)
            .attr("stroke-opacity", 0.1)
        )
        .call((g) =>
          g
            .append("text")
            .attr("y", -marginTop)
            .attr("x", width - marginLeft)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("Time (min)")
        )
        .call((g) => g.select(".domain").remove());
    },
    // eslint-disable-next-line
    [gx, x]
  );

  useEffect(() => {
    const gyRef = d3.select(gy.current);
    void gyRef
      .call(d3.axisLeft(y).tickSizeOuter(10).tickPadding(5))
      .selectAll("text")
      .call(wrapText);
  },
    [gy, y]);

  useEffect(() => {
    const labelsText = document.querySelectorAll('.labels text');

    labelsText.forEach((l) => {
      l.remove();
    })

    const labels = d3.select(labelsRef.current);

    labels.selectAll()
      .data(data)
      .join("text")
      .attr("x", (d) => x(d?.totalMins))
      .attr("y", (d) => y(d.name) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("dx", -4)
      .text((d) => d?.totalMins?.toFixed(2) + " m")
      .call((text) =>
        text
          .filter((d) => x(d?.totalMins) - x(0) < maxMins / 2) // short bars
          .attr("dx", +4)
          .attr("text-anchor", "start")
          .style('fill', '#000')
      );

    return () => {
      labels.selectAll('text').remove();
    }
  }
    // eslint-disable-next-line
    , [x, y, data]);

  useLayoutEffect(() => {
    const bars = d3.select(barsRef.current);

    const selectedBarsRef =
      bars
        .selectAll("rect")
        .data(data)
        .enter()
        .append('rect')
        .attr('y', (d) => y(d.name))
        .attr('x', (d) => x(0))
        .attr("fill", (d) => stringToColor(d.name))
        .attr('height', y.bandwidth());

    const duration = 1000;
    const t = d3.transition().duration(duration).ease(d3.easeLinear);

    selectedBarsRef
      .transition(t)
      .delay((d, i) => i * duration)
      .attr('width', (d) => x(d.totalMins) - x(0));

    selectedBarsRef
      .append('title')
      .text((d) => d.name);

    return () => {
      bars.selectAll('*').remove();
    }

    // eslint-disable-next-line
  }, [barsRef, data, x, y]);

  return (
    <>
      <svg
        viewBox={[0, 0, width, height]}
        width={width + marginLeft + marginRight}
        height={height + marginTop + marginBottom}
      >
        <g
          fill="currentColor"
          fontSize="10"
          fontFamily="sans-serif"
          textAnchor="middle"
          ref={barsRef}
        >
        </g>
        <g fill="white" textAnchor="end" ref={labelsRef} className="labels"></g>
        <g ref={gx} transform={`translate(0,${marginTop})`}></g>
        <g ref={gy} transform={`translate(${marginLeft},0)`} />
      </svg>
      <ChartReport rows={data} totalTime={data.reduce((p, t) => p + t.totalMins, 0)} />
    </>
  );
}

export default Chart;
