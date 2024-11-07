// Initialize the Leaflet map
function initMap() {
  const map = L.map('map').setView([54.505, -2.09], 6); // Latitude, Longitude, Zoom Level

  // Loading OpenStreetMap tiles for Leaflet map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  return map;
}

// Function to create a marker for each town
function TownMarker(town, map, tooltip) {
  const latLng = new L.LatLng(town.lat, town.lng);

  // Create a circle marker
  const marker = L.circleMarker(latLng, {
      radius: 5,
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.6
  }).addTo(map);

  // Show tooltip on hover
  marker.on("mouseover", function(event) {
      tooltip.html(`<strong>Town:</strong> ${town.Town}<br> 
                    <strong>Population:</strong> ${town.Population}<br> 
                    <strong>Latitude:</strong> ${town.lat}<br> 
                    <strong>Longitude:</strong> ${town.lng}`)
             .style("visibility", "visible")
             .style("left", (event.originalEvent.pageX + 10) + "px")
             .style("top", (event.originalEvent.pageY - 10) + "px");
  })
  .on("mouseout", function() {
      tooltip.style("visibility", "hidden");
  });
}

// Function to fetch town data and create markers
function TownData(map) {
  const tooltip = d3.select(".tooltip");

  d3.json("http://34.147.162.172/Circles/Towns/50",function(error,towns) {
      if (error) throw error;
      towns.forEach(town => {
          TownMarker(town, map, tooltip);
      });
  });
}

// Initialize an SVG overlay on the map
function initSVGOverlay(map) {
  const svg = d3.select(map.getPanes().overlayPane).append("svg")
                .attr("width", map.getSize().x)
                .attr("height", map.getSize().y);

  const g = svg.append("g").attr("class", "leaflet-zoom-hide");
  return g;
}

// Function to create an SVG marker for each town
function createSVGMarker(town, g, tooltip, map) {
  const latLng = map.latLngToLayerPoint([town.lat, town.lng]);

  const marker = g.append("circle")
                  .attr("cx", latLng.x)
                  .attr("cy", latLng.y)
                  .attr("r", 5)
                  .attr("fill", "#f03")
                  .attr("stroke", "red")
                  .attr("stroke-width", 1);

  marker.on("mouseover", function(event) {
    const e = d3.event
      tooltip.html(`<strong>Town:</strong> ${town.Town}<br> 
                    <strong>Population:</strong> ${town.Population}<br> 
                    <strong>Latitude:</strong> ${town.lat}<br> 
                    <strong>Longitude:</strong> ${town.lng}`)
             .style("visibility", "visible")
             .style("left", (e.pageX + 10) + "px")
             .style("top", (e.pageY - 10) + "px");
  })
  .on("mouseout", function() {
      tooltip.style("visibility", "hidden");
  });
}

// Function to update SVG markers on zoom or pan
function updateSVGMarkers(g, map, towns, tooltip) {
  g.selectAll("circle").remove();
  towns.forEach(town => {
      createSVGMarker(town, g, tooltip, map);
  });
}

// Main function to initialize everything
function main() {
  const map = initMap();
  const tooltip = d3.select(".tooltip");

  // Fetch and display town data as markers
  TownData(map);

  // Add SVG overlay for town markers
  const g = initSVGOverlay(map);

  d3.json("http://34.147.162.172/Circles/Towns/50",function(error,towns) {
       if (error) throw error;
      towns.forEach(town => {
          createSVGMarker(town, g, tooltip, map);
      });

      // Update markers on zoom or pan
      map.on("zoomend", function() {
          updateSVGMarkers(g, map, towns, tooltip);
      });

      map.on("moveend", function() {
          updateSVGMarkers(g, map, towns, tooltip);
      });
  });
}

// Call the main function to initialize everything
main();
