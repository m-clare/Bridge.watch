// Plot / menu filter options

const structureTypeOptions = {
  Slab: "1",
  "Tee Beam": "4",
  "Box Beam or Girders": "2,3,5,6",
  Frame: "7",
  Orthotropic: "8",
  Truss: "9,10",
  Arch: "11,12",
  Suspension: "13",
  "Stayed Girder": "14",
  "Movable (Lift, Bascule, or Swing)": "15,16,17",
  "Segmental Box Girder": "21",
  "Channel Beam": "22",
};

const materialOptions = {
  "Reinforced Concrete": "1,2",
  Steel: "3,4",
  "Prestressed or Post-tensioned Concrete": "5,6",
  "Wood or Timber": "7",
  Masonry: "8",
  "Aluminum, Wrought Iron, or Cast Iron": "9",
  Other: "0",
};

const serviceTypeOptions = {
  Highway: "1",
  Railroad: "2",
  "Pedestrian-bicycle": "3",
  "Highway-railroad": "4",
  "Highway-pedestrian": "5",
  "Overpass structure at an interchange": "6",
  "Third level (interchange)": "7",
  "Fourth level (interchange)": "8",
  "Building or plaza": "9",
  Other: "0",
};

const ratingOptions = {
  'Excellent Condition (9)': 9,
  'Very Good Condition (8)': 8,
  'Good Condition (7)': 7,
  'Satisfactory Condition  (6)': 6,
  'Fair Condition (5)': 5,
  'Poor Condition (4)': 4,
  'Serious Condition (3)': 3,
  'Critical Condition (2)': 2,
  'Imminent Failure Condition (1)': 1,
  'Failed Condition (0)': 0
}

export const stateOptions = {
  Alabama: "01",
  Alaska: "02",
  Arizona: "04",
  Arkansas: "05",
  California: "06",
  Colorado: "08",
  Connecticut: "09",
  Delaware: "10",
  "District of Columbia": "11",
  Florida: "12",
  Georgia: "13",
  Hawaii: "15",
  Idaho: "16",
  Illinois: "17",
  Indiana: "18",
  Iowa: "19",
  Kansas: "20",
  Kentucky: "21",
  Louisiana: "22",
  Maine: "23",
  Maryland: "24",
  Massachusetts: "25",
  Michigan: "26",
  Minnesota: "27",
  Mississippi: "28",
  Missouri: "29",
  Montana: "30",
  Nebraska: "31",
  Nevada: "32",
  "New Hampshire": "33",
  "New Jersey": "34",
  "New Mexico": "35",
  "New York": "36",
  "North Carolina": "37",
  "North Dakota": "38",
  Ohio: "39",
  Oklahoma: "40",
  Oregon: "41",
  Pennsylvania: "42",
  "Rhode Island": "44",
  "South Carolina": "45",
  "South Dakota": "46",
  Tennessee: "47",
  Texas: "48",
  Utah: "49",
  Vermont: "50",
  Virginia: "51",
  Washington: "53",
  "West Virginia": "54",
  Wisconsin: "55",
  Wyoming: "56",
  "Puerto Rico": "72",
  Guam: "66",
  "Virgin Islands": "78",
};

export const plotOptions = {
  percent_poor: {
    query: "rating",
    display: "Percent in poor condition",
    histogram: "Rating",
  },
  rating: { query: "rating", display: "Overall rating", histogram: "Rating" },
  year_built: {
    query: "year_built",
    display: "Year built",
    histogram: "Year built",
  },
  repair_cost_per_foot: {
    query: "repair_cost_per_foot",
    display: "Estimated repair cost per foot of bridge (in $1000s)",
    histogram: "Repair $1000s / ft bridge",
  },
};

export const fieldOptions = {
  material: {
    query: "material",
    display: "Group by material",
  },
  type: {
    query: "bridge_type",
    display: "Group by bridge type",
  },
  state: {
    query: "state",
    display: "Group by state",
  }
}

export const detailedOptions = {

}

const otherOptions = {
  repair_cost_per_foot: {
    query: "repair_cost_per_foot",
    display: "Estimated repair cost per foot of bridge (in $1000s)",
    histogram: "Repair $1000s / ft bridge",
  },
}

export const singleFilters = {
  plot_type: {
    'name': 'plot_type',
    'label': 'Plot Type',
    'options': plotOptions
  },
  field: {
    'name': 'field',
    'label': 'Field',
    'options': fieldOptions
  }
}

export const multiFilters = {
  material: {
    name: "material",
    label: "Bridge Material",
    options: materialOptions,
  },
  type: { name: "type", label: "Bridge Type", options: structureTypeOptions },
  service: {
    name: "service",
    label: "Service Type",
    options: serviceTypeOptions,
  },
  state: {
    name: "state",
    label: "State(s)",
    options: stateOptions,
  },
};
