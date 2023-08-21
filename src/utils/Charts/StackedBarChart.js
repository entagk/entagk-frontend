import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { stringToColor } from "../helper";

function StackedBarChart({ daysData, dataType }) {
  const data = daysData?.map((d) => {
    const requiredData = d?.[dataType]?.reduce(
      (obj, item) =>
        Object.assign(obj, { [`${item?.name} ${d?.day}`]: item?.totalMins }),
      {}
    );
    const dayTotalMins = requiredData ? Object?.values(requiredData).reduce((p, t) => p + t, 0) : 0;
    if (d.totalMins !== dayTotalMins && requiredData) {
      const unknownName = dataType === 'tasks' ? "unknown task" : dataType === 'templates' ? 'unknown template' : 'unknown type';
      requiredData[unknownName + " " + d.day] = d.totalMins - dayTotalMins;
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

  const xMax = stackedData.length ? d3.max(stackedData[stackedData.length - 1], (d) => d[1]) : 10;
  // Declare the x (horizontal position) scale.
  const x = d3
    .scaleLinear()
    .domain([0, xMax + (xMax / 4)]) //
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
      .call((text) => text.text((t) => t?.replaceAll("-", "/")))
      .call((g) => g.select(".domain").remove());
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
        );
    })
  }
    // eslint-disable-next-line
    , [x, y, data]);

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
      d3.select(this)
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .attr("x", (d) => x(d[0]))
        .attr("y", (d) => {
          return y(d.data.day)
        })
        .attr("height", y.bandwidth())
        .transition(t)
        .delay(i * duration)
        .attr("width", (d) => x(d[1]) - x(d[0]));
    });
  });

  const taskName = (key) => {
    const words = key.split(" ");
    words.pop();
    return words.join(" ");
  };

  const filteredTasks = () => {
    const newTasks = keys.map((t) => taskName(t));

    return newTasks.filter((item, index) => {
      return newTasks.indexOf(item) === index;
    });
  };

  console.log(filteredTasks());

  return (
    <>
      <svg
        viewBox={[0, 0, width, height]}
        width={width + marginRight}
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
      {/* <div className="colors-container">
        {filteredTasks().map((key) => (
          <div
            className="color-row"
          >
            <div
              style={{
                background: `${stringToColor(key)}`,
                width: "20px",
                height: "20px",
                margin: '10px'
              }}
            ></div>
            {key}
          </div>
        ))}
      </div> */}
    </>
  );
}

export default StackedBarChart;
