function d3Draw(){
let dataset = [5,10,15,20,25,30];
  
  d3.select("body").selectAll("p")
   .data(dataset)
   .enter()
   .append("p")
   .text(Bob);
}
window.onload = D3Draw;

function Bob(data){
  return "new paragraph" + data;
}
