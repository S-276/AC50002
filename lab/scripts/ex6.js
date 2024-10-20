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
        })
        .style("background-color", function(d) {
            // Use a better way to calculate the color
            let colorValue = Math.min(255, 2 * d); // Ensure the value is between 0 and 255
            let hexColor = colorValue.toString(16).padStart(2, '0'); // Convert to hex and pad if needed
            return "#" + hexColor + hexColor + hexColor; // Create a shade of grey
        });
}

window.onload = d3Draw;
