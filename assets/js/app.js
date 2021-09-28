
var svgWidth = 850;
var svgHeight = 650;

var margin = {
  top: 110,
  right: 10,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#childdiv")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  svg.append("rect")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("fill", "white");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
// Import Data



d3.csv("https://raw.githubusercontent.com/mgfogerson/my_csv/main/data.csv").then(function(data) {    
    var xLinearScale = d3.scaleLinear()
      .domain([0, 30])
      .range([0, width]);
      

    var yLinearScale = d3.scaleLinear()
      .domain([20000, 80000])
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
    .attr("transform", `translate(${width / 2}, ${height + margin.bottom -50})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "25px")
    .attr("class", "axisText")
    .text("Percentage Without Healthcare");
    
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.bottom -570})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .text("Average Household Income vs. Percent Uninsured, By State")

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-size", "25px")
    .attr("class", "axisText")
    .style("text-anchor", "middle")
    .text("Avg. Income");
    
    var hoverTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -80])
    .html(function(d) {
        return (`${d.state}<br> % Without Healthcare: ${d.healthcare}<br>Average Income: $${d.income}`);
      });

    chartGroup.call(hoverTip);
    // Create event listeners to display and hide the tooltip
      circlesGroup.on("mouseover", function(stateinfo) {
        hoverTip.show(stateinfo, this);
        d3.select(this).attr("opacity", "0.7")
        d3.select(this).attr("r", "20")
      })
        // onmouseout event
    .on("mouseout", function(stateinfo, index) {
            hoverTip.hide(stateinfo);
            circlesGroup.attr("opacity", "0.5")
            d3.select(this).attr("r", "15")
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
  .attr("class", "svgText")
  .attr("font-family", "sans-serif")
  .attr("font-size", "8px")
  .attr("text-anchor", "middle")
  .attr("fill", "white");

});
