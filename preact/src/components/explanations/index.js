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


export const bridgeMaterials = [
  {
    'material': "Steel",
    img: "/assets/images/bridgeMaterials/steel.jpg",
    attrLink: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Portland_oregon_steel_bridge_panorama.jpg",
    attrAuthor: "Matthew Field",
    attrLicense: "GNU",
    attrLicenseLink: "https://en.wikipedia.org/wiki/en:GNU_Free_Documentation_License",
    shortDescription: `Steel is iron mixed with carbon. If the carbon content of the steel very low, then it is relatively weak but very ductile, which means it can be more easily formed/forged into architectural shapes. Steel with a very low carbon content is called wrought iron, whereas steel with a very high carbon content is called
cast iron. Cast iron is too brittle to develop significant strength, but it is \"castable\" because it has a low melting point. The \"Goldilocks\" for steel bridges is medium carbon content. Steel with a medium carbon content is strong (30,000psi+ in tension or compression) while remaining ductile (can be stretched 10+% before fracturing). This means that a steel bridge can usually absorb loads from earthquakes or other extreme hazards without unsafe/unsightly structural damage.`,
    paragraph1: `The most significant disadvantage of steel is its susceptibility to corrosion. That susceptibility can be mitigated by mixing chromium in with the iron and carbon – i.e. \“stainless\” steel. Since that is a very expensive solution, for bridges it is more common to use zinc plating/galvanizing or paint to reduce the risk of corrosion. Another disadvantage of steel is that it is susceptible to a phenomenon called \“ductile-to-brittle transition temperature\" As the name suggests, certain ductile steels, under particular
temperature conditions, can become brittle.`,
    paragraph2: `Compared to concrete, steel has a high material strength-to-weight ratio. Generally this is a big
advantage since it means that the steel members constituting the structural skeleton of a bridge can
theoretically be made very slender (and therefore economical) without the material exceeding its
strength. However, steel members (e.g. beams, columns) are sometimes so slender that they will
undergo \“elastic buckling\” under an extreme enough load, which means that the member essentially
fails in a brittle manner even though the material is ductile. Since concrete and wood structural
members are typically required to be quite stocky (owing to their relatively low strength-to-weight
ratios), \“buckling\” is not typically a major consideration for concrete or wood structures.`,
    bImg: "/assets/images/bridgeMaterials/steel_corrosion.png",
    bLink: "",
    bAuthor: "A. Freidenberg",
    bLicense: "CC BY-SA",
    bLicenseLink: "https://creativecommons.org/licenses/by-sa/3.0/deed",
  },
  {'material': "Reinforced Concrete",
    img: "/assets/images/bridgeMaterials/concrete.jpg",
   attrLink: "https://upload.wikimedia.org/wikipedia/commons/5/5c/7mi_bridge_pano.jpg",
   attrAuthor: "Daniel Schwen",
    attrLicense: "CC BY-SA",
   attrLicenseLink:  "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
   shortDescription: `While concrete is relatively weak (less than 15,000 psi in compression and less than 1,000 psi in tension) and relatively brittle (will fracture under less than 1% stretching or shortening), it is the most versatile of all structural materials. Since concrete is cement, water, and aggregate that is mixed into a slurry, it can be formed into any shape. The viscosity of the slurry can be varied; higher viscosity reduces loads on temporary formwork while the concrete hardens (“cures”), while low viscosity allows the concrete to be more easily pumped to higher elevations or to more easily fill (“consolidation”) structural members with unusually high/congested steel rebar. Another advantage of concrete is that it becomes stronger over time, in contrast to wood.`,
   paragraph1: `Since concrete is particularly weak in tension, all structural concrete (i.e. beams, columns, walls, slabs) contains reinforcing steel bars (“rebar”) inside. This “reinforced concrete” allows concrete beams to “bend” without immediately fracturing – i.e. dramatically improving the strength and ductility of the concrete members. In fact, “concrete” is typically used interchangeably with “reinforced concrete” when discussing concrete bridges. While reinforced concrete members have a lower strength-to-weight ratio than structural steel members, reinforced concrete is often favored due to superior corrosion protection (although still not “corrosion-proof” since moisture can still eventually seep through the concrete and reach the steel rebar).`,
   paragraph2: `A disadvantage of concrete is that under sustained load, concrete deforms (“creeps”) throughout its life, which is not typically a consideration for steel or wood.  Furthermore, since concrete is so brittle (even compared to wood), concrete also has a tendency to crack simply due to drying shrinkage.  Lastly, concrete surfaces are susceptible to salt deposit growth called efflorescence. `,
    bImg: "/assets/images/bridgeMaterials/concrete_efflorescence-shrinkage.png",
    bLink: "",
    bAuthor: "A. Freidenberg",
    bLicense: "CC BY-SA",
    bLicenseLink: "https://creativecommons.org/licenses/by-sa/3.0/deed",
  },
  {'material': "Prestressed Concrete",
   img: "/assets/images/bridgeMaterials/prestressed-concrete.jpg",
   attrLink: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Acero_postesado.jpg",
   attrAuthor: "Niplos",
   attrLicense: "Public Domain",
   shortDescription: `Prestressed concrete utilizes high strength steel tendons that are either tensioned prior to concrete being poured and allowed to set and bond to the steel before cutting the ends (pre-tensioned), or tensioned by a jack after the concrete has already cured where a duct is installed so that the concrete is unbonded to the prestressing tendons (post-tensioned). This methodology provide an initial compressive force to counteract tension caused by the self weight of the concrete (since concrete is weak in tension). Members utilizing the principle of prestressing are typically more slender than those utilizing traditional reinforcing. Prestressed concrete has similar disadvantages to reinforced concrete`,
  },
   {'material': "Timber",
    img: "/assets/images/bridgeMaterials/timber.jpg",
   attrLink: "https://upload.wikimedia.org/wikipedia/commons/5/56/Eagle_River_Timber_Bridge.JPG",
   attrAuthor: "Chris857",
    attrLicense: "CC BY-SA",
   attrLicenseLink:  "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
   shortDescription: `Wood’s desirability as a structural material is its sustainability and cost.  It is also versatile, since it can be used in sawn (monolithic) form (e.g. typical 2x4, 4x4, etc.), or can be used in laminated form (e.g. plywood sheathing, glue-laminated “glulam” beams, etc.) for better a quality control/stronger product as well as curved structural shapes.  The most commonly used structural wood materials in the U.S., which depends on geographic region, are Douglas Fir and Southern Yellow Pine. `,
   paragraph1: `Wood's disadvantages include that it is anisotropic in nature. It is significantly weaker in tension perpendicular to the grain than parallel to the grain. Typical sawn wood members have obvious structural defects such as knots and checks. The strength of the wood member is partly a function of these knots and checks, which are determining by a subjective visual “grading” process. Timber is relatively weak (less than 10,000 psi in compression or tension) and gets weaker over time, and it is also relatively brittle. It is highly susceptible to shrinkage changes in moisture (e.g. changes to humidity/weather) that lead to warping. Old-growth wood, which was commonly available in the U.S. until the mid-20th century, was less prone to shrinkage as well as being stronger than modern wood. It's also susceptible to environmental factors, such as mildew, fungal decay, rot, and termites. 
`,
    paragraph2: ``,
    bImg: "/assets/images/bridgeMaterials/wood_decay.png",
    bLink: "",
    bAuthor: "A. Freidenberg",
    bLicense: "CC BY-SA",
    bLicenseLink: "https://creativecommons.org/licenses/by-sa/3.0/deed",
  },
  {'material': "Aluminum",
   shortDescription: `Aluminum is advantageous because it is strong (30,000psi+ in tension or compression) and ductile (can be stretched 10+% before fracturing). Aluminum’s low density (very high strength-to-weight ratio) gives it an edge over steel. In addition, aluminum is not susceptible to ductile-to-brittle transition temperature effects, nor corrosion.  However, cost typically precludes the use of aluminum for bridges. Another disadvantage of aluminum is that it is particularly susceptible to fatigue (aluminum bridges weaken over their lifespan).`,
   paragraph1: ``,
   paragraph2: ``,
   bImg: "/assets/images/bridgeMaterials/aluminum_fatigue.png",
   bLink: "",
   bAuthor: "A. Freidenberg",
   bLicense: "CC BY-SA",
   bLicenseLink: "https://creativecommons.org/licenses/by-sa/3.0/deed",
  },
];
