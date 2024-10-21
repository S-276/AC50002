function drawBars() {
            const barContainer = document.getElementById("bar");
            barContainer.innerHTML = '';  // Clear previous bars if any
	    const numberOfBars = 10
            for (let i = 0; i < numberOfBars; i++) {
                let bar = document.createElement("div");
                let height = (i + 1) * 30; // Ascending height for bars
                let colour = ~~(i * 254 / numberOfBars); // Grayscale value
                let scolour = "rgb(" + colour + "," + colour + "," + colour + ")";

                bar.style.height = height + "px";
                bar.style.backgroundColor = scolour;
                bar.className = "bar";

                barContainer.appendChild(bar);
            }
        }
