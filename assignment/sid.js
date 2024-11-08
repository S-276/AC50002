// Initialize the Leaflet map
var map = L.map('map').setView([55, -3.5], 6); // Center on the UK

// Load map tiles (OpenStreetMap as an example)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create a layer for D3 elements on top of Leaflet
var svgLayer = d3.select(map.getPanes().overlayPane).append("svg");
var g = svgLayer.append("g").attr("class", "leaflet-zoom-hide");

// Function to project Leaflet's coordinates to the SVG layer
function projectPoint(lat, lng) {
    var point = map.latLngToLayerPoint(new L.LatLng(lat, lng));
    return [point.x, point.y];
}

// Load and plot towns from data feed
function loadData() {
    d3.json("http://34.147.162.172/Circles/Towns/50", function(error, data) {
        if (error) throw error;

        // Select the number of towns from the slider
        var townCount = document.getElementById("townCount").value;
        var towns = data.slice(0, townCount);

        // Bind data and create circles for towns
        var circles = g.selectAll(".town")
            .data(towns, function(d) { return d.Town; });

        circles.exit().remove();

        // Enter and update circles
        circles.enter().append("circle")
            .attr("class", "town")
            .attr("r", 5)
            .style("fill", "blue")
            .style("opacity", 0)
            .transition().duration(1000)
            .style("opacity", 1);

        // Position circles on the map
        function update() {
            circles.attr("cx", function(d) { return projectPoint(d.lat, d.lng)[0]; })
                   .attr("cy", function(d) { return projectPoint(d.lat, d.lng)[1]; });
        }
        
        map.on("viewreset", update); // Update positions when the map view changes
        update(); // Initial position update

        // Add tooltips on hover
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

// Reload data when button or slider changes
d3.select("#reloadData").on("click", loadData);
d3.select("#townCount").on("input", loadData);

// Initial load
loadData();
