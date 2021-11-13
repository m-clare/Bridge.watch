export const bridgeTypes = [
  {
    type: "girder bridge",
    img: "/assets/images/bridgeTypes/Coronado_Bridge.jpg",
    attrLink:
      "https://upload.wikimedia.org/wikipedia/commons/b/b5/Coronado_Bridge_1.jpg",
    attrAuthor: "Nehrams2020",
    attrLicense: "CC BY-SA",
    attrLicenseLink: "https://creativecommons.org/licenses/by-sa/3.0/deed",
    materialOptions: ["steel", "concrete", "timber"],
    description:
      "Simplest and brute force method to span over a waterway or obstacle, but most inefficient use of material, and only short spans between supporting points possible",
    exampleName: "Coronado Bridge",
    exampleLocation: "San Diego, CA",
    exampleStructuralEngineer: "California Department of Public Works (Jacob Dekema)",
    constructionImg:
      "/assets/images/bridgeTypes/Coronado_Bridge_Construction.jpg",
    cImgAttrLink:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/San_Diego-Coronado_Bridge_Construction%2C_Final_Lift_%28C2711_1_700%29.jpg/640px-San_Diego-Coronado_Bridge_Construction%2C_Final_Lift_%28C2711_1_700%29.jpg",
    cImgAttrAuthor: "Caltrans",
    cImgAttrLicense: "Public Domain",
  },
  {
    type: "truss bridge",
    img: "/assets/images/bridgeTypes/Huey_P_Long_Bridge.jpg",
    attrLink:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/USS_New_Orleans_under_Huey_P_Long_Bridge.jpg/800px-USS_New_Orleans_under_Huey_P_Long_Bridge.jpg",
    attrAuthor: "Shawn Graham",
    attrLicense: "CC BY-SA",
    attrLicenseLink: "https://creativecommons.org/licenses/by-sa/3.0/deed",
    materialOptions: ["steel", "wood"],
    description:
      'Similar in concept to a girder bridge but more efficient use of material; thus longer spans are possible. Boat vertical clearance is improved with truss bridges since the trusses are typically placed above the roadway (a "thru" truss rather than a "deck" truss).',
    exampleName: "Huey P. Long Bridge",
    exampleLocation: "New Orleans, LA",
    exampleStructuralEngineer: "Modjeski & Masters",
    constructionImg:
      "/assets/images/bridgeTypes/Huey_P_Long_Bridge_Construction.jpg",
    cImgAttrLink:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Cantilever_Construction_of_Huey_P._Long_Bridge_1935.jpg/800px-Cantilever_Construction_of_Huey_P._Long_Bridge_1935.jpg",
    cImgAttrAuthor: "HAER LA-17-166",
    cImgAttrLicense: "NPS",
  },
  {
    type: "arch bridge",
    materialOptions: ["concrete", "steel"],
    img: "/assets/images/bridgeTypes/Lilac_Road_Bridge.jpg",
    attrLink:
      "https://upload.wikimedia.org/wikipedia/commons/2/22/Lilac_Road_Bridge.JPG",
    attrAuthor: "UberMitch",
    attrLicense: "CC BY-SA",
    attrLicenseLink: "https://creativecommons.org/licenses/by-sa/3.0/",
    description:
      "The arch shape results in primarily compression forces, making concrete the ideal material for this type of bridge, though steel is also possible. Arch bridges have been around for millenia, but they are inefficient to build due to the falsework/scaffolding and abutment requirements (see sample construction photo below). Boat clearance is also limited due to the arch obstruction, and spans are limited due to the inherent weakness of a slender compression arch relative to other bridge types that utilize high-strength steel cables in tension for the primary members.",
    exampleName: "Lilac Road Bridge",
    exampleLocation: "San Diego, CA",
    exampleStructuralEngineer: "Caltrans",
    constructionImg:
      "/assets/images/bridgeTypes/Grafton_Bridge_Construction.jpg",
    cImgAttrLink:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Grafton_bridge_during_construction_%28before_1909%29_01.jpg/800px-Grafton_bridge_during_construction_%28before_1909%29_01.jpg",
    cImgAttrAuthor: "W. Beattie",
    cImgAttrLicense: "Public Domain",
  },
  {
    type: "network arch bridge",
    materialOptions: ["concrete", "steel"],
    img: "/assets/images/bridgeTypes/West_7th_Street_Bridge.jpg",
    attrLink:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Dusk_view_of_a_portion_of_the_Fort_Worth%2C_Texas%2C_skyline%2C_taken_from_the_new_Seventh_Street_Bridge%2C_a_2013_replacement_for_a_long-standing_bridge_over_the_Trinity_River_LCCN2014632986.tif/lossy-page1-800px-thumbnail.tif.jpg",
    attrAuthor: "C. M. Highsmith",
    attrLicense: "LC",
    description:
      "Network arches utilize concrete for the primary arch (though steel is an option as well) along with secondary steel cables, Concrete is strong in compression, and steel cables are strong in tension leading to an efficient use of materials and final shape. This overcomes most of the construction and clearance issues associated with a standard concrete arch bridge. Spans are still limited due to the inherent weakness of a slender compression arch relative to other bridges types.",
    exampleName: "West 7th Street Bridge",
    exampleLocation: "Fort Worth, TX",
    exampleStructuralEngineer: "Texas Department of Transportation",
    constructionImg:
      "/assets/images/bridgeTypes/6th_Street_Viaduct_Construction.jpg",
    cImgAttrLink: "",
    cImgAttrAuthor: "M.Wachter",
    cImgAttrLicense: "CC BY-SA",
    cImgAttrLicenseLink: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  {
    type: "segmental box girder ",
    materialOptions: ["concrete"],
    img: "/assets/images/bridgeTypes/West_Seattle_Bridge.jpg",
    attrLink: "",
    attrAuthor: "M. Wachter",
    attrLicense: "CC BY-SA",
    attrLicenseLink: "https://creativecommons.org/licenses/by-sa/3.0/deed",
    description:
      "Segmental box girders are strong enough to be cantilevered (unsupported on one side) during construction. Box girders may or may not be arched. No abutments or extensive falsework is needed for this bridge type, since it is self-supporting. Box girders have the same boat clearance issues as a standard girder or arch bridge, since the roadway is on top of the structure. Spans are still limited compared to other bridge types that utilize high-strength steel cables in tension for the primary members",
    exampleName: "West Seattle Bridge",
    exampleLocation: "Seattle, WA",
    exampleStructuralEngineer: "Contech Consultants, Inc.",
    constructionImg:
      "/assets/images/bridgeTypes/West_Seattle_Bridge_Construction.jpg",
    cImgAttrLink:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/West_Seattle_Bridge_under_construction%2C_circa_1983.jpg/640px-West_Seattle_Bridge_under_construction%2C_circa_1983.jpg",
    cImgAttrAuthor: "Seattle Municipal Archives",
    cImgAttrLicense: "CC BY",
    cImgAttrLicenseLink: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    type: "cable-stayed bridge",
    materialOptions: ["steel", "concrete"],
    img: "/assets/images/bridgeTypes/Tilikum_Crossing.jpg",
    attrLink:
      "https://upload.wikimedia.org/wikipedia/commons/b/b5/Coronado_Bridge_1.jpg",
    attrAuthor: "Nehrams2020",
    attrLicense: "CC BY-SA",
    attrLicenseLink: "https://creativecommons.org/licenses/by-sa/3.0/deed",
    attribution:
      '<a href="https://upload.wikimedia.org/wikipedia/commons/b/b5/Coronado_Bridge_1.jpg>Photo</a> by Nehrams2020 / <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.fi">CC BY-SA</a>',
    description:
      "Cable-stayed bridges are efficient due to their use of steel cables in tension with a concrete deck in compression. The bridge towers may be steel or concrete. No abutments or extensive falsework are needed since the structure is self-supporting during construction. Very long spans are possible, and this is a popular choice for modern iconic bridges.",
    exampleName: "Tilikum Crossing",
    exampleLocation: "Portland, OR",
    exampleStructuralEngineer: "TY Lin International",
    constructionImg:
      "/assets/images/bridgeTypes/Tilikum_Crossing_Construction.jpg",
    cImgAttrLink:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Partially_completed_Portland-Milwaukie_Light_Rail_Bridge_on_28_Dec_2013.jpg/640px-Partially_completed_Portland-Milwaukie_Light_Rail_Bridge_on_28_Dec_2013.jpg",
    cImgAttrAuthor: "Lexandalf",
    cImgAttrLicense: "CC BY-SA",
    cImgAttrLicenseLink: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  {
    type: "suspension bridge",
    materialOptions: ["steel"],
    img: "/assets/images/bridgeTypes/Verrazano_Narrows_Bridge.jpg",
    attrLink:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Verrazano_-_Narrows_Bridge2.jpg",
    attrAuthor: "Joe Mazzola",
    attrLicense: "CC BY-SA",
    attrLicenseLink: "https://creativecommons.org/licenses/by-sa/2.0/deed",
    description:
      "Suspension bridges are the ideal choice for ultra-long spans. Large abutments are required, and the structure is not self-supporting during construction as shown below. Lack of redundancy in the main cables is another drawback.",
    exampleName: "Verrazano Narrows Bridge",
    exampleLocation: "New York, NY",
    exampleStructuralEngineer: "Amman and Whitney",
    constructionImg:
      "/assets/images/bridgeTypes/Verrazano_Narrows_Bridge_Construction.jpg",
    cImgAttrLink:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Verrazano-Narrows_Bridge-_The_Beginning_%2815715906681%29.jpg/640px-Verrazano-Narrows_Bridge-_The_Beginning_%2815715906681%29.jpg",
    cImgAttrAuthor: "MTA of State of NY",
    cImgAttrLicense: "CC BY",
    cImgAttrLicenseLink: "https://creativecommons.org/licenses/by/2.0/",
  },
];
