//HIDDENS FOR WEATHER

var aws_avg_dir = {
    xtype:"textfield",
    id:"aws_avg_dir",
    name:"aws_avg_dir",
    fieldLabel:"Avg Direction",
    hidden:true
};

var aws_avg_downwind = {
    xtype:"textfield",
    id:"aws_avg_downwind",
    name:"aws_avg_downwind",
    fieldLabel:"Downwind Direction",
    hidden:true,
    listeners: {
    'change': function(){
        GetLeewayData();
        }
    }
};

var aws_avg_speed = {
    xtype:"textfield",
    id:"aws_avg_speed",
    name:"aws_avg_speed",
    hidden:true,
    fieldLabel:"Avg Speed"  
};

var leeway_left_dir = {
    xtype:"textfield",
    id:"leeway_left_dir",
    name:"leeway_left_dir",
    fieldLabel:"Leeway Left Direction",
    hidden:true
};
var leeway_right_dir = {
    xtype:"textfield",
    id:"leeway_right_dir",
    name:"leeway_right_dir",
    fieldLabel:"Leeway Right Direction",
    hidden:true
};
var pdve = {
    xtype:"textfield",
    id:"pdve",
    name:"pdve",
    fieldLabel:"Total Drift Velocity Error",
    hidden:true
    };


var awse = {
    xtype:"textfield",
    id:"awse",
    name:"awse",
    fieldLabel:"Probable Error of ASW",
    hidden:true,
    value:5,
    hidden:true
};

var awsdve = {
    xtype:"textfield",
    id:"awsdve",
    name:"awsdve",
    fieldLabel:"Probable Error of Drift Velocity",
    hidden:true,
    value:0.3
};

//HIDDENS FOR WEATHER
var sea_current_direction = {
                                xtype:"textfield",
                                id:"seacurrent_direction",
                                name:"seacurrent_direction",
                                fieldLabel:"Direction",
                                value:57,
                                hidden:true,
                                
                                
                            };
var sea_current_speed =    {
                                xtype:"textfield",
                                id:"seacurrent_speed",
                                name:"seacurrent_speed",
                                fieldLabel:"Speed",
                                value:1.86,
                                hidden:true,
                                listeners:{
                                    change:function(){
                                        var d = Math.sqrt(parseFloat(Ext.getCmp("seacurrent_speed").getValue())/10);
                                        Ext.getCmp("sea_current_prob_error").setValue(d.toFixed(2));
                                    }
                                }
                            }
                            
                
var sea_current_prob_error =     {
                                xtype:"textfield",
                                id:"sea_current_prob_error",
                                name:"sea_current_prob_error",
                                fieldLabel:"Probable Total Current Error",
                                hidden:true,
                                value:0.43
                              
                            };
//HIDDENS FOR CURRENTS


//HIDDENS FOR DIVERGENCE

var diverg_pos_lat_left_downwind = {
        xtype:"textfield",
        id:"diverg_pos_lat_left_downwind",
        name:"diverg_pos_lat_left_downwind",
        fieldLabel:"Latitude",
        hidden:true
    };

var diverg_pos_lon_left_downwind = {
        xtype:"textfield",
        id:"diverg_pos_lon_left_downwind",
        name:"diverg_pos_lon_left_downwind",
        fieldLabel:"Longitude",
        hidden:true       
    };

var diverg_pos_lat_right_downwind = {
        xtype:"textfield",
        id:"diverg_pos_lat_right_downwind",
        name:"diverg_pos_lat_right_downwind",
        fieldLabel:"Latitude",
        hidden:true       
    };

var diverg_pos_lon_right_downwind = {
        xtype:"textfield",
        id:"diverg_pos_lon_right_downwind",
        name:"diverg_pos_lon_right_downwind",
        fieldLabel:"Longitude",
        hidden:true       
    };

var diverg_pos_div_distance = {
        xtype:"textfield",
        id:"diverg_pos_div_distance",
        name:"diverg_pos_div_distance",
        fieldLabel:"Divergence Distance",
        hidden:true       
    };

var total_probable_drift_error = {
        xtype:"textfield",
        id:"total_probable_drift_error",
        name:"total_probable_drift_error",
        fieldLabel:"Total Probable Drift Error",
        hidden:true 
};

var total_probable_pos_error_squared = {
        xtype:"textfield",
        id:"total_probable_pos_error_squared",
        name:"total_probable_pos_error_squared",
        fieldLabel:"Total Probable Error of Position Squared",
        hidden:true  
};

var total_probable_pos_error = {
        xtype:"textfield",
        id:"total_probable_pos_error",
        name:"total_probable_pos_error",
        fieldLabel:"Total Probable Error of Position",
        hidden:true  
};


var separation_ratio = {
        xtype:"textfield",
        id:"separation_ratio",
        name:"separation_ratio",
        fieldLabel:"Separation Ratio",
        hidden:true  
};


//HIDDENS FOR DIVERGENCE