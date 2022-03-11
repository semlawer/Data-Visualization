let svg_trends = d3.select("#trends_chart").select('#trends')


var years = {},
        startYear = 2009,
        endYear = 2019,
        currentYear = startYear;

    const time = ["2009", '2010','2011','2012','2013','2014','2015','2016','2017','2018','2019']
    const trend = ['trend_2009','trend_2010','trend_2011','trend_2012','trend_2013','trend_2014',
        'trend_2015','trend_2016','trend_2017','trend_2018','trend_2019']
    const abortion_ratio = ["abortion_2009",'abortion_2010','abortion_2011','abortion_2012','abortion_2013','abortion_2014',
        'abortion_2015','abortion_2016','abortion_2017','abortion_2018','abortion_2019']
    // var married = [married_perc_2009,married_perc_2010,married_perc_2011,married_perc_2012,married_perc_2013,
    //     married_perc_2014,married_perc_2015,married_perc_2016,married_perc_2017,married_perc_2018,married_perc_2019]
    var inputValue = 10;
    // document.getElementById("year").innerHTML=years[value];



    Promise.all([
        d3.json('data/by_year_trend.json'),
    ])
        .then(ready)
        .catch((err) => {
            console.log(err);
        });

    function ready(res) {
        console.log(res[0])
        let raw = res[0]
        let state = topojson.feature(raw, raw.objects.state);
        let abort = topojson.feature(raw, raw.objects.Abortion_combined);

        let width = 1050;
        let height = 500;

        state.features.forEach(function (row) {
            row.properties.women_16 = +row.properties.women_16
            row.properties.women_20 = +row.properties.women_20
            row.properties.abortion_2009 = +row.properties.abortion_2009
            row.properties.abortion_2010 = +row.properties.abortion_2010
            row.properties.abortion_2011 = +row.properties.abortion_2011
            row.properties.abortion_2012 = +row.properties.abortion_2012
            row.properties.abortion_2013 = +row.properties.abortion_2013
            row.properties.abortion_2014 = +row.properties.abortion_2014
            row.properties.abortion_2015 = +row.properties.abortion_2015
            row.properties.abortion_2016 = +row.properties.abortion_2016
            row.properties.abortion_2017 = +row.properties.abortion_2017
            row.properties.abortion_2018 = +row.properties.abortion_2018
            row.properties.abortion_2019 = +row.properties.abortion_2019
        })

        console.log(state.features)

        let myProjection = d3.geoAlbersUsa()
            .fitSize([width, height], state)
        // path function
        let path = d3.geoPath()
            .projection(myProjection)

        let innerlines = topojson.mesh(raw, raw.objects.state, function (a,b) {
            return a !=b;
            });

        var now_trend = trend[inputValue];

        console.log(now_trend)
        

        var colorCodes = ["#eaf2f9", "#d5e6f2", "#c0d9ec", "#aacde6", "#94c1df", "#7cb5d9", "#6794b1", 
            "#52758b", "#3f5766"];

        // var color = d3.scaleQuantize()
        //     .domain([0,100])
        //     .range(colorbrewer.Greens[7]);
        var color = d3.scaleThreshold()
            .domain([50,65,80,90,100])
            .range(colorbrewer.Greens[5]);

        let states = svg_trends.append("g")
            .selectAll(".states")
            .data(state.features)
            .join("path")
            .attr("d", path)
            .style("fill", function(d) {
				return color(d.properties[now_trend]) })
            .style("stroke", "black")
            .attr("class", function (d) { return "circle c-" + d.properties.NAME })


        let popup2 = d3.select("#pop-up-2");

        // Create and customize tooltip


        // LEGEND
        const x = d3.scaleLinear()
            .domain([2.6, 75.1])
            .rangeRound([600, 860]);

        const legend = svg_trends.append("g")
		.attr("id", "legend");

        const legend_entry = legend.selectAll("g.legend")
            .data(color.range().map(function(d) {
                d = color.invertExtent(d);
                if (d[0] == null) d[0] = x.domain()[0];
                if (d[1] == null) d[1] = x.domain()[1];
                return d;
            }))
            .enter().append("g")
            .attr("class", "legend_entry");

        const ls_w = 20,
            ls_h = 20;

        legend_entry.append("rect")
            .attr("x", 20)
            .attr("y", function(d, i) {
                return height - (i * ls_h) - 2 * ls_h;
            })
            .attr("width", ls_w)
            .attr("height", ls_h)
            .style("fill", function(d) {
                return color(d[0]);
            })
            .style("opacity", 0.8);

        legend_entry.append("text")
            .attr("x", 50)
            .attr("y", function(d, i) {
                return height - (i * ls_h) - ls_h - 6;
            })
        legend_entry.append("text")
            .attr("x", 50)
            .attr("y", function(d, i) {
                return height - (i * ls_h) - ls_h - 6;
            })
            .text(function(d, i) {
                console.log(d)
                if (i === 0) return "< " + d[1];
                if (d[1] < d[0]) return d[0] + "+";
                return d[0] + "-" + d[1];
            });

        legend.append("text").attr("x", 15).attr("y", 370).text("Relative Searches");
        
        states.on("mouseover", (event, d) => {

        // states
        //     .style("stroke", "#333333")
        //     .style("stroke-width", .5)
        //     .style("fill", "#c0cad8")
        //     .style("fill-opacity", .5)

        svg_trends.select(".c-"+ d.properties.NAME)
            .style("stroke", "red")
            .style("stroke-width", 2)
            .style("opacity", 1)
            .raise()

        let lang = d.properties.NAME+ " has " + d.properties[now_trend] + " searches relative to other states"

        popup2
            .style("opacity", 1)
            .style("left", (event.x-10) + "px")
            .style("top", (event.y+10) + "px")
            .html(lang)

        })

        states.on("mouseout", (event, d) => {
        // console.log(event)
        states
            .style("fill", function(d) {
				return color(d.properties[now_trend]) })
            .style("stroke", "black")
            .style("stroke-width", 1)

        popup2
            .style("opacity", 0)

})

        d3.select("#timeslide").on("input", function() {
            update(+this.value);
        });
        
        function update(value) {
            document.getElementById("range").innerHTML=time[value];
            inputValue = time[value];
            now_trend = trend[value]

            states
                .transition()
                .duration(1000)
                .style("fill", function(d) {
                        return color(d.properties[now_trend])})
        }
    }