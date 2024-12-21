import pandas as pd
import matplotlib.pyplot as plt


#Step 1: Read the dataset
file_path = "GrowLocations.csv"
data = pd.read_csv(file_path)

#Display the first few rows of the dataset
print(data.head())
print(f"Total rows in original dataset:{len(data)}")
print(data.describe())  # To check the data spread
data["Longitude"] = pd.to_numeric(data["Longitude"], errors="coerce")
data["Latitude"] = pd.to_numeric(data["Latitude"], errors="coerce")
data = data.dropna(subset=["Longitude", "Latitude"])

#Step 2: Filter the data to remove the invalid values
bounding_box= {
    "Longitude Min": -10.592,
    "Longitude Max": 1.6848,
    "Latitude Min": 50.681,
    "Latitude Max": 57.985
    }
print("Bounding Box:")
print(bounding_box)
print("Original Data Longitude Range:")
print(f"Min: {data['Longitude'].min()}, Max: {data['Longitude'].max()}")
print("Original Data Latitude Range:")
print(f"Min: {data['Latitude'].min()}, Max: {data['Latitude'].max()}")
outliers = data[
    (data["Longitude"] < bounding_box["Longitude Min"]) |
    (data["Longitude"] > bounding_box["Longitude Max"]) |
    (data["Latitude"] < bounding_box["Latitude Min"]) |
    (data["Latitude"] > bounding_box["Latitude Max"])
]
print(f"Outliers: {len(outliers)}")
print(outliers.head())

#Filtering Data
filtered_data = data[
    (data["Longitude"] >= bounding_box["Longitude Min"]) &
    (data["Longitude"] <= bounding_box["Longitude Max"]) &
    (data["Latitude"] >= bounding_box["Latitude Min"]) &
    (data["Latitude"] <= bounding_box["Latitude Max"])
]

#Display the filtered dataset
print(filtered_data.head())
print(f"Total rows in original dataset:{len(filtered_data)}")
print(filtered_data.describe())
# Check if the data falls within the UK latitude/longitude range
assert filtered_data["Longitude"].between(-10.592, 1.6848).all()
assert filtered_data["Latitude"].between(50.681, 57.985).all()

#Step 3: Cleaning the data
missing_values = filtered_data.isnull().sum()
if missing_values.empty:
    print("No missing data found.")
else:
    print("Missing rows:")
    print(missing_values)

duplicates = filtered_data.duplicated().sum()
if duplicates == 0:
    print("No duplicated data found.")
else:
    print("Duplicated rows:")
    print(duplicates)

# Check for out-of-bound coordinates
out_of_bounds = filtered_data[
    (filtered_data['Latitude'] < bounding_box["Latitude Min"]) |
    (filtered_data['Latitude'] > bounding_box["Latitude Max"]) |
    (filtered_data['Longitude'] < bounding_box["Longitude Min"]) |
    (filtered_data['Longitude'] > bounding_box["Longitude Max"])
]

# Display any out-of-bounds rows
if out_of_bounds.empty:
    print("No out-of-bounds data found.")
else:
    print("Out-of-bounds rows:")
    print(out_of_bounds)
print(filtered_data[~filtered_data.index.isin(out_of_bounds.index)])

# Step 4 : Plot the Cleaned Data
print("Preparing to plot the data...")
print(f"Number of points to plot: {len(filtered_data)}")
plt.figure(figsize=(10,10))
img = plt.imread("map7.png")

#Define the Map bounds 
map_bounds = {
    "left": bounding_box["Longitude Min"],
    "right": bounding_box["Longitude Max"],
    "bottom": bounding_box["Latitude Min"],
    "top": bounding_box["Latitude Max"]
}

#Display the map
plt.imshow(img, extent=[map_bounds["left"],map_bounds["right"],map_bounds["bottom"],map_bounds["top"]])

#Scatter Plot of sensor locations
plt.scatter(
    filtered_data["Longitude"],
    filtered_data["Latitude"],
    c = 'red',
    s = 10,
    alpha=0.8,
    label = "Sensor Locations"
)

# Add plot details
plt.title("Sensor Locations on UK Map", fontsize=16)
plt.xlabel("Longitude", fontsize=12)
plt.ylabel("Latitude", fontsize=12)
plt.legend()
plt.grid(visible=True, linestyle="--", alpha=0.6)
plt.tight_layout()
plt.show()
print("Plotting complete.")
