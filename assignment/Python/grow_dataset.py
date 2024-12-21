import pandas as pd
import matplotlib.pyplot as plt
import geopandas as gpd
from shapely.geometry import Point,box

#Step 1: Read the dataset
file_path = "GrowLocations.csv"
data = pd.read_csv(file_path)

# Display the first few rows of the dataset and basic info
print("First 5 rows of the dataset:")
print(data.head())
print(f"Total rows in the original dataset: {len(data)}")


# Step 2: Convert the data to a GeoDataFrame
# Create a 'geometry' column from Longitude and Latitude
geometry = [Point(xy) for xy in zip(data["Longitude"], data["Latitude"])]
gdf = gpd.GeoDataFrame(data, geometry=geometry, crs="EPSG:4326")  # WGS 84 CRS
# Step 3: Define the UK bounding box and filter points
bounding_box = box(-10.592, 50.681, 1.6848, 57.985)  # (minx, miny, maxx, maxy)
uk_boundary = gpd.GeoDataFrame({"geometry": [bounding_box]}, crs="EPSG:4326")

# Filter the points within the bounding box
filtered_gdf = gdf[gdf.geometry.within(bounding_box)]

# Display the filtered dataset summary
print("\nFiltered Data (First 5 rows):")
print(filtered_gdf.head())
print(f"Total rows in filtered dataset: {len(filtered_gdf)}")

# Step 4: Plot the cleaned data
print("\nPreparing to plot the data...")
# Load the UK map image (static image)
map_image_path = "map7.png"  # Ensure this image exists
img = plt.imread(map_image_path)

# Plot the map with sensor locations
fig, ax = plt.subplots(figsize=(12, 8))

# Set map bounds for the image
ax.imshow(img, extent=[-10.592, 1.6848, 50.681, 57.985], alpha=0.5)

# Plot the sensor locations
filtered_gdf.plot(ax=ax, color="red", markersize=10, label="Sensor Locations")

# Add plot details
plt.title("Sensor Locations on UK Map", fontsize=16)
plt.xlabel("Longitude", fontsize=12)
plt.ylabel("Latitude", fontsize=12)
plt.legend()
plt.grid(visible=True, linestyle="--", alpha=0.6)
plt.tight_layout()
plt.show()

print("\nPlotting complete.")