var diverg_pos_lat_left_downwind = {
        xtype:"textfield",
        id:"diverg_pos_lat_left_downwind",
        name:"diverg_pos_lat_left_downwind",
        fieldLabel:"Latitude",       
    };

var diverg_pos_lon_left_downwind = {
        xtype:"textfield",
        id:"diverg_pos_lon_left_downwind",
        name:"diverg_pos_lon_left_downwind",
        fieldLabel:"Longitude",       
    };

var diverg_pos_lat_right_downwind = {
        xtype:"textfield",
        id:"diverg_pos_lat_right_downwind",
        name:"diverg_pos_lat_right_downwind",
        fieldLabel:"Latitude",       
    };

var diverg_pos_lon_right_downwind = {
        xtype:"textfield",
        id:"diverg_pos_lon_right_downwind",
        name:"diverg_pos_lon_right_downwind",
        fieldLabel:"Longitude",       
    };

var diverg_pos_div_distance = {
        xtype:"textfield",
        id:"diverg_pos_div_distance",
        name:"diverg_pos_div_distance",
        fieldLabel:"Divergence Distance",       
    };

var left_diverg_downwind_pos = {
        xtype: 'fieldset',
        flex: 1,
        layout: 'anchor',
        defaults: {
            anchor: '100%',
            hideEmptyLabel: false
        },
        title:"<b>Left Downwind Position</b>",
        items:[diverg_pos_lat_left_downwind,diverg_pos_lon_left_downwind]
    };

var right_diverg_downwind_pos = {
        xtype: 'fieldset',
        flex: 1,
        layout: 'anchor',
        defaults: {
            anchor: '100%',
            hideEmptyLabel: false
        },
        title:"<b>Right Downwind Position</b>",
        items:[diverg_pos_lat_right_downwind,diverg_pos_lon_right_downwind]
    };

var total_probable_drift_error = {
        xtype:"textfield",
        id:"total_probable_drift_error",
        name:"total_probable_drift_error",
        fieldLabel:"Total Probable Drift Error",  
};

var total_probable_pos_error_squared = {
        xtype:"textfield",
        id:"total_probable_pos_error_squared",
        name:"total_probable_pos_error_squared",
        fieldLabel:"Total Probable Error of Position Squared",  
};

var total_probable_pos_error = {
        xtype:"textfield",
        id:"total_probable_pos_error",
        name:"total_probable_pos_error",
        fieldLabel:"Total Probable Error of Position",  
};


var separation_ratio = {
        xtype:"textfield",
        id:"separation_ratio",
        name:"separation_ratio",
        fieldLabel:"Separation Ratio",  
};

var position_diverg = {
        xtype       : 'form',
        autoHeight   : true,
        autoWidth   : true,
        autoScroll  : true,
        id          : 'position_diverg_form_panel',
        defaultType : 'field',
        frame       : true,
        //layout:"hbox",
        title       : 'Divergence of Position',
        items       :[left_diverg_downwind_pos,right_diverg_downwind_pos,diverg_pos_div_distance,total_probable_drift_error,total_probable_pos_error_squared,total_probable_pos_error,separation_ratio]
    };