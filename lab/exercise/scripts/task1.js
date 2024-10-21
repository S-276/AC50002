function ChangeHTML() {
    let oldParagraph = document.getElementById('Par1');
    
    // Clear the existing content if needed
    oldParagraph.innerHTML = ""; // Optional: Clear old content before adding new paragraphs
    
    for (let i = 0; i < 10; i++) {
        let newParagraph = "This is a new paragraph, Paragraph " + i; // Create the text for the current paragraph
        let paragraphElement = document.createElement('p'); // Create a new <p> element
        paragraphElement.innerHTML = newParagraph; // Set the text for the new paragraph
        oldParagraph.appendChild(paragraphElement); // Append the new paragraph to the oldParagraph
    }
}
