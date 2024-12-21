import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
from shapely.geometry import Point

# Load the Growlocations.csv dataset
data_file = 'Growlocations.csv'  # Replace with your file path
data = pd.read_csv(data_file)

# Inspect the column names and data
data.columns = ['Latitude', 'Longitude']  # Rename columns to standard names

# Filter out rows with invalid latitude and longitude values
# Valid bounds: Longitude (-10.592 to 1.6848), Latitude (50.681 to 57.985)
data = data[(data['Longitude'] >= -10.592) & (data['Longitude'] <= 1.6848) &
            (data['Latitude'] >= 50.681) & (data['Latitude'] <= 57.985)]

# Convert to GeoDataFrame for spatial plotting
data['Coordinates'] = data.apply(lambda row: Point(row['Longitude'], row['Latitude']), axis=1)
gdf = gpd.GeoDataFrame(data, geometry='Coordinates')

# Load the map of the UK (using OpenStreetMap)
uk_map = gpd.read_file("https://download.geofabrik.de/europe/great-britain-latest-free.shp.zip")

# Plot the map and sensor locations
fig, ax = plt.subplots(figsize=(10, 10))
uk_map.plot(ax=ax, color='lightgrey')
gdf.plot(ax=ax, color='blue', markersize=10)

# Add title and labels
ax.set_title("Plotting Grow data", fontsize=15)
plt.xlabel("Longitude")
plt.ylabel("Latitude")

# Show the plot
plt.show()
