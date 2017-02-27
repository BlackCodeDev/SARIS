var previous_relative_cumulative_effort = 0; //TO DO GET PREVIOUS SIM

var SearchFacilitiesStore =  Ext.create('Ext.data.Store', {
                                    storeId:'SearchFacilitiesStore',
                                    fields:['FACILITY_ID','AIRCRAFT_TYPE','AVIATION_TYPE','AREA','AIRCRAFT_ENDURANCE','AIRCRAFT_SPEED','AIRCRAFT_CREW_FATIGUE','DAYLIGHT_HOURS','SEARCH_ALTITUDE','CALC_SEARCH_ENDURANCE','CALC_CORRECTED_SWEEP_WIDTH'],
                                    data:[{
                                            AIRCRAFT_TYPE: '',
                                            AVIATION_TYPE:'',
                                            AREA:"",
                                            AIRCRAFT_ENDURANCE :'',
                                            AIRCRAFT_SPEED:"",
                                            AIRCRAFT_CREW_FATIGUE:"",
                                            DAYLIGHT_HOURS:"",
                                            SEARCH_ALTITUDE:"",
                                            CALC_SEARCH_ENDURANCE:"",
                                            CALC_CORRECTED_SWEEP_WIDTH:""},
                                            {
                                            AIRCRAFT_TYPE: '',
                                            AVIATION_TYPE:'',
                                            AREA:"",
                                            AIRCRAFT_ENDURANCE :'',
                                            AIRCRAFT_SPEED:"",
                                            AIRCRAFT_CREW_FATIGUE:"",
                                            DAYLIGHT_HOURS:"",
                                            SEARCH_ENDURANCE:"",
                                            SEARCH_ALTITUDE:"",
                                            CALC_SEARCH_ENDURANCE:"",
                                            CALC_CORRECTED_SWEEP_WIDTH:""},
                                            {
                                            AIRCRAFT_TYPE: '',
                                            AVIATION_TYPE:'',
                                            AREA:"",
                                            AIRCRAFT_ENDURANCE :'',
                                            AIRCRAFT_SPEED:"",
                                            AIRCRAFT_CREW_FATIGUE:"",
                                            DAYLIGHT_HOURS:"",
                                            SEARCH_ALTITUDE:"",
                                            CALC_SEARCH_ENDURANCE:"",
                                            CALC_CORRECTED_SWEEP_WIDTH:""
                                            },
                                           {
                                            AIRCRAFT_TYPE: '',
                                            AVIATION_TYPE:'',
                                            AREA:"",
                                            AIRCRAFT_ENDURANCE :'',
                                            AIRCRAFT_SPEED:"",
                                            AIRCRAFT_CREW_FATIGUE:"",
                                            DAYLIGHT_HOURS:"",
                                            SEARCH_ALTITUDE:"",
                                            CALC_SEARCH_ENDURANCE:"",
                                            CALC_CORRECTED_SWEEP_WIDTH:""},
                                          {
                                            AIRCRAFT_TYPE: '',
                                            AVIATION_TYPE:'',
                                            AREA:"",
                                            AIRCRAFT_ENDURANCE :'',
                                            AIRCRAFT_SPEED:"",
                                            AIRCRAFT_CREW_FATIGUE:"",
                                            DAYLIGHT_HOURS:"",
                                            SEARCH_ALTITUDE:"",
                                            CALC_SEARCH_ENDURANCE:"",
                                            CALC_CORRECTED_SWEEP_WIDTH:""}
                                         ]
    
});

var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        autoCancel: false
});

var gridPointSearchFacilities = Ext.create('Ext.grid.Panel', {
                    title: '',
                    store:Ext.data.StoreManager.lookup('SearchFacilitiesStore'),
                    id:"gridPointSearchFacilities",
                    plugins: [rowEditing],
                    listeners: {
                        edit: function(obj , row) {
                            debugger;
                            
                            var total_available_effort=0;
                            var horizon_visibility = Ext.getCmp("search_meteo_visibility").getValue();
                            var vsl_sub_type_ctlVal = Ext.getCmp("vessel_subtype").getValue();
                            var vsl_sub_type = Ext.getCmp("vessel_subtype").findRecordByValue(vsl_sub_type_ctlVal).data.GENERAL_TYPE;
                            
                            var vsl_length = Ext.getCmp("vessel_length").getValue()==""?null:parseFloat(Ext.getCmp("vessel_length").getValue());
                            var raft_persons = Ext.getCmp("persons_raft").getValue()==""?null: parseFloat(Ext.getCmp("persons_raft").getValue());
                          
                            var search_wind_speed = Ext.getCmp("search_meteo_wind_speed").getValue()==""?null: parseFloat(Ext.getCmp("search_meteo_wind_speed").getValue());
                            
                            var search_wind_dir = Ext.getCmp("search_meteo_wind_dir").getValue()==""?null: parseFloat(Ext.getCmp("search_meteo_wind_dir").getValue());
                            
                            var records =  this.getStore().getRange();
                       
                            for(var i=0;i<records.length-1;i++){
                             if(records[i].data.AVIATION_TYPE != '' && records[i].data.AIRCRAFT_TYPE){ 
                                  var facility_type = records[i].data.AVIATION_TYPE;
                                  var facility_altitude = parseFloat(records[i].data.SEARCH_ALTITUDE);
                                  var facility_speed = parseFloat(records[i].data.AIRCRAFT_SPEED);
                                  var facility_endurance = parseFloat(records[i].data.AIRCRAFT_ENDURANCE);

                                  //*********Start Find sweep width*******
                                  var facility_sweep_width_object = CalculateUnCorrectedSweepWidth(facility_type,horizon_visibility,facility_altitude,vsl_sub_type,vsl_length,raft_persons);
                                  var facility_uncorrected_sweep_width_factor = facility_sweep_width_object;
                                  //*********End Find sweep width*********
                                  var facility_search_endurance =  parseFloat(facility_endurance) *0.85;
                                  records[i].data.CALC_SEARCH_ENDURANCE = facility_search_endurance;
                                  var facility_weather_correction_factor = CalculateWeatherFactorSearch(search_wind_speed);
                                  var facility_velocity_correction_factor = CalculateVelocityFactorSearch(facility_speed,facility_type);
                                  var facility_fatigue_correction_factor = CalculateFatigueFactorSearch(search_wind_speed);

                                  var facility_corrected_sweep_width =  CalculateCorrectedSweepWidth (facility_uncorrected_sweep_width_factor,facility_weather_correction_factor,facility_velocity_correction_factor,facility_fatigue_correction_factor);
                                 
                                  records[i].data.CALC_CORRECTED_SWEEP_WIDTH = facility_corrected_sweep_width;
                                 
                                  var facility_search_effort = CalculateSearchEffort(facility_speed,facility_search_endurance,facility_corrected_sweep_width);

                                  total_available_effort += round(facility_search_effort,1);
                              }
                            }
                                       
                            Ext.getCmp("total_effort_allocation_effort_sum").setValue(total_available_effort);
                            
                            
                            Ext.getCmp("total_effort_allocation_effort_factor").setValue(Ext.getCmp("total_probable_pos_error_squared").getValue());
                            
                            
                              //var effort_factor =total_available_effort/parseFloat(Ext.getCmp("total_probable_pos_error_squared").getValue());
                            
                            
                            var relative_effort  =total_available_effort/parseFloat(Ext.getCmp("total_probable_pos_error_squared").getValue());// total_available_effort/effort_factor;
                            Ext.getCmp("total_effort_allocation_rel_effort_factor").setValue(relative_effort.toFixed(2));
                            
                            
                            var cumulative_relativeffort = previous_relative_cumulative_effort + relative_effort;
                            Ext.getCmp("total_effort_allocation_cumm_effort_factor").setValue(cumulative_relativeffort.toFixed(2));
                            
                            
                            var optimal_search_factor = FindSearchFactor(cumulative_relativeffort,datum_mode);
                            Ext.getCmp("total_effort_allocation_optimal_search_factor").setValue(optimal_search_factor);
                            
                            
                            var optimal_search_radius = optimal_search_factor * parseFloat(Ext.getCmp("total_probable_pos_error").getValue());
                            Ext.getCmp("total_effort_allocation_search_radius").setValue(optimal_search_radius.toFixed(2));
                            
                            var optimal_search_area = 0;
                            
                            var hasDivergence = Ext.getCmp("diverg_pos_div_distance").getValue() !=""                           
                            
                            
                            
                            if(datum_mode == "POINT_DATUM"){
                                if(hasDivergence){
                                     optimal_search_area = (4 * Math.pow(optimal_search_radius,2)) + (2*optimal_search_radius*parseFloat(Ext.getCmp("diverg_pos_div_distance").getValue()));
                                }
                                else{
                                    optimal_search_area = 4 * Math.pow(optimal_search_radius,2);
                                }
                                
                            }
                            else if(datum_mode == "LINE_DATUM" || datum_mode == "BACKTRACK_DATUM"){
                                optimal_search_area = 2 *  optimal_search_radius; // TO DO  2 *  optimal_search_radius * LINE LENGTH
                            }
                            else{
                                optimal_search_area = -9999;
                            }
                            
                            Ext.getCmp("total_effort_allocation_optimal_search_area").setValue(optimal_search_area.toFixed(2));
                            
                            var optimal_coverage_factor = total_available_effort/optimal_search_area;
                            Ext.getCmp("total_effort_allocation_optimal_coverage_factor").setValue(optimal_coverage_factor.toFixed(2));
                            
                        }
                     },
                    bbar:[{
                            xtype:"button",
                            text:"Add",
                            handler:function(){                        
                                        SearchFacilitiesStore.add({
                                            AIRCRAFT_TYPE: '',
                                            AVIATION_TYPE:'',
                                            AREA:"",
                                            AIRCRAFT_ENDURANCE :'',
                                            AIRCRAFT_SPEED:"",
                                            AIRCRAFT_CREW_FATIGUE:"",
                                            DAYLIGHT_HOURS:"",
                                            SEARCH_ALTITUDE:"",
                                            CALC_SEARCH_ENDURANCE:"",
                                            CALC_CORRECTED_SWEEP_WIDTH:""});
                                }
                          },
                          {
                            xtype:"button",
                            text:"Delete",
                            handler:function(){                        
                                        var selection = gridPointSearchFacilities.getSelectionModel().getSelection();
                                        SearchFacilitiesStore.remove(selection); // all selections
                                }
                          }
                    ],
                    columns: [
                       { text: 'TYPE', dataIndex: 'AIRCRAFT_TYPE', editor: {allowBlank: true}},
                       { text: 'AREA', dataIndex: 'AREA', width:60,editor: {allowBlank: false}},
                       {
                            text: 'WING/HELIC',
                            dataIndex: 'AVIATION_TYPE',
                            editor: {
                                xtype: 'combobox',
                                triggerAction: 'all',
                                lazyRender:true,
                                mode: 'local',
                                store: new Ext.data.ArrayStore({
                                    id: 0,
                                    fields: [
                                        'ID','NAME'
                                    ],
                                    data: [["WING","Fixed Wing"],["HEL","Helicopter"]]
                                }),
                                valueField: 'NAME',
                                displayField: 'NAME'
                        }
                        
                       },
                       { text: 'ENDURANCE', dataIndex: 'AIRCRAFT_ENDURANCE',width:70,editor: {allowBlank: true}},      
                       { text: 'SPEED', dataIndex: 'AIRCRAFT_SPEED',width:50,editor: {allowBlank: false}},
                       { text:  'ALTITUDE', dataIndex: 'SEARCH_ALTITUDE',width:60,editor: {allowBlank: false}},
                       { text: 'FATIGUE', dataIndex: 'AIRCRAFT_CREW_FATIGUE',width:55,editor: {allowBlank: true}},
                       { text:  'DAYLIGHT HOURS REMAINING', dataIndex: 'DAYLIGHT_HOURS',width:160,editor: {allowBlank: true}},
                       { text:  'CALC_SEARCH_ENDURANCE', dataIndex: 'CALC_SEARCH_ENDURANCE',width:160,hidden:true,editor: {allowBlank: true}},
                       { text:  'CALC_CORRECTED_SWEEP_WIDTH', dataIndex: 'CALC_CORRECTED_SWEEP_WIDTH',width:160,hidden:true,editor: {allowBlank: true}}
                       
                    ]
                    
                });


var search_facilities_tab ={
     title:"Search Parameters",
     id:"search_facilities_tab",
     items:[
         {
          xtype: 'form',
          frame:true,
          items:[{
            xtype: 'fieldset',
            flex: 1,
            title: '<b>Search Facilities</b>',
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                hideEmptyLabel: false
            },
            style:'margin-left:10px',
            items:[gridPointSearchFacilities]
         },
         {
            xtype: 'fieldset',
            flex: 1,
            title: '<b>Search Weather Conditions</b>',
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                hideEmptyLabel: false
            },
            style:'margin-left:10px',
            items:[
                    {
                     xtype:"datefield",
                     format: 'd/m/Y',
                     id:"searc_date",
                     name:"searc_date",
                     fieldLabel:"Search Date",
                    },
                    {
                     xtype:"combo",
                     id:"search_meteo_visibility",
                     fieldLabel:"Meterological Visibility",
                     triggerAction: 'all',
                     lazyRender:true,
                     mode: 'local',
                     store: new Ext.data.ArrayStore({
                        id: 0,
                        fields: [
                            'VISIBILITY_LABEL','VISIBILITY_VALUE'
                        ],
                        data: [["1 nautical mile",1.9],["3 nautical miles",5.6],["5 nautical miles",9.3],["10 nautical miles",18.5],["15 nautical miles",27.8],["20 nautical miles or greater",37]]
                    }),
                    valueField: 'VISIBILITY_VALUE',
                    displayField: 'VISIBILITY_LABEL'
                   },
                   {
                     xtype:"textfield",
                     id:"search_meteo_wind_dir",
                     fieldLabel:"Wind Direction"               
                   },
                   {
                    xtype:"textfield",
                    id:"search_meteo_wind_speed",
                    fieldLabel:"Wind Speed"               
                   },
                   {
                    xtype:"textfield",
                    id:"search_meteo_ceilling",
                    fieldLabel:"Ceiling"               
                   },
                   {
                    xtype:"textfield",
                    id:"search_meteo_seas",
                    fieldLabel:"Seas"               
                   },
                   {
                    xtype:"textfield",
                    id:"search_meteo_sunrise",
                    fieldLabel:"Sunrise"               
                   },
                   {
                    xtype:"textfield",
                    id:"search_meteo_sunset",
                    fieldLabel:"Sunset"               
                   }
                  ]
         }
        ]
}]};
