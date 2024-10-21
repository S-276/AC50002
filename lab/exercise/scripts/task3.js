function drawBars() {
            const contentDiv = document.getElementById('bar');
            const values = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450]; // Example values for heights

            // Clear the existing content if needed
            contentDiv.innerHTML = "";

            // Find the maximum value for scaling purposes
            const maxValue = Math.max(...values);

            for (let i = 0; i < values.length; i++) {
                const barElement = document.createElement('div'); // Create a new <div> element for each bar

                // Calculate the height based on the value and scale it to fit the container
                const height = (values[i] / maxValue) * 100; // Scale height to a percentage of the max value

                // Color calculation based on scaled height (grayscale)
                var colour = ~~(height * 2.54); // Scale the color from 0 to 255
                var scolour = "rgb(" + colour + "," + colour + "," + colour + ")"; // Create the RGB color string

                // Set the height and background color of the bar
                barElement.className = 'bar'; // Assign class for styling
                barElement.style.height = height + "%"; // Set height of the bar
                barElement.style.backgroundColor = scolour; // Set background color of the bar

                contentDiv.appendChild(barElement); // Append the new <div> to the container
            }
        }
