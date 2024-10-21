function drawBars() {
    let contentDiv = document.getElementById('bar');
    
    // Clear the existing content if needed
    contentDiv.innerHTML = ""; // Optional: Clear the content of div
    
    for (let i = 0; i < 10; i++) {
        let barElement = document.createElement('div'); // Create a new <div> element
        barElement.id = "bar " + i; // Assign an id like bar0,bar1,etc.
        barElement.className = 'bar';  // Assign the 'bar' class for styling
        contentDiv.appendChild(barElement); // Append the new <div> to content <div>
    }
}
