// Plot / menu filter options

const structureTypeOptions = {
  "Slab": "1",
  "Tee Beam": "4",
  "Box Beam or Girders": "2,3,5,6",
  "Frame": "7",
  "Orthotropic": "8",
  "Truss": "9,10",
  "Arch": "11,12",
  "Suspension": "13",
  "Stayed Girder": "14",
  "Movable (Lift, Bascule, or Swing)": "15,16,17",
  "Segmental Box Girder": "21",
  "Channel Beam": "22"
};

const materialOptions = {
  "Reinforced Concrete": "1,2",
  "Steel": "3,4",
  "Prestressed or Post-tensioned Concrete": "5,6",
  "Wood or Timber": "7",
  "Masonry": "8",
  "Aluminum, Wrought Iron, or Cast Iron": "9",
  "Other": "0",
}

const serviceTypeOptions = {
  "Highway": "1",
  "Railroad": "2",
  "Pedestrian-bicycle": "3",
  "Highway-railroad": "4",
  "Highway-pedestrian": "5",
  "Overpass structure at an interchange": "6",
  "Third level (interchange)": "7",
  "Fourth level (interchange)": "8",
  "Building or plaza": "9",
  "Other": "0"
}

export const plotOptions = {
  'percent_poor': {'query': 'rating', 'display': 'Percent in poor condition'},
  'rating': {'query': 'rating', 'display': 'Overall rating'},
  'year_built': {'query': 'year_built', 'display': 'Year built'}
}

export const filters = {
  'material': { name: "material", label: "Bridge Material", options: materialOptions },
  'type': { name: "type", label: "Bridge Type", options: structureTypeOptions },
  'service': { name: "service", label: "Service Type", options: serviceTypeOptions },
};

