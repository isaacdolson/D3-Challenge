// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 660;

var chartMargin = {
    top:    50,
    right:  50,
    bottom: 50,
    left:   50
};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width",  svgWidth );

var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


// code in csv has to be from the index.html
d3.csv("assets/data/data.csv").then(function(data){
    console.log(data);
    var income = data.map(d=>+d.income)
    // console.log(income)
    var obesity = data.map(d=>+d.obesity)

    //I know I could call these anything, just what I'm used to.
    var yScale = d3.scaleLinear()
        .domain([d3.min(obesity)-2, d3.max(obesity)+2])
        .range([chartHeight, 0]);

    var xScale = d3.scaleLinear()
        .domain([d3.min(income)-1000, d3.max(income)+1000])
        .range([0, chartWidth])

    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    chartGroup.append('g')
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.append('g')
        .call(yAxis);

        var toolTip = d3.select("#scatter")
        .append("div")
        .attr("class", "tooltip")
        .style("display", "none")
    
    try{
        var circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.income))
            .attr("cy", d => yScale(d.obesity))
            .attr("r", "15")
            .attr("fill", "lightblue")
            .attr("opacity", ".75")
            .text(d=> d.abbr)

        //not starting at the beginning, not sure what to do about that.
        //unless I need to make a copy of the data, so that I have unmessed with data...
        var textGroup = chartGroup.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.income))
            .attr("y", d => yScale(d.obesity))
            .attr("text-anchor", "middle")
            .attr("fill", "grey")
            .text(d => d.abbr)
    }
    catch(err){
        console.log("Error in ploting")
    };
    try{
        // var toolTip = d3.select("#scatter")
        //     .append("div")
        //     .attr("class", "tooltip")
        //     .style("display", "none")
            // .html(function(d){
            //     return (`State ${d.state}`)
            // })
        
        // chartGroup.call(toolTip);
        circlesGroup.call(toolTip);

        //trying to get tool tips to work.
        circlesGroup.on("mouseover", function(d){
            toolTip.style("display", "block");
            toolTip.html(`State: ${d.state}`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");

        })
        .on("mouseout", function(data){
            toolTip.style("display", "none");
        });
    } catch(err){
        console.log("Error in tool Tip")
    }
        // textGroup.on("click", function(d){
        //     toolTip.show(d, this);
        // })
        // .on("mouseout", function(data){
        //     toolTip.hide(data);
        // });

        //the axis labels.
        var labelsGroup = chartGroup.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`)
            .classed("axis-text", true)
            .attr("x", 0)
            .attr("y", 20)
            .text("Income")

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - chartMargin.left)
            .attr("x", 0-(chartHeight/2))
            .attr("dy", "1em")
            .classed("axis-text", true)
            .text("Obesity %")
});
