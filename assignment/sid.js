function initmap(){
  const map = L.map('map').setView([54.505,-2.09],6); //Latitiude,Longitude,Zoom Level
  //Loading OpenStreetMap from Leaflet Map
  l.titlelayer('https://{s}.title.openstreetmap.org/{x}{y}{z}/png',{attribution:'OpenStreetMap contributors'
                                                                   }).addTo(map);
  return map;
}
function TownMarker(town,map,tootltip){
  const LatLong = new L.LatLong(town.lat,town.lng);
  const marker = L.circleMarker(LatLong,(
    radius:5,
    color:'red',
    fillColor:'#f03',
    fillOpacity:0.6
    }).addTo(map);
    marker.on("mouseover",function(event){
      tooltip.html('<strong>Town:</strong> ${town.Town}<br> <strong>Population:</strong> ${town.Population}<br> <strong>Latitude:</strong> ${town.lat}<br> <strong>Longitude:</strong> ${town.lng}')
      .style("visibility","visible")
      .style("left",(event.originalEvent.pageX + 10) + "px")
      .stlye("top",(event.originalEvent.pageY - 10) + "px");
    })
    .on("mouseout",function(){
      tooltip.style("visibility","hidden");
    });
  }
function TownData(map){
  const tooltip = d3.select(".tooltip");
  d3.json("http://34.147.162.172/Circles/Towns/50").then(function(towns){
    towns.forEach(town => {
      TownMarker(town,map,tooltip);
    });
  });
}
function initSVGOverlay(map){
  const svg = d3.select(map.getPanes().overlayPane).append("svg")
  .attr("width", map.getSize().x)
  .attr("height",map.getSize().y);
  const g = svg.append("g").attr("class","leaflet-zoom-hide");
  return g;
}
function createSVGMarker(town,g,tooltip,map)
