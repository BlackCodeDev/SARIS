var multiplication_factor_unit = [{
                                    gridSysten: "A",factor:2,
                                  },
                                  {
                                    gridSysten: "B",factor:1.5,
                                  },
                                  {
                                    gridSysten: "C",factor:1.2,
                                  },
                                  {
                                    gridSysten: "C",factor:1.2,
                                  },
                                  {
                                    gridSysten: "D",factor:1,
                                  },
                                  {
                                    gridSysten: "E",factor:0.86,
                                  },
                                  {
                                    gridSysten: "F",factor:0.75,
                                  },
                                  {
                                    gridSysten: "G",factor:0.67,
                                  },
                                  {
                                    gridSysten: "H",factor:0.6,
                                  },
                                  {
                                    gridSysten: "I",factor:0.55,
                                  },
                                  {
                                    gridSysten: "J",factor:0.5,
                                  }
                                 ];

var search_factor_ds = [[1,0.27, 'I','11',],
                        [2,0.33, 'G','9'],
                        [3,0.43, 'E','7'],
                        [4,0.5,'J','12'],
                        [5,0.60,'H','10'],
                        [6,0.75,'F','8'],
                        [7,0.82,'I','11'],
                        [8,1,'J','12'],
                        [9,1.20,'H','10'],
                        [10,1.29,'E','7'],
                        [11,1.36,'I','11'],
                        [12,1.50,'J','12'],
                        [13,1.67,'G','9'],
                        [14,1.8,'G','10,5'],
                        [15,1.91,'I','11'],
                        [16,2,'J','12'],
                        [17,2.14,'E','7'],
                        [18,2.25,'F','8'],
                        [19,2.33,'G','9'],
                        [20,2.40,'H','10'],
                        [20,2.45,'I','11'],
                        [21,2.5,'J','12'],
                       ];

var vessel_position_devices_ds=[
                                [1,'0', 'Uknown'],
                                [2,'0.1', 'GPS'],
                                [3,'1', 'RADAR'],
                                [4,'1','Visual fix'],
                                [5,'2','Celestial fix'],
                                [6,'4','Marine radio beacon'],
                                [7,'1','LORAN C'],
                                [8,'0.5','INS'],
                                [9,'0.5','VOR'],
                                [10,'0.5','TACAN']
                              ];

 var vessel_types_ds=[
                        [1,'5', '0.05','Ship'],
                        [2,'15','0.15','Boat'],
                        [3,'15','0.15','Submersible'],
                        [4,'5', '0.05','Submarine'],
                        [5,'15','0.15','Single-engine aircraft'],
                        [6,'10','0.10','Twin-engine aircraft'],
                        [7,'5', 0.05, 'Aircraft with more than two engines']                        
                    ];
var vessel_sub_types_ds=[   [1,'RAFT','LifeRaft/Survival Raft (No ballast, no Canopy, no    Drogue)',25,0.25,"NO_BALLAST_NO_CANOPY"], //OK
                            [2,'RAFT','LifeRaft/Survival Raft (No ballast, Canopy Uknown, Drogue Uknown)',30,0.35,"NO_BALLAST_CANOPY_UKNOWN"], //OK
                            [3,'RAFT','LifeRaft/Survival Raft (No ballast, with Canopy and Drogue)',30,0.35,"NO_BALLAST"], //OK                     
                            [4,'RAFT','LifeRaft/Survival Raft (Shallow ballast, with Drogue)',20,0.1,"SHALLOW_BALAST_WITH_DROGUE"],  //OK
                            [5,'RAFT','LifeRaft/Survival Raft (Shallow ballast, without Drogue)',20,0.1,"SHALLOW_BALAST"], //OK
                            [6,'RAFT','LifeRaft/Survival Raft (Shallow ballast, uknown Drogue)',20,0.35,"SHALLOW_BALAST"],//OK
                            [7,'RAFT','LifeRaft/Survival Raft (Shallow Ballast (Capsized))',10,0.1,"SHALLOW_BALAST_CAPSIZED"],//OK
                            [8,'RAFT','LifeRaft/Survival Raft (Deep Ballast)',15,0.2,"DEEP_BALAST"], //OK
                            [9,'RAFT','LifeRaft/Survival Raft (Deep Ballast Capsized/Swamped)',10,0.1,"DEEP_BALAST_CAMPSIZED_SWAMPED"], //OK
                            [10,'RAFT','LifeRaft/Survival Raft (Aviation 4-6 persons)',25,0.1,"AVIATION_4_6_PERSONS"], //OK
                            [11,'RAFT','LifeRaft/Survival Raft (Aviation 46 persons)',15,0.1,"AVIATION_46_PERSONS"],//OK
                            [12,'RAFT','Lifecapsule',20,0.1,"LIFECAPSULE_FULL_ENCLOSED"], //OK
                            [13,'PIW','Person in Water',30,0.35,"PERSON_IN_WATER"], //OK
                            [37,'PIW','Person in Water (Survival Suit)',30,0.1,"PERSON_IN_WATER_SUIT"], //OK
                            [14,'RAFT','Searescue Kit',5,0.1,"SEA_RESCUE_KIT"], //0K
                            [15,'POWER_BOAT',"Sport Boats",20,0.1,"SPORT_BOATS"], //OK
                            [16,'RAFT','Raft (Two inner tubes with frame) with sail',35,0.15,"RAFT_WITH_SAIL"], //OK
                            [17,'RAFT','Raft (Two inner tubes with frame) no sail',15,0.1,"RAFT_WITH_NO_SAIL_SURF_DEBRIS_BALT"], //OK
                            [19,'POWER_BOAT',"Sport Fisher",20,0.1,"SPORT_FISHER"], //OK
                            [20,'SHIP',"Commercial Fishing-Trollers/Samparis/Longliners",50,0.25,"COMMERCIAL_FISHING_SAILING"], //OK
                            [21,'SHIP',"Commercial Fishing-Netters",35,0.1,"COMMERCIAL_FISHING_SAILING"],  //OK
                            [22,'POWER_BOAT',"Commercial Fishing-Uknown Type",50,0.35,"COMMERCIAL_FISHING_SAILING"],  //OK
                            [23,'SAILING',"Sailing Vessel with fin keel, shoal draft Fishing -Uknown Type",50,0.25,"COMMERCIAL_FISHING_SAILING"],  //OK
                            [24,'SAILING',"Sailing Vessel full keel deep draft",50,0.25,"COASTAL_SAIL_KEEL_DRAFT"], //OK
                            [25,'POWER_BOAT',"Skiff Flat Bottom",20,0.1,"SKIFF"], //OK
                            [26,'POWER_BOAT',"Skiff V-Hull",15,0.1,"SKIFF"],//OK
                            [27,'POWER_BOAT',"Skiff V-Hull swamped",15,0.1,"SKIFF_OTHER"], //OK
                            [28,'SHIP',"Balt/Wharf box lightly loaded",15,0.1,"SKIFF"], //ok
                            [29,'SHIP',"Balt/Wharf box full loaded",35,0.1,"RAFT_WITH_NO_SAIL_SURF_DEBRIS_BALT_SURF"], //ok
                            [30,'SHIP',"Balt/Wharf box uknown loaded",35,0.15,"RAFT_WITH_NO_SAIL_SURF_DEBRIS_BALT_SURF"], //ok
                            [31,'SHIP',"Coastal Frighter",50,0.25,"COASTAL_SAIL_KEEL_DRAFT"], //ok
                            [32,'SHIP',"Coastal Fishing Vessel",50,0.1,"COASTAL_SAIL_KEEL_DRAFT"], //ok                       
                            [33,'RAFT',"Windsurfer",10,0.1],
                            [34,'SHIP',"F/V debris",10,0.25,"RAFT_WITH_NO_SAIL_SURF_DEBRIS_BALT_SURF"], //ok
                            [35,'RAFT',"Surfboard",15,0.25,"RAFT_WITH_NO_SAIL_SURF_DEBRIS_BALT_SURF"], //ok
                            [36,'RAFT',"Sea Kayak",15,0.1,"RAFT_WITH_SAIL"], //ok?
                            
];


vessel_sub_types_equatuions_ds = [{
                                    CASE:"NO_BALAST",
                                    CATEGORIES:["RAFT","PIW"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:34,
                                                EQUATION_TYPE:1,
                                                a:0.03,
                                                b:0
                                        }]
                                    },
                                 {
                                    CASE:"SHALLOW_BALAST",
                                    CATEGORIES:["RAFT","PIW"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:34,
                                                EQUATION_TYPE:1,
                                                a:0.03,
                                                b:0
                                        }]
                                    },
                                    {
                                    CASE:"DEEP_BALAST",
                                    CATEGORIES:["RAFT","PIW"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:34,
                                                EQUATION_TYPE:1,
                                                a:0.03,
                                                b:0
                                        }]
                                    },
                                  {
                                    CASE:"AVIATION_46_PERSONS",
                                    CATEGORIES:["RAFT","PIW"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:34,
                                                EQUATION_TYPE:1,
                                                a:0.03,
                                                b:0
                                        }]
                                    },
                                     {
                                    CASE:"NO_BALLAST_NO_CANOPY",
                                    CATEGORIES:["RAFT","PIW"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:6,
                                                EQUATION_TYPE:1,
                                                a:0.09,
                                                b:0
                                        },
                                        {
                                            WIND_SPEED_FROM:6,
                                            WIND_SPEED_TO:1000,
                                            EQUATION_TYPE:2,
                                            a:0.06,
                                            b:0.55
                                        }]
                                    },
                                  {
                                    CASE:"NO_BALLAST_CANOPY_UKNOWN",
                                    CATEGORIES:["RAFT","PIW"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:34.8,
                                                EQUATION_TYPE:1,
                                                a:0.04,
                                                b:0
                                        },
                                       ]
                                    },
                                  {
                                    CASE:"AVIATION_4_6_PERSONS",
                                    CATEGORIES:["RAFT","PIW"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:34.8,
                                                EQUATION_TYPE:1,
                                                a:0.04,
                                                b:0
                                        },
                                       ]
                                    },
                                  {
                                    CASE:"SHALLOW_BALAST_CAPSIZED",
                                    CATEGORIES:["RAFT","PIW"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:11,
                                                EQUATION_TYPE:1,
                                                a:0.02,
                                                b:0
                                        },
                                        {
                                            WIND_SPEED_FROM:11,
                                            WIND_SPEED_TO:1000,
                                            EQUATION_TYPE:2,
                                            a:0.01,
                                            b:0.20
                                        }]
                                    },
                                  {
                                    CASE:"SHALLOW_BALAST_WITH_DROGUE",
                                    CATEGORIES:["RAFT","PIW"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:6,
                                                EQUATION_TYPE:1,
                                                a:0.02,
                                                b:0
                                        },
                                        {
                                            WIND_SPEED_FROM:6,
                                            WIND_SPEED_TO:1000,
                                            EQUATION_TYPE:2,
                                            a:0.03,
                                            b:0.11
                                        }]
                                    },
                                   {
                                    CASE:"SEA_RESCUE_KIT",
                                    CATEGORIES:["RAFT","PIW"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:6,
                                                EQUATION_TYPE:1,
                                                a:0.02,
                                                b:0
                                        },
                                        {
                                            WIND_SPEED_FROM:6,
                                            WIND_SPEED_TO:1000,
                                            EQUATION_TYPE:2,
                                            a:0.03,
                                            b:0.11
                                        }]
                                    },
                                  {
                                    CASE:"LIFECAPSULE_FULL_ENCLOSED",
                                    CATEGORIES:["RAFT","PIW"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:6,
                                                EQUATION_TYPE:1,
                                                a:0.03,
                                                b:0
                                        },
                                        {
                                            WIND_SPEED_FROM:6,
                                            WIND_SPEED_TO:1000,
                                            EQUATION_TYPE:2,
                                            a:0.45,
                                            b:0.15
                                        }]
                                    },
                                  {
                                    CASE:"PERSON_IN_WATER",
                                    CATEGORIES:["RAFT","PIW"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:6,
                                                EQUATION_TYPE:1,
                                                a:0.02,
                                                b:0
                                        },
                                        {
                                            WIND_SPEED_FROM:6,
                                            WIND_SPEED_TO:1000,
                                            EQUATION_TYPE:2,
                                            a:0.01,
                                            b:0.14
                                        }]
                                    },
                                   {
                                    CASE:"DEEP_BALAST_CAMPSIZED_SWAMPED",
                                    CATEGORIES:["RAFT","PIW"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:11,
                                                EQUATION_TYPE:1,
                                                a:0.02,
                                                b:0
                                        },
                                        {
                                            WIND_SPEED_FROM:11,
                                            WIND_SPEED_TO:1000,
                                            EQUATION_TYPE:2,
                                            a:0,
                                            b:0.20
                                        }]
                                    },
                                  {
                                    CASE:"PERSON_IN_WATER_SUIT",
                                    CATEGORIES:["RAFT","PIW"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:6,
                                                EQUATION_TYPE:1,
                                                a:0.05,
                                                b:0
                                        },
                                        {
                                            WIND_SPEED_FROM:6,
                                            WIND_SPEED_TO:1000,
                                            EQUATION_TYPE:2,
                                            a:0.01,
                                            b:0.29
                                        }]
                                    },
                                    {
                                    CASE:"SPORT_BOATS",
                                    CATEGORIES:["POWER_BOATS","SAILING","SHIP"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:6,
                                                EQUATION_TYPE:1,
                                                a:0.06,
                                                b:0
                                        },
                                        {
                                            WIND_SPEED_FROM:6,
                                            WIND_SPEED_TO:1000,
                                            EQUATION_TYPE:2,
                                            a:0.07,
                                            b:0.34
                                        }]
                                    },
                                    {
                                    CASE:"SPORT_FISHER",
                                    CATEGORIES:["POWER_BOATS","SAILING","SHIP"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:6,
                                                EQUATION_TYPE:1,
                                                a:0.05,
                                                b:0
                                        },
                                        {
                                            WIND_SPEED_FROM:6,
                                            WIND_SPEED_TO:1000,
                                            EQUATION_TYPE:2,
                                            a:0.06,
                                            b:0.28
                                        }]
                                    },
                                    {
                                    CASE:"RAFT_WITH_SAIL",
                                    CATEGORIES:["POWER_BOATS","SAILING","SHIP"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:6,
                                                EQUATION_TYPE:1,
                                                a:0.05,
                                                b:0
                                        },
                                        {
                                            WIND_SPEED_FROM:6,
                                            WIND_SPEED_TO:1000,
                                            EQUATION_TYPE:2,
                                            a:0.08,
                                            b:0.30
                                        }]
                                    },
                                  {
                                    CASE:"RAFT_WITH_NO_SAIL_SURF_DEBRIS_BALT_SURF",
                                    CATEGORIES:["POWER_BOATS","SAILING","SHIP"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:6,
                                                EQUATION_TYPE:1,
                                                a:0.04,
                                                b:0
                                        },
                                        {
                                            WIND_SPEED_FROM:6,
                                            WIND_SPEED_TO:1000,
                                            EQUATION_TYPE:2,
                                            a:0.01,
                                            b:0.25
                                        }]
                                    },
                                    {
                                    CASE:"COMMERCIAL_FISHING_SAILING",
                                    CATEGORIES:["POWER_BOATS","SAILING","SHIP"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:6,
                                                EQUATION_TYPE:1,
                                                a:0.04,
                                                b:0
                                        },
                                        {
                                            WIND_SPEED_FROM:6,
                                            WIND_SPEED_TO:1000,
                                            EQUATION_TYPE:2,
                                            a:0.04,
                                            b:0.25
                                        }]
                                    },
                                    {
                                    CASE:"SKIFF",
                                    CATEGORIES:["POWER_BOATS","SAILING","SHIP"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:6,
                                                EQUATION_TYPE:1,
                                                a:0.04,
                                                b:0
                                        },
                                        {
                                            WIND_SPEED_FROM:6,
                                            WIND_SPEED_TO:1000,
                                            EQUATION_TYPE:2,
                                            a:0.03,
                                            b:0.25
                                        }]
                                    },
                                    {
                                    CASE:"SKIFF_OTHER",
                                    CATEGORIES:["POWER_BOATS","SAILING","SHIP"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:1000,
                                                EQUATION_TYPE:1,
                                                a:0.02,
                                                b:0
                                        }
                                    ]},
                                    {
                                    CASE:"COASTAL_SAIL_KEEL_DRAFT",
                                    CATEGORIES:["POWER_BOATS","SAILING","SHIP"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:1000,
                                                EQUATION_TYPE:1,
                                                a:0.03,
                                                b:0
                                        }
                                    ]},
                                  {
                                    CASE:"WINDSURFER",
                                    CATEGORIES:["POWER_BOATS","SAILING","SHIP"],
                                    WIND_RANGES:[
                                        {
                                                WIND_SPEED_FROM:0,
                                                WIND_SPEED_TO:6,
                                                EQUATION_TYPE:1,
                                                a:0.04,
                                                b:0
                                        },
                                        {
                                                WIND_SPEED_FROM:6,
                                                WIND_SPEED_TO:1000,
                                                EQUATION_TYPE:1,
                                                a:0.02,
                                                b:0.25
                                        },
                                    ]}
            ];

var fs_search_factor_ds_point_datum = [{
                            fsFrom:0,
                            fsTo:0.05,
                            value:0.1
                            },
                          {
                            fsFrom:0.05,
                            fsTo:0.08,
                            value:0.2
                          },
                          {
                            fsFrom:0.08,
                            fsTo:0.1,
                            value:0.3
                          },
                          {
                            fsFrom:0.1,
                            fsTo:0.12,
                            value:0.4
                          },
                          {
                            fsFrom:0.12,
                            fsTo:0.2,
                            value:0.5
                          },
                          {
                            fsFrom:0.2,
                            fsTo:0.5,
                            value:0.6
                          },
                          {
                            fsFrom:0.5,
                            fsTo:0.85,
                            value:0.7
                          },
                          {
                            fsFrom:0.85,
                            fsTo:1.5,
                            value:0.8
                          },
                          {
                            fsFrom:1.5,
                            fsTo:2.4,
                            value:0.9
                          },
                          {
                            fsFrom:2.4,
                            fsTo:3.6,
                            value:1
                          },
                          {
                            fsFrom:3.6,
                            fsTo:5.2,
                            value:1.1
                          },
                          {
                            fsFrom:5.2,
                            fsTo:7.4,
                            value:1.2
                          },
                          {
                            fsFrom:7.4,
                            fsTo:10,
                            value:1.3
                          },
                          {
                            fsFrom:10,
                            fsTo:13.5,
                            value:1.4
                          },
                          {
                            fsFrom:13.5,
                            fsTo:17.6,
                            value:1.5
                          },
                          {
                            fsFrom:17.6,
                            fsTo:22.5,
                            value:1.6
                          },
                          {
                            fsFrom:22.5,
                            fsTo:29,
                            value:1.7
                          },
                           {
                            fsFrom:29,
                            fsTo:36,
                            value:1.8
                          },
                          {
                            fsFrom:36,
                            fsTo:42,
                            value:1.9
                          },
                          {
                            fsFrom:42,
                            fsTo:52.5,
                            value:2
                          },
                          {
                            fsFrom:52.5,
                            fsTo:65,
                            value:2.1
                          },
                           {
                            fsFrom:65,
                            fsTo:77.7,
                            value:2.2
                          },
                          {
                            fsFrom:77.7,
                            fsTo:92,
                            value:2.3
                          },
                          {
                            fsFrom:77.7,
                            fsTo:92,
                            value:2.3
                          },
                           {
                            fsFrom:92,
                            fsTo:110,
                            value:2.4
                          },
                           {
                            fsFrom:110,
                            fsTo:1000,
                            value:2.5
                          }];



var fs_search_factor_ds_line_datum = [{
                            fsFrom:0,
                            fsTo:0.1,
                            value:0.4
                            },
                           { 
                            fsFrom:0.1,
                            fsTo:0.21,
                            value:0.5
                          },
                          {
                            fsFrom:0.21,
                            fsTo:0.4,
                            value:0.6
                          },
                          {
                            fsFrom:0.4,
                            fsTo:0.6,
                            value:0.7
                          },
                          {
                            fsFrom:0.6,
                            fsTo:0.92,
                            value:0.8
                          },
                          {
                            fsFrom:0.92,
                            fsTo:1.3,
                            value:0.9
                          },
                          {
                            fsFrom:1.3,
                            fsTo:1.8,
                            value:1
                          },
                          {
                            fsFrom:1.8,
                            fsTo:2.4,
                            value:1.1
                          },
                          {
                            fsFrom:2.4,
                            fsTo:3.1,
                            value:1.2
                          },
                          {
                            fsFrom:3.1,
                            fsTo:3.55,
                            value:1.3
                          },
                          {
                            fsFrom:3.55,
                            fsTo:4.8,
                            value:1.4
                          },
                          {
                            fsFrom:4.8,
                            fsTo:6,
                            value:1.5
                          },
                          {
                            fsFrom:6,
                            fsTo:7.2,
                            value:1.6
                          },
                          {
                            fsFrom:7.2,
                            fsTo:8.4,
                            value:1.7
                          },
                          {
                            fsFrom:8.4,
                            fsTo:10,
                            value:1.8
                          },
                          {
                            fsFrom:10,
                            fsTo:11.6,
                            value:1.9
                          },
                          {
                            fsFrom:11.6,
                            fsTo:13.5,
                            value:2
                          },
                           {
                            fsFrom:13.5,
                            fsTo:15.5,
                            value:2.1
                          },
                          {
                            fsFrom:15.5,
                            fsTo:17.8,
                            value:2.2
                          },
                          {
                            fsFrom:17.8,
                            fsTo:20,
                            value:2.3
                          },
                          {
                            fsFrom:20,
                            fsTo:22.8,
                            value:2.4
                          },
                           {
                            fsFrom:22.8,
                            fsTo:1000,
                            value:2.5
                          }];

