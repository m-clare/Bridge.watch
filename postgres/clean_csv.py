import pandas as pd
import numpy as np

df = pd.read_csv("2020AllRecordsDelimitedAllStates.csv", dtype=str)
# df = pd.read_csv("2020BadLatLong.csv", dtype=str)
print("Removing leading and lagging whitespace...")
columns = df.columns.values.tolist()
for column in columns:
    # remove leading and lagging whitespace
    print(column)
    df[column] = df[column].str.strip()

print("Removing generic whitespace...")
# remove all whitespace and change to NaN temporarily
df = df.replace(r"^\s+$", np.nan, regex=True)
df = df.replace(r"^_$", np.nan, regex=True)
df = df.replace("", np.nan)

# Clean latitude and longitude
# Remove all zeros to set to null
print("Nullifying zero lat/longs")
df.LAT_016.replace(r"^0+$", np.nan, inplace=True, regex=True)
df.LONG_017.replace(r"^0+$", np.nan, inplace=True, regex=True)
df.LAT_016.replace(r"^9+$", np.nan, inplace=True, regex=True)
df.LONG_017.replace(r"^9+$", np.nan, inplace=True, regex=True)
df.LAT_016.replace(r"^10{7}", np.nan, inplace=True, regex=True)
null_lat = df.LAT_016.isna()
df.loc[null_lat, "LONG_017"] = np.nan
null_long = df.LONG_017.isna()
df.loc[null_long, "LAT_016"] = np.nan

print("Fixing variable leading zero lat/longs")
# Fix entries with variable number of leading zeros
df.LONG_017.replace(r"^-(.*)$", r"\1", inplace=True, regex=True)
df.LONG_017.replace(r"^(.*)\.$", r"\1", inplace=True, regex=True)
df.LAT_016.replace(r"^-(.*)$", r"\1", inplace=True, regex=True)
df.LAT_016.replace(r"^0+(.*)$", r"\1", inplace=True, regex=True)
df.LONG_017.replace(r"^0+(1.*)$", r"\1", inplace=True, regex=True)
df.LONG_017.replace(
    r"^(0)0+([2|3|4|5|6|7|8|9].*)$", r"\1" + r"\2", inplace=True, regex=True
)
df.LAT_016.replace(r"(\d*)\.+(\d)*", r"\1" + r"\2", inplace=True, regex=True)
df.LONG_017.replace(r"(\d{2})\.+(\d*)", "0" + r"\1" + r"\2", inplace=True, regex=True)
df.LAT_016.replace(r"(\d{2})\.+(\d*)", "0" + r"\1" + r"\2", inplace=True, regex=True)
df.LONG_017.replace(r"(\d*)\.+(\d{1})", r"\1" + r"\2", inplace=True, regex=True)
df.LAT_016.replace(r"(\d*)\.+(\d{1})", r"\1" + r"\2", inplace=True, regex=True)

df.loc[(~null_lat), "LAT_016"] = df.loc[~null_lat, "LAT_016"].str.ljust(8, fillchar="0")
df.loc[(~null_long), "LONG_017"] = df.loc[~null_long, "LONG_017"].str.ljust(
    9, fillchar="0"
)

# Convert latitude and longitude from DMS to Decimal
print("converting DMS to decimal")
def convert_DMS_to_decimal(DMS, type):
    """
    Converts from latitude/longitude degrees, minutes, seconds to decimal
    with 5 digits of precision
    """
    # Convert object to string...
    if pd.isna(DMS):
        return np.nan
    else:
        DMS = str(DMS)
        if type == "latitude":
            degrees = int(DMS[:2])
        elif type == "longitude":
            degrees = int(DMS[:3])
        else:
            raise ValueError("Latitude and longitude are only acceptable values.")
        seconds = int(DMS[-4:]) / 100.0
        minutes = int(DMS[-6:-4])
        frac_min = minutes / 60.0
        frac_sec = seconds / 3600.0
        return str("{0:.5f}".format(degrees + frac_min + frac_sec))

df.LAT_016 = df.LAT_016.apply(convert_DMS_to_decimal, type="latitude")
df.LONG_017 = df.LONG_017.apply(convert_DMS_to_decimal, type="longitude")

#Fix longitude sign for states/territories other than Guam and North Marianas Islands
eastern_hemisphere = (df.STATE_CODE_001 == "69") | (df.STATE_CODE_001 == "66")

df.loc[(~eastern_hemisphere), "LONG_017"] = "-" + df.loc[~eastern_hemisphere, "LONG_017"] 

# remove lat/long for terrible set of Maryland data
# lat = 38, 39, 40, long = -70
print("Writing cleaned file to csv...")
df.to_csv("2020AllRecordsDelimitedAllStatesClean.csv", na_rep="NULL", index=False)
# df.to_csv("BadCleaned.csv", na_rep="NULL", index=False)
