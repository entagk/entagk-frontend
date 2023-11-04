import { useRef, useEffect, lazy } from "react";
import * as d3 from "d3";
import { stringToColor, filterDuplicatedData } from "../../helper";

import './style.css';

const ChartReport = lazy(() => import("./ChartReport"));

function StackedBarChart({
  daysData,
  dataType,
  setDateType,
  setDate
}) {
  const colorRows = [];
  const data = filterDuplicatedData(daysData, 'day').sort((a, b) => a?.day?.localeCompare(b?.day))?.map((d) => {
    const requiredData = {};
    d?.[dataType]?.forEach((item) => {
      requiredData[`${item?.name} ${d?.day}`] = item?.totalMins;

      const found = colorRows.find(cr => cr.name === item?.name);
      if (found) found.totalMins += item?.totalMins;
      else colorRows.push(item);
    });
    const dayTotalMins = requiredData ? Object?.values(requiredData).reduce((p, t) => p + t, 0) : 0;
    if (d.totalMins !== dayTotalMins && d.totalMins) {
      const unknownName = `unknown ${dataType.slice(0, -1)}`;
      requiredData[unknownName + " " + d.day] = d.totalMins - dayTotalMins;

      const foundInColorRows = colorRows.find((cr) => cr.name === unknownName);
      if (foundInColorRows) {
        foundInColorRows.totalMins += d.totalMins - dayTotalMins;
      } else colorRows.push({ name: unknownName, totalMins: d.totalMins - dayTotalMins });
    }

    return { day: d.day, ...requiredData };
  });

  const width = window.innerWidth,
    marginTop = 30,
    marginRight = 30,
    marginBottom = 20,
    marginLeft = 80;

  const gx = useRef(),
    gy = useRef(),
    barsRef = useRef(),
    svgRef = useRef(),
    labelsRef = useRef();

  const keys = data
    .map((d) => Object.keys(d))
    .flat(Infinity)
    .filter((d) => d !== "day");
  const days = data.map((d) => d.day);

  const stackedData = d3.stack().keys(keys)(data);

  const height = days.length * 50 + marginTop + marginBottom;

  // Declare the y (vertical position) scale.
  const y = d3
    .scaleBand()
    .domain(days)
    .range([marginTop, height - marginBottom])
    .padding(0.1);

  const xMax = stackedData.length ? Math.max(...stackedData.flat(Infinity).filter(n => !isNaN(n))) : 10;
  // Declare the x (horizontal position) scale.
  const x = d3
    .scaleLinear()
    .domain([0, Math.ceil(xMax / 10) * 10])
    .range([marginLeft, width]);

  useEffect(
    () => {
      void d3
        .select(gx.current)
        .call(d3.axisTop(x).ticks(5, "~s"))
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
    void d3
      .select(gy.current)
      .call(d3.axisLeft(y).tickSizeOuter(0).tickPadding(5))
      .selectAll("text")
      .on("click", (d) => {
        setDateType("day");
        setDate({
          startDate: d.target.__data__,
          endDate: d.target.__data__,
          display: d.target.__data__ === new Date().toJSON().split('T')[0] ? 'today' : d.target.__data__
        })
      })
      .call((text) => text.text((t) => t?.replaceAll("-", "/")))
      .call((g) => g.select(".domain").remove());

    // eslint-disable-next-line
  }, [gy, y, data]);

  useEffect(() => {
    const labelsText = document.querySelectorAll('.labels text');

    labelsText.forEach((l) => {
      l.remove();
    })

    const labels = d3.select(labelsRef.current).selectAll('g').data(stackedData).join('g');

    labels.each(function (_, i) {
      d3.select(this)
        .selectAll('text')
        .data(d => d)
        .join('text')
        .attr("x", (d) => x(d[1]))
        .attr("y", (d) => y(d.data.day) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("dx", -4)
        .text((d) => (d[1] - d[0])?.toFixed(2) + " m")
        .call((text) =>
          text
            .filter((d) => x(d[1]) - x(d[0]) < xMax / 2) // short bars
            .attr("dx", +4)
            .attr("text-anchor", "start")
            .style('fill', '#000')
        );

    })

    return () => {
      labels.selectAll('text').remove();
    }
  }
    // eslint-disable-next-line
    , [x, y, daysData, dataType]);

  useEffect(() => {
    const layers = d3
      .select(barsRef.current)
      .selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", (d) => {
        return stringToColor(taskName(d.key));
      });

    const duration = 1000;
    const t = d3.transition().duration(duration).ease(d3.easeLinear);

    layers.each(function (_, i) {
      const rect = d3.select(this)
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .attr("x", (d) => x(d[0]))
        .attr("y", (d) => {
          return y(d.data.day)
        })
        .attr("height", y.bandwidth())

      rect
        .append('title')
        .text(d => {
          const name = Object.keys(d.data).filter((f) => f !== 'day')[0]?.split(d.data.day)[0].trim();
          return name;
        });

      rect
        .transition(t)
        .delay(i * duration)
        .attr("width", (d) => x(d[1]) - x(d[0]));
    });


    return () => {
      layers.remove();
    }

    // eslint-disable-next-line
  }, [barsRef, daysData, dataType]);

  const taskName = (key) => {
    const words = key.split(" ");
    words.pop();
    return words.join(" ");
  };

  if (data.map(day => Object.keys(day).filter(f => f !== 'day')).flat(Infinity).length === 0) {
    return <p className="no-activites">No activities during this period</p>;
  }

  return (
    <>
      <svg
        viewBox={[0, 0, width, height]}
        width={width + marginRight}
        height={height + marginTop + marginBottom}
        style={{
          maxWidth: "100%",
          backgroundColor: "#ffffff",
          height: "auto",
          width: "100%",
          font: "10px sans-serif",
          color: "#ccc",
          borderRadius: '20px',
        }}
        ref={svgRef}
      >
        <g
          fill="currentColor"
          fontSize="10"
          fontFamily="sans-serif"
          textAnchor="middle"
          ref={barsRef}
        ></g>
        <g fill="white" textAnchor="end" ref={labelsRef} className="labels"></g>
        <g ref={gx} transform={`translate(0,${marginTop})`}></g>
        <g ref={gy} transform={`translate(${marginLeft},0)`} />
      </svg>
      <ChartReport rows={colorRows} totalTime={colorRows.reduce((p, c) => p + c.totalMins, 0)} />
    </>
  );
}

export default StackedBarChart;
