// Map setup with Leaflet centered on the UK
const map = L.map('map', {
    center: [55.4, -2],
    zoom: 6,
    maxBounds: [
        [49.5, -10.5],
        [61, 3]
    ]
});

// Tile layer for the map (using OpenStreetMap tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
    minZoom: 5,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Custom pin icon as Leaflet divIcon
const pinIcon = L.divIcon({
    className: 'custom-pin-icon marker-transition',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

// Create a layer group to hold markers so we can easily clear them
const markersLayer = L.layerGroup().addTo(map);

// Function to load and render towns
function loadTowns() {
    const townCount = document.getElementById("town-count-input").value || 50;
    const url = `http://34.147.162.172/Circles/Towns/${townCount}`;

    fetch(url)
        .then(response => response.json())
        .then(towns => {
            const validTowns = towns.filter(d => !isNaN(d.lng) && !isNaN(d.lat));

            // Clear previous markers from the map with disappearing transition
            markersLayer.eachLayer(function (layer) {
                const markerElement = layer.getElement();
                markerElement.classList.add('disappear'); // Apply disappear class for smooth fade out
                
                // Wait for the transition to end before removing the marker
                setTimeout(() => {
                    markersLayer.removeLayer(layer); // Remove layer after fade-out is complete
                }, 500); // Time should match the transition duration
            });

            // Create a bounds object to fit all markers dynamically
            const bounds = [];

            // Add new markers
            validTowns.forEach((town, index) => {
                const marker = L.marker([town.lat, town.lng], { icon: pinIcon }).addTo(markersLayer);

                // Add marker's LatLng to bounds to adjust map view later
                bounds.push([town.lat, town.lng]);

                // Delay marker appearance for transition effect
                setTimeout(() => {
                    marker.getElement().classList.add('appear');
                }, index * 10);

                // Popup dialog box with town details
                marker.bindPopup(`
                    <div>
                        <strong>${town.Town}</strong><br>
                        <small>Population: ${town.Population}</small><br>
                        <small>County: ${town.County}</small>
                    </div>
                `);

                // Open popup on hover
                marker.on('mouseover', function () {
                    this.openPopup();
                });

                marker.on('mouseout', function () {
                    this.closePopup();
                });
            });

            // After all markers are added, adjust the map zoom and center to fit all markers
            if (bounds.length > 0) {
                const dynamicBounds = L.latLngBounds(bounds);
                map.fitBounds(dynamicBounds); // This will zoom and center the map to show all markers
            }
        })
        .catch(error => console.error("Error fetching town data:", error));
}


// Initial load of towns
loadTowns();

// Reload button event to refresh towns
document.getElementById("reload-button").addEventListener("click", loadTowns);
