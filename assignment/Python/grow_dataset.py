import pandas as pd
import matplotlib.pyplot as plt


#Step 1: Read the dataset
file_path = "GrowLocations.csv"
data = pd.read_csv(file_path)

#Display the first few rows of the dataset
print(data.head())

#Step 2: Filter the data to remove the invalid values
bounding_box= {
    "Longitude Min": -10.592,
    "Longitude Max": 1.6848,
    "Latitude Min": 50.681,
    "Latitude Max": 57.985
    }

#Filtering Data
filtered_data = data[
    (data["Longitude"] >= bounding_box["Longitude Min"]) &
    (data["Longitude"] <= bounding_box["Longitude Max"]) &
    (data["Latitude"] >= bounding_box["Latitude Min"]) &
    (data["Latitude"] <= bounding_box["Latitude Max"])
]

#Display the filtered dataset
print(filtered_data.head())

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

#Step 4 : Plot the Cleaned Data
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
plt.imshow(img, extent=[map_bounds["left"],map_bounds["right"],map_bounds["bottom"],map_bounds["top"]],alpha=0.6)

#Scatter Plot of sensor locations
plt.scatter(
    filtered_data["Longitude"],
    filtered_data["Latitude"],
    c = 'red',
    s = 15,
    label = "Sensor Locations"
)

plt.title("Sensor Locations on UK map",fontsize = 16)
plt.xlabel("Longitude")
plt.ylabel("Latitude")
plt.legend()
plt.show()

