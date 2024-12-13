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

#Display the cleaned dataset
print(filtered_data.head())