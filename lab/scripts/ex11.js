function d3Draw(dataset){
  Width = 600;
  Height = 400;

  let svg = d3.select("body").append("svg").attr("width",Width).attr("height",Height);
  let circles = svg.selectAll("circle").data(dataset).enter().append("circle");
  circles.attr("cx",function(d){
    return d.x;
  }).attr("cy",function(d){
    return d.y;
  }).attr("r",5);
}

function loadData(){
  d3.csv("http://34.147.162.172/Circles/Circles/50",function(error,data){
    if(error){
      console.log(error)
    }else{
      d3Draw(data);
  }
  });
         }

window.onload=loadData;
