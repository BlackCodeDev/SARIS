var total_effort_allocation_effort_sum ={
    xtype:"textfield",
    fieldLabel:"Available Search Effort",
    id:"total_effort_allocation_effort_sum",
    name:"total_effort_allocation_effort_sum",
    hidden:true
};

var total_effort_allocation_effort_factor ={
    xtype:"textfield",
    fieldLabel:"Effort Factor",
    id:"total_effort_allocation_effort_factor",
    name:"total_effort_allocation_effort_factor",
    hidden:true
    
};

var total_effort_allocation_rel_effort_factor ={
    xtype:"textfield",
    fieldLabel:"Relative Effort Factor",
    id:"total_effort_allocation_rel_effort_factor",
    name:"total_effort_allocation_rel_effort_factor",
    hidden:true
    
    
};

var total_effort_allocation_cumm_effort_factor ={
    xtype:"textfield",
    fieldLabel:"Cummulative Effort",
    id:"total_effort_allocation_cumm_effort_factor",
    name:"total_effort_allocation_cumm_effort_factor",
    hidden:true
    
    
};

var total_effort_allocation_search_radius ={
    xtype:"textfield",
    fieldLabel:"Search Radius",
    id:"total_effort_allocation_search_radius",
    name:"total_effort_allocation_search_radius",
    hidden:true
    
};

var total_effort_allocation_optimal_search_factor ={
    xtype:"textfield",
    fieldLabel:"Optimal Search Factor",
    id:"total_effort_allocation_optimal_search_factor",
    name:"total_effort_allocation_optimal_search_factor",
    hidden:true
    
};


var total_effort_allocation_optimal_search_area ={
    xtype:"textfield",
    fieldLabel:"Optimal Search Area",
    id:"total_effort_allocation_optimal_search_area",
    name:"total_effort_allocation_optimal_search_area",
    hidden:true
    
    
};

var total_effort_allocation_optimal_coverage_factor ={
    xtype:"textfield",
    fieldLabel:"Optimal Coverage Factor",
    id:"total_effort_allocation_optimal_coverage_factor",
    name:"total_effort_allocation_optimal_coverage_factor" ,
    hidden:true
       
};

var total_adjusted_search_area_txt = {
    xtype:"textfield",
    fieldLabel:"Total Adjusted Search Area",
    id:"total_adjusted_search_area_txt",
    width:200,
    name:"total_adjusted_search_area_txt"    
};

var adjusted_search_radius_txt = {
    xtype:"textfield",
    fieldLabel:"Adjusted Search Radius",
    id:"adjusted_search_radius_txt",
    width:200,
    name:"adjusted_search_radius_txt",
};

var adjusted_search_area_length_txt = {
    xtype:"textfield",
    fieldLabel:"Length",
    id:"adjusted_search_area_length_txt",
    width:200,
    name:"adjusted_search_area_length_txt",
}

var adjusted_search_area_width_txt = {
    xtype:"textfield",
    fieldLabel:"Width",
    id:"adjusted_search_area_width_txt",
    width:200,
    name:"adjusted_search_area_width_txt",
    
};

var totals_container = {
        xtype: 'fieldcontainer',
        labelWidth: 50,
        
        items: [total_adjusted_search_area_txt,adjusted_search_radius_txt]
};

var bth_calculate={
    xtype:"button",
    text:"Calculate Facilities Allocation",
    id:"bth_calculate",
    name:"bth_calculate",
    style:"margin-bottom:5px",
    handler:function(){
        CalculateFacilitiesAllocation("POINT_DATUM");
    }
};



var effort_allocation_facilities =  Ext.create('Ext.data.Store', {
                                    storeId:'effort_allocation_facilitiesStore',
                                    fields:['FACILITY_ID','AIRCRAFT_TYPE','AVIATION_TYPE','TRACK_SPACING','NEAREST_TRACK_SPACING','ADJUSTED_AREA'],
                                    data:[]
    
});


var effort_allocation_facilities_grid =  Ext.create('Ext.grid.Panel', {
                    title: '',
                    store:Ext.data.StoreManager.lookup('effort_allocation_facilitiesStore'),
                    id:"effort_allocation_facilities_grid",
                    columns: [
                       {text: 'TYPE', dataIndex: 'AIRCRAFT_TYPE'},
                       {text: 'AVIATION_TYPE', dataIndex: 'AVIATION_TYPE', width:60},
                       {text: 'WING/HELIC', dataIndex: 'AVIATION_TYPE'},
                       {text: 'TRACK_SPACING', dataIndex: 'TRACK_SPACING'},
                       {text: 'NEAREST TRACK SPACING', dataIndex: 'NEAREST_TRACK_SPACING'}, 
                       {text: 'ADJUSTED AREA', dataIndex: 'ADJUSTED_AREA'}, 
                    ]                   
                });



var total_effort_allocation_tab = {
     title:"Total Effort Allocation",
     id:"total_effort_allocation_tab",
     items:[{
            xtype       : 'form',
            height      : 480,
            autoScroll  : true,
            id          : 'total_effort_allocation_form',
            defaultType : 'field',
            frame       : true,
            items:[{xtype:"fieldset",
                   title:"<b>Total Effort Calculations</b>",
                   id:"fieldset_allocation",
                    items:[total_effort_allocation_effort_sum,total_effort_allocation_effort_factor,total_effort_allocation_rel_effort_factor,total_effort_allocation_cumm_effort_factor,total_effort_allocation_search_radius,total_effort_allocation_optimal_search_factor,total_effort_allocation_optimal_search_area,total_effort_allocation_optimal_coverage_factor,bth_calculate,effort_allocation_facilities_grid,totals_container,adjusted_search_area_length_txt,adjusted_search_area_width_txt]
                   }]
    }]
};

/*
{
                                            AIRCRAFT_TYPE: '',
                                            AVIATION_TYPE:'',
                                            TRACK_SPACING:"",
                                            NEAREST_TRACK_SPACING :'',
                                          },
                                            {
                                            AIRCRAFT_TYPE: '',
                                            AVIATION_TYPE:'',
                                            TRACK_SPACING:"",
                                            NEAREST_TRACK_SPACING :'',
                                            },
                                            {
                                            AIRCRAFT_TYPE: '',
                                            AVIATION_TYPE:'',
                                            AREA:"",
                                            AIRCRAFT_ENDURANCE :'',
                                            AIRCRAFT_SPEED:"",
                                            AIRCRAFT_CREW_FATIGUE:"",
                                            DAYLIGHT_HOURS:"",
                                            SEARCH_ALTITUDE:""
                                            },
                                           {
                                            AIRCRAFT_TYPE: '',
                                            AVIATION_TYPE:'',
                                            AREA:"",
                                            AIRCRAFT_ENDURANCE :'',
                                            AIRCRAFT_SPEED:"",
                                            AIRCRAFT_CREW_FATIGUE:"",
                                            DAYLIGHT_HOURS:"",
                                            SEARCH_ALTITUDE:""},
                                          {
                                            AIRCRAFT_TYPE: '',
                                            AVIATION_TYPE:'',
                                            AREA:"",
                                            AIRCRAFT_ENDURANCE :'',
                                            AIRCRAFT_SPEED:"",
                                            AIRCRAFT_CREW_FATIGUE:"",
                                            DAYLIGHT_HOURS:"",
                                            SEARCH_ALTITUDE:""}
*/
