function d3Draw() {
    let dataset = [5, 10, 15, 20, 25, 30, 35, 60, 70];

    // Select the body and bind the data to divs
    d3.select("body").selectAll("div")
        .data(dataset)
        .enter()
        .append("div")
        .attr("class", "bar")
        .style("height", function(d) {
            return (2 * d) + "px"; // Set the height based on data
        }).style("background-color", function(d) {
            return "rgb(" + (2 * d) + ", " + (100 - d) + ", " + (255 - 2 * d) + ")";
        });
}

window.onload = d3Draw;
