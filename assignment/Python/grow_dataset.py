import pandas as pd
import matplotlib.pyplot as plt
#Step 1: Read the dataset
file_path = "GrowLocations.csv"
df = pd.read_csv(file_path)

#Display the first few rows of the dataset
print(df.head())