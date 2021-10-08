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

# Clean latitude and longitude
# Remove all zeros to set to null
print("Nullifying zero lat/longs")
df.LAT_016.replace(r'^0+$', np.nan, inplace=True, regex=True)
df.LONG_017.replace(r'^0+$', np.nan, inplace=True, regex=True)
null_lat = (df.LAT_016.isna())
df.loc[null_lat, 'LONG_017']=np.nan
null_long = (df.LONG_017.isna())
df.loc[null_long, 'LAT_016']=np.nan

print("Fixing variable leading zero lat/longs")
# Fix entries with variable number of leading zeros
df.LONG_017.replace(r'^-(.*)$', r'\1', inplace=True, regex=True)
df.LONG_017.replace(r'^(.*)\.$', r'\1', inplace=True, regex=True)
df.LAT_016.replace(r'^-(.*)$', r'\1', inplace=True, regex=True)
df.LAT_016.replace(r'^0+(.*)$', r'\1', inplace=True, regex=True)
df.LONG_017.replace(r'^0+(1.*)$', r'\1', inplace=True, regex=True)
df.LONG_017.replace(r'^0{2,}([2|3|4|5|6|7|8|9].*)$', r'\1', inplace=True, regex=True)

df['LAT_016'] = df.LAT_016.str.ljust(8, fillchar='0')
df['LONG_017'] = df.LONG_017.str.ljust(9, fillchar='0')



print("Writing cleaned file to csv...")
df.to_csv('2020AllRecordsDelimitedAllStatesCleaned.csv', na_rep='NULL', index=False)
