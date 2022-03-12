console.log({ d3 })


let width = 800;
let height = 500;

let svg = d3.select("#lines_chart")
    .select("#line-chart")

console.log(svg)


d3.csv("data/yearly_abortion.csv").then(function (data) {

    //when temp is loaded, then pass data into this block
    //all references to the data need to be in this block

    //d3.csv is part of a suite of other functions that can do json, xml, tsv too.  
    //https://github.com/d3/d3-fetch

    console.log(data)

    data.forEach(function (row) {
        row.year = +row.year
        row.abortion_count = +row.abortion_count
        row.abortion_rate = +row.abortion_rate

    })    

    console.log(data)

    let margin = { top: 30, right: 10, bottom: 10, left: 10 };

    //d3 scales for the x and y axis
    //domain takes the data we have and maps them into SVG space
    //in this case we need to use scaleTime because we're dealin time data
    let x = d3.scaleTime()
        .domain([1970,2018]) //d3 extent
        .range([margin.left, width - margin.right])

    //in this case we need to use scaleLinear because we're dealin linear data
    let y = d3.scaleLinear()
        .domain([0,30])
        .range([height - margin.bottom, margin.top])


    //define the settings for our axes
    //https://github.com/d3/d3-axis
    let yAxisSettings = d3.axisLeft(y) //set axis to the left
        .tickSize(-width) //size of tick lines
        .tickPadding(0) //distance from tick labels to tick marks
        .tickValues([5,10,15,20,25,30])

    let xAxisSettings = d3.axisBottom(x)
        .tickValues([1973,1976,1984,1992, 2007,2016])
        .tickSize(10)
        .tickPadding(10)
        .tickFormat(d3.format(".0f"))

    //adding to the axes to our chart
    let xAxisTicks = svg.append("g")
        .attr("class", "x axis") //give each axis a class
        .call(xAxisSettings)
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .style("font-family", "'Times New Roman', Times, serif");


    let yAxisTicks = svg.append("g")
        .attr("class", "y axis")
        .call(yAxisSettings)
        // .call(g => g.selectAll("domain").remove())
        .attr("transform", `translate(${margin.left},0)`)
        .selectAll("text")
        .attr("dy","-0.3em")
        .attr("dx","1em")
        .style("font-family", "'Times New Roman', Times, serif");


    let line = d3.line() //define a line function
        .x(function (d) { return x(d.year) }) //accessing date 
        .y(function (d) {return y(d.abortion_rate) }) //accesssing value 

    // //neat trick https://observablehq.com/@d3/line-with-missing-data

    let line_path = svg.append("path") //Add a grouping element. It's useful to organize svg elements. https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g
        .attr("class", "line") // Give circles a class name.
        .attr("d", line(data))
        .style("fill", "none")
        .style("stroke", "pink")
        .style("stroke-width", 4)

    let baseline = svg.append("line")
    .attr("x1", margin.left)
    .attr("x2", width + margin.left)
    .attr("y1", y(0))
    .attr("y2", y(0))
    .style("stroke", "#999")
    .style("stroke-width", "1px")

    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", margin.left+20)
        .attr("y", 0+26)
        .text("ABORTIONS PER 1,000 WOMEN AGE 15-44")
        .style("font-size", "14px")
        .style("font-family", "'Times New Roman', Times, serif");


    // annotate_top("Roe v. Wade", 1973, 16.3)
    // annotate_top("Hyde Park Amendment", 1976, 24.2)
    // annotate_top("Global gag rule", 1984, 28.1)
    // annotate_top("Planned Parenthood v. Casey", 1992, 25.7)
    // annotate_top("Gonzales v. Planned Parenthood", 2007, 19.5)
    // annotate_top("Whole Woman's Health v. Hellerstedt", 2016, 13.7)
    annotate_top("Roe v. Wade", 1973, 16.3,90,-5,1)
    annotate_top("Global gag rule", 1984, 28.1,270,-5,1)

    annotate_top("Hyde", 1976, 24.2,200,0,1)
    annotate_top("Amendment", 1976, 24.2,185,10,0)

    annotate_top("Planned Parenthood", 1992, 25.7,200,0,1)
    annotate_top("v. Casey", 1992, 25.7,185,0,0)

    annotate_top("Gonzales v.", 2007, 19.5,140,-5,1)
    annotate_top("Planned Parenthood", 2007, 19.5,125,-15,0)

    annotate_top("Whole Woman's Health", 2016, 13.7,60,-32,1)
    annotate_top("v. Hellerstedt", 2016, 13.7,45,-23,0)

    function annotate_top(text,year, rate, y_adj, x_adj, type) {

        svg.append("text")
            .attr("class", "g-top-label")
            .attr("x", x(year)) //accessing date 
            .attr("y", 360-y_adj)
            .attr("dy",5)
            .attr("dx",8+x_adj)
            .text(text)
            .attr("text-anchor", "middle")
            .style("fill", "black")
            .style("font-family", "'Times New Roman', Times, serif");


        if (type==1) {
            svg.append("line")
                .attr("x1",x(year))
                .attr("x2",x(year))
                .attr("y1",y(rate))
                .attr("y2",350-y_adj)
                .style("stroke", "#999")

            svg.append("line")
                .attr("x1",x(year)+0.5)
                .attr("x2",x(year)+0.5)
                .attr("y1",d => {
                    if (text=="Global gag rule" || text == "Roe v. Wade") {
                        return 350-y_adj+20
                    }
                    else {
                        return 350-y_adj+40
                    }
                }) 
                .attr("y2",490)
                .style("stroke", "#999")
            }
        }

        let circle = svg.selectAll(".circle")
            .data(data)
            .join("circle") // enter append
            .attr("r", "4") // radius
            .attr("cx", d=> x(d.year))   // center x passing through your xScale
            .attr("cy", d=> y(d.abortion_rate))   // center y through your yScale
            .attr("fill", "pink")
    

})