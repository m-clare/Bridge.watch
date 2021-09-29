import pandas as pd
import numpy as np

df = pd.read_csv('2020AllRecordsDelimitedAllStates.csv', dtype=str)

columns = df.columns.values.tolist()

print("Removing leading and lagging whitespace...")
for column in columns:
    # remove leading and lagging whitespace
    print(column)
    df[column]=df[column].str.strip()

print("Removing generic whitespace...")
# remove all whitespace and change to NaN temporarily
df = df.replace(r'^\s+$', np.nan, regex=True)
df = df.replace(r'^_$', np.nan, regex=True)
df = df.replace('', np.nan)



print("Writing cleaned file to csv...")
df.to_csv('2020AllRecordsDelimitedAllStatesCleaned.csv', na_rep='NULL')
