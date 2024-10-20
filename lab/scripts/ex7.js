function d3Draw(){
  let dataset=[5,10,,15,20,25,30];
  Width = 300;
  Height = 200;
  let svg = d3.select("body").append("svg").attr("Width",Width).attr("Height",Height);
}

window.onload=d3Draw;
