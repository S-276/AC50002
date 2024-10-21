function d3Draw(dataset){
  const Width = 600;
  const Height = 400;

  let svg = d3.select("body").append("svg").attr("width",Width).attr("height",Height);
  let circles = svg.selectAll("circle").data(dataset).enter().append("circle");
  circles.attr("cx",function(d){
    return d.x;
  }).attr("cy",function(d){
    return d.y;
  }).attr("r",function(d){
    return d.r;
  });
}

function loadData() {
  d3.json("http://34.147.162.172/Circles/Circles/50", function(error, data) {
    if (error) {
      console.log("Error:", error);
      console.log("Status code:", error.target.status);  // Log status code
    } else {
      d3Draw(data);
    }
  });
}


window.onload=loadData;
