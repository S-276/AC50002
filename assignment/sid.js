// Configuration and setup
const width = 800, height = 600;
const projection = d3.geoMercator().center([-2, 55.4]).scale(2000).translate([width / 2, height / 2]);
const path = d3.geoPath().projection(projection);
const tooltip = d3.select("#tooltip");
const svg = d3.select("svg#map");
const townGroup = svg.append("g").attr("class", "towns");

// Load map data and initialize map
d3.json("https://raw.githubusercontent.com/markmarkoh/datamaps/master/src/js/data/uk.topo.json").then(initMap).catch(console.error);

function initMap(ukData) {
    const subunits = topojson.feature(ukData, ukData.objects.subunits).features;
    svg.selectAll(".subunit")
       .data(subunits)
       .enter()
       .append("path")
       .attr("class", "subunit")
       .attr("d", path)
       .on("mouseover", showTooltip)
       .on("mouseout", hideTooltip);

    applyZoom();
    loadTowns();
    setupReloadButton();
}

function showTooltip(event, d) {
    d3.select(event.currentTarget).style("fill", "whitesmoke");
    tooltip.style("display", "inline-block").html(`Region: ${d.properties.name}`);
}

function hideTooltip(event) {
    d3.select(event.currentTarget).style("fill", "white");
    tooltip.style("display", "none");
}

// Load and display town data
function loadTowns() {
    const townCount = document.getElementById("town-count-input").value || 50;
    const url = `http://34.147.162.172/Circles/Towns/${townCount}`;

    d3.json(url).then(renderTowns).catch(error => console.error("Error fetching town data:", error));
}

function renderTowns(towns) {
    const validTowns = towns.filter(d => !isNaN(d.lng) && !isNaN(d.lat));

    townGroup.selectAll(".town").remove();

    townGroup.selectAll(".town")
             .data(validTowns)
             .enter()
             .append("circle")
             .attr("class", "town")
             .attr("r", 5)
             .attr("cx", d => projection([d.lng, d.lat])[0])
             .attr("cy", d => projection([d.lng, d.lat])[1])
             .on("mouseover", (event, d) => {
                 d3.select(event.currentTarget).style("fill", "yellow");
                 tooltip.style("display", "inline-block")
                        .html(`Town: ${d.Town}<br>Population: ${d.Population}<br>County: ${d.County}`);
             })
             .on("mouseout", function() {
                 d3.select(this).style("fill", "red");
                 tooltip.style("display", "none");
             });
}

// Zoom and pan functionality
function applyZoom() {
    const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", event => {
        svg.selectAll("path").attr("transform", event.transform);
        svg.select(".towns").attr("transform", event.transform);
    });

    svg.call(zoom);
}

// Reload button event listener
function setupReloadButton() {
    document.getElementById("reload-button").addEventListener("click", loadTowns);
}
