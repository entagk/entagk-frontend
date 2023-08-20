import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { wrapText, stringToColor } from "../helper";

import './style.css';

function Chart({ data }) {
  const max = d3.max(data, (d) => d?.totalMins);
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
    [gx, x, data]
  );

  useEffect(() => {
    const gyRef = d3.select(gy.current);
    void gyRef
      .call(d3.axisLeft(y).tickSizeOuter(10).tickPadding(5))
      .selectAll("text")
      .call(wrapText);
  },
    [gy, y, data]);

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
      );
  }
    // eslint-disable-next-line
    , [x, y, data]);

  useEffect(() => {
    const tooltip = d3
      .select("div.chart-container")
      .append("div")
      .attr("class", "tooltip");

    void d3.select(barsRef.current)
      .selectAll("rect")
      .on("mouseover", function () {
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function (event, d) {
        const index = Number(this.getAttribute("value"));
        const item = data[index];
        return tooltip
          .style("top", event.pageY + 30 + "px")
          .style("left", event.pageX + 20 + "px").html(`
              <p class="name">${item.name}</p>
              <p class="number">${item.totalMins.toFixed(2)} min</p>
              <p class='rate'>${((max / item.totalMins) * 100).toFixed()}%</p>
          `);
      })
      .on("mouseout", function () {
        return tooltip.style("visibility", "hidden");
      });
    // eslint-disable-next-line
  }, [barsRef, data]);

  return (
    <>
      <svg
        viewBox={[0, 0, width, height]}
        width={width + marginLeft + marginRight}
        height={height + marginTop + marginBottom}
        style={{
          maxWidth: "100%",
          background: "var(--main-light-black)",
          height: "auto",
          width: "100%",
          font: "10px sans-serif",
          color: "#fff",
          borderRadius: '20px'
        }}
      >
        <g
          fill="currentColor"
          fontSize="10"
          fontFamily="sans-serif"
          textAnchor="middle"
          ref={barsRef}
        >
          {data.map((item, index) => (
            <rect
              key={index}
              value={index}
              fill={stringToColor(item.name)}
              y={y(item.name)}
              x={x(0)}
              width={x(item.totalMins) - x(0)}
              height={y.bandwidth()}
              style={{
                marginRight: '10px'
              }}
            ></rect>
          ))}
        </g>
        <g fill="white" textAnchor="end" ref={labelsRef} className="labels"></g>
        <g ref={gx} transform={`translate(0,${marginTop})`}></g>
        <g ref={gy} transform={`translate(${marginLeft},0)`} />
      </svg>
    </>
  );
}

export default Chart;
