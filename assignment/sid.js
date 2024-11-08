// Initialize the Leaflet map
var map = L.map('map').setView([55, -3.5], 6); // Center on the UK

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create a D3 layer on top of Leaflet
var svgLayer = d3.select(map.getPanes().overlayPane).append("svg");
var g = svgLayer.append("g").attr("class", "leaflet-zoom-hide");

// Helper function to project LatLng points to the SVG layer
function projectPoint(lat, lng) {
    var point = map.latLngToLayerPoint(new L.LatLng(lat, lng));
    return [point.x, point.y];
}

// Function to load and plot data
function loadData() {
    d3.json("http://34.147.162.172/Circles/Towns/50", function(error, data) {
        if (error) throw error;

        // Limit the number of towns using the slider value
        var townCount = document.getElementById("townCount").value;
        var towns = data.slice(0, townCount);

        // Bind data and create circles for each town
        var circles = g.selectAll(".town")
            .data(towns, function(d) { return d.Town; });

        // Remove old circles
        circles.exit().remove();

        // Enter new circles
        circles.enter().append("circle")
            .attr("class", "town")
            .attr("r", 5)
            .style("fill", "blue")
            .style("opacity", 0)
            .transition().duration(1000)
            .style("opacity", 0.7);

        // Update the positions of the circles
        function update() {
            circles.attr("cx", function(d) { return projectPoint(d.lat, d.lng)[0]; })
                   .attr("cy", function(d) { return projectPoint(d.lat, d.lng)[1]; });
        }

        map.on("viewreset", update); // Update on map reset
        update(); // Initial update

        // Add tooltips for additional information on hover
        circles.on("mouseover", function(d) {
            d3.select(this).attr("r", 8).style("fill", "orange");
            L.popup()
                .setLatLng([d.lat, d.lng])
                .setContent(d.Town + "<br>Population: " + d.Population)
                .openOn(map);
        }).on("mouseout", function(d) {
            d3.select(this).attr("r", 5).style("fill", "blue");
            map.closePopup();
        });
    });
}

// Attach loadData function to button and slider changes
d3.select("#reloadData").on("click", loadData);
d3.select("#townCount").on("input", loadData);

// Initial load of data
loadData();
