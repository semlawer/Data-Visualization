let svg_laws = d3.select("#laws_chart").select('#law')


Promise.all([
    d3.json('data/output.json'),
])
    .then(ready)
    .catch((err) => {
        console.log(err);
    });

function ready(res) {
    console.log(res[0])
    let raw = res[0]
    let state = topojson.feature(raw, raw.objects.state);
    let abort = topojson.feature(raw, raw.objects.abortion_laws);

    let width = 1050;
    let height = 500;
    console.log(state.features)
    console.log(abort.features)

    state.features.forEach(function (row) {
        row.properties.law_count = +row.properties.law_count
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


    var color = d3.scaleQuantize()
        .domain([0,12])
        .range(colorbrewer.Reds[4]);

    let states = svg_laws.append("g")
        .selectAll(".states")
        .data(state.features)
        .join("path")
        .attr("d", path)
        .attr("class", function (d) { return "circle c-" + d.properties.NAME })
        .style("fill", function(d) {
            return color(d.properties.law_count) })
        .style("stroke", "black")


    let popup1 = d3.select(".pop-up-1");

    // Create and customize tooltip


    // LEGEND
    const x = d3.scaleLinear()
        .domain([2.6, 75.1])
        .rangeRound([600, 860]);

    const legend = svg_laws.append("g")
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
            if (i === 0) return "< " + d[1];
            if (d[1] < d[0]) return d[0] + "+";
            return d[0] + "-" + d[1];
        });

    legend.append("text").attr("x", 15).attr("y", 390).text("No. of Laws");

    function fade(opacity, selected) {
        d3.selectAll("states")
            .filter(function(e) { return e !== d; })
            .transition()
            .style("opacity", opacity);
};
    states.on("mouseover", (event, d) => {
        states
            .style("stroke", "#333333")
            .style("stroke-width", .5)
            .style("fill-opacity", .5)

        svg_laws.select(".c-" + d.properties.NAME)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .style("fill", function(d) {
                return color(d.properties.law_count) })
            .style("fill-opacity", 1)
            .raise()

        let reScaleLang = d3.scaleThreshold()
            .domain([3,6,9]) //make sure to put this in brackets!
            .range(["accessible", "partially accessible", "restricted", "highly restrictive"])

        let lang = d.properties.NAME+ " has " + d.properties.law_count + " restrictive abortion laws as of 2017. "
        lang += "This means that abortion access is  <strong>" +  reScaleLang(d.properties.law_count) + "</strong>. <br> <br>"
        lang += "<u> Status of 12 most common abortion laws:</u> <br> - Mandatory Waiting Period: " + d.properties.waiting_period
        lang += "<br> - Ban on Partial Birth Abortions: " + d.properties.partial_ban
        lang += "<br> - Abortion prohibited after specific gestational age: " + d.properties.gestational_prohibits + "<br> - Ultrasound Requirement: " + d.properties.ultrasound
        lang += "<br> - Federal funding only allowed in extreme cases: " + d.properties.fed_funding + "<br> - Clinic needs to be at ambulatory surgical center standards: " + d.properties.clinic_ambulatory
        lang += "<br> - Mandated counseling on abortion 'reversal': " + d.properties.counsel_abortion_reversal + "<br> - Private insurance allowed to cover abortion: " + d.properties.private_insurance
        lang += "<br> - Insurance marketplace restricts coverage: " + d.properties.marketplace_restrict + "<br> - Public insurance restricts coverage: " + d.properties.public_restrict
        lang += "<br> - Provider needs hospital admitting privileges: " + d.properties.hospital_admit_priv
        lang += "<br> - Parental Notification/Consent: " + d.properties.parental
        
        
        popup1
            .style("opacity", 1)
            .style("left", (event.x+10) + "px")
            .style("top", (event.y+10) + "px")
            .html(lang)

        })

    states.on("mouseout", (event, d) => {
    // console.log(event)
    states
        .style("fill", function(d) {
            return color(d.properties.law_count) })
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill-opacity", 1)

    popup1
        .style("opacity", 0)

        })

    }