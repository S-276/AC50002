// Set up the dimensions and create the SVG element
var width = 800, height = 600;
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

// Create a projection and path generator for the UK map
var projection = d3.geo.albers()
    .center([0, 55.4])    // Center of UK
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(4500)          // Scale to zoom into the UK
    .translate([width / 2, height / 2]);

var path = d3.geo.path().projection(projection);

// Load and draw the UK map with TopoJSON
d3.json("path/to/uk-topo.json", function(error, uk) {
    if (error) throw error;

    var subunits = topojson.feature(uk, uk.objects.subunits);
    
    svg.selectAll(".subunit")
        .data(subunits.features)
        .enter().append("path")
        .attr("class", "subunit")
        .attr("d", path)
        .style("fill", "#ccc")
        .style("stroke", "#333");
});

// Function to load and plot towns
function loadData() {
    d3.json("http://34.147.162.172/Circles/Towns/50", function(error, data) {
        if (error) throw error;

        var townCount = document.getElementById("townCount").value;
        var towns = data.slice(0, townCount);

        // Bind data and create circles for towns
        var circles = svg.selectAll(".town")
            .data(towns, function(d) { return d.Town; });

        circles.exit().remove();

        // Enter and update circles
        circles.enter().append("circle")
            .attr("class", "town")
            .attr("r", 3)
            .style("fill", "blue")
            .style("opacity", 0.8)
            .attr("transform", function(d) {
                return "translate(" + projection([d.lng, d.lat]) + ")";
            });

        // Add tooltips on hover
        circles.on("mouseover", function(d) {
            d3.select(this).attr("r", 6).style("fill", "orange");
            d3.select("body").append("div")
                .attr("class", "tooltip")
                .html(d.Town + "<br>Population: " + d.Population)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        }).on("mouseout", function() {
            d3.select(this).attr("r", 3).style("fill", "blue");
            d3.select(".tooltip").remove();
        });
    });
}

// Attach the loadData function to the button and slider
d3.select("#reloadData").on("click", loadData);
d3.select("#townCount").on("input", loadData);

// Initial data load
loadData();
