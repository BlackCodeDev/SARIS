var position_type = {
        xtype:"combo",
        valueField:"id",
        displayField:"label",
        id:"position_type",
        name:"position_type",
        store: new Ext.data.SimpleStore({
                                data:[["LKP", "Last Known Position"],["EIP", "Estimated Incident Position"],["PD","Previous Datum"]],
                                id: 0,
                                fields: ['id','label']
                            }),
        fieldLabel:"Type of Position",
        width:400
    };

var incident_date = {
        xtype:"datefield",
        format: 'd/m/Y',
        id:"incident_date",
        name:"incident_date",
        fieldLabel:"Incident Date",
        width:400,
        listeners:{
            change:function(){
                CalculateHoursDiff();
            }
        }
    };

var incident_time = {
        xtype:"timefield",
        id:"incident_time",
        name:"incident_time",
        fieldLabel:"Incident Time",
        format : 'H:i',
        width:400,
        listeners:{
            change:function(){
                CalculateHoursDiff();
            }
        }
    };

var commenced_date = {
        xtype:"datefield",
        format: 'd/m/Y',
        id:"commenced_date",
        name:"commenced_date",
        fieldLabel:" Commenced Date",
        width:400,
         listeners:{
            change:function(){
                CalculateHoursDiff();
            }
        }
    };

var commenced_time = {
        xtype:"timefield",
        id:"commenced_time",
        name:"commenced_time",
        fieldLabel:"Commenced Time",
        format : 'H:i',
        width:400,
        listeners:{
                change:function(){
                    CalculateHoursDiff();
                }
            }
        };

var drift_interval = {
        xtype:"textfield",
        id:"drift_interval",
        name:"drift_interval",
        fieldLabel:"Drift Interval (Hours)",
        width:400
    };

var drift_info = {
        xtype: 'fieldset',
        flex: 1,
        layout: 'anchor',
        defaults: {
            anchor: '100%',
            hideEmptyLabel: false
        },
        title:"<b>Drift Interval</b>",
        items:[position_type,incident_date,incident_time,commenced_date,commenced_time,drift_interval]
};

var datum_definition_tab = {
     title:"Datum",
     id:"datum_drift_tab",
     items:[
         {
          xtype: 'form',
          height   : 480,
          frame:true,
          items:[drift_info]
         }]
};

