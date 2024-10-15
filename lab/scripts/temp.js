function D3draw(){
    let dataset = [5,10,15,20,25,30,35,40,50,60];
    d3.select("head").append("H1").text("New Heading!")
    d3.select("body").append("p").text("Check")

    d3.select("body").selectall("p")
        .data(dataset)
        .enter()
        .append("p")
        .text("new para");
}

window.onLoad = D3Draw;