fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => response.json())
  .then((data) => {
    // create svg canvas
    const svg = d3.select(".canvas");
    const svgWidth = document.querySelector(".canvas").clientWidth;
    const svgHeight = document.querySelector(".canvas").clientHeight;
    const padding = 70;

    // set x and y scales
    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.Year) - 1,
        d3.max(data, (d) => d.Year) + 1
      ])
      .range([padding, svgWidth - padding]);
    const parseTime = d3.timeParse("%M:%S");
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => parseTime(d.Time)),
        d3.max(data, (d) => parseTime(d.Time))
      ])
      .range([padding, svgHeight - padding]);

    // create axes
    let xTicksInterval = 2;
    if (svgWidth < 400) {
      xTicksInterval = 10;
    } else if (svgWidth < 600) {
      xTicksInterval = 5;
    }
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(
        Math.floor(
          (d3.max(data, (d) => d.Year) + 1 - d3.min(data, (d) => d.Year) + 1) /
            xTicksInterval
        )
      )
      .tickFormat((x) => x.toString());
    const formatTime = d3.timeFormat("%M:%S");
    const yAxis = d3.axisLeft(yScale).tickFormat((y) => formatTime(y));
    svg
      .append("g")
      .attr("transform", `translate(0, ${svgHeight - padding})`)
      .attr("id", "x-axis")
      .call(xAxis);
    svg
      .append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis);

    // add y-axis title
    svg
      .append("text")
      .attr("x", -180)
      .attr("y", padding - 40)
      .style("font-size", ".8rem")
      .text("Time in Minutes")
      .style("transform", "rotate(-90deg)");

    // create dots for each data point
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(parseTime(d.Time)))
      .attr("r", 5)
      .attr("class", (d) =>
        d.Doping.length === 0 ? "dot without-doping" : "dot with-doping"
      )
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => parseTime(d.Time))

      // show tooltip on bar:hover
      .on("mouseover", (event, d) => {
        const tooltip = d3.select("#tooltip");
        tooltip
          .style("display", "block")
          .style("left", xScale(d.Year) + 10 + "px")
          .style("top", yScale(parseTime(d.Time)) + "px")
          .html(
            `${d.Name}, ${d.Nationality}<br><br>${d.Time}` +
              (d.Doping.length === 0 ? `` : `<br>${d.Doping}`)
          )
          .attr("data-year", d.Year);
      })
      .on("mouseout", (event, d) => {
        const tooltip = d3.select("#tooltip");
        tooltip.style("display", "none");
      });
  })
  .catch((error) => console.log(error));
