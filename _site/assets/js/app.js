
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 100,
  right: 100,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#childdiv")
  .append("svg")
  // .attr("width", svgWidth)
  // .attr("height", svgHeight);
  .attr("viewBox", '0 0 1000 1000')

  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "white");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
// Import Data



d3.csv("https://raw.githubusercontent.com/mgfogerson/my_csv/main/data.csv").then(function(data) {    
    var xLinearScale = d3.scaleLinear()
      .domain([0, 30])
      .range([0, width]);
      

    var yLinearScale = d3.scaleLinear()
      .domain([30000, d3.max(data, d => d.income)])
      .range([height, 0]);
    
    //Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
      

    chartGroup.append("g")
      .call(leftAxis);


    //Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");

   
    chartGroup.append("text")
    // Position the text
    // Center the text:
    .attr("transform", `translate(${width / 2}, ${height + margin.top -40})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("class", "axisText")
    .text("Percentage Without Healthcare");
    

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-size", "20px")
    .attr("class", "axisText")
    .style("text-anchor", "middle")
    .text("Avg. Income");
    
    var hoverTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
        return (`${d.state}<br> % Without Healthcare: ${d.healthcare}<br>Average Income: $${d.income}`);
      });

    chartGroup.call(hoverTip);
    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(stateinfo) {
        hoverTip.show(stateinfo, this);
      })
        // onmouseout event
    .on("mouseout", function(stateinfo, index) {
            hoverTip.hide(stateinfo);
    });
    var circleLabels = chartGroup.selectAll(null).data(data).enter().append("text");
    
    circleLabels
  .attr("x", function(d) {
    return xLinearScale(d.healthcare);
  })
  .attr("y", function(d) {
    return yLinearScale(d.income);
  })
  .text(function(d) {
    return d.abbr;
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "10px")
  .attr("text-anchor", "middle")
  .attr("fill", "white");

});
