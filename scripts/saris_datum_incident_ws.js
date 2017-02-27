var incident_name_control = {
        xtype:"textfield",
        id:"incident_name_control",
        name:"incident_name_control",
        fieldLabel:"Incident Name",
        width:400
};

var missing_object_name_control = {
        xtype:"textfield",
        id:"missing_object_name_control",
        name:"missing_object_name_control",
        fieldLabel:"Missing Object Name",
        width:400
};

var vessel_device_type_cmb =  {
        xtype: 'combo',
        width:400,
        id:"vessel_position_cmb",
        fieldLabel: 'Select Device',
        hiddenName: 'deviceType',
        store: new Ext.data.SimpleStore({
            data: vessel_position_devices_ds,
            id: 0,
            fields: ['device_id','device_error', 'device_type']
        }),
        valueField: 'device_id',
        displayField: 'device_type',
        triggerAction: 'all',
};

var vessel_vessel_type = {
        xtype: 'combo',
        width:400,
        id:"vessel_type_cmb",
        fieldLabel: 'Select Craft Type',
        hiddenName: 'craftType',
        store: new Ext.data.SimpleStore({
            data:vessel_types_ds,
            id: 0,
            fields: ['vsl_type_id','vsl_type_error','DR_error','vsl_type_name']
        }),

        valueField: 'vsl_type_id',
        displayField: 'vsl_type_name',
        triggerAction: 'all'                               
    };


var vessel_subtype = {
        xtype: 'combo',
        width:400,
        id:"vessel_subtype",
        fieldLabel: 'Select Craft Sub Type',
        hiddenName: 'craftSubType',
        store: new Ext.data.SimpleStore({
            data:vessel_sub_types_ds,
            id: 0,
            fields: ['vsl_subtype_id','GENERAL_TYPE','vsl_subtype_name','vsl_subtype_leeway_angle','vsl_subtype_leeway_errorKnots','vsl_case']
        }),

        valueField: 'vsl_subtype_id',
        displayField: 'vsl_subtype_name',
        triggerAction: 'all',
        listeners:{
            change:function(combo){
              value = combo.getValue();
              record = combo.findRecordByValue(value);

              if(record.data.GENERAL_TYPE == "RAFT"){
                  Ext.getCmp("persons_raft").show();
                  Ext.getCmp('vessel_length').setDisabled(true); 
              }
              else{
                    Ext.getCmp("persons_raft").hide();
                     Ext.getCmp('vessel_length').setDisabled(false); 
              }

                GetLeewayData();
            }
        }
};

var vessel_length = {
    xtype:"textfield",
    id:"vessel_length",
    name:"vessel_length",
    fieldLabel:"Craft Length",
    width:400
};

var persons_raft = {
    xtype:"textfield",
    hidden:true,
    id:"persons_raft",
    name:"persons_raft",
    fieldLabel:"Persons",
    width:400
};



var dr_options_control = {
    xtype: 'fieldcontainer',
    labelWidth: 100,
    layout: 'hbox',
    items: [{
                xtype: 'label',
                text: 'Dead Reckoning:',
            },
            {
                xtype: 'radio',
                id: 'yesDR',
                name: 'rbGroup',
                checked: false,
                hideLabel: false,
                labelSeparator: '',
                hideLabel: true,
                boxLabel: 'Yes',
                fieldLabel: 'Yes',
                style: 'margin-left: 10px',
                handler:function(){
                    var drD = Ext.getCmp("drDistance");
                    drD.setValue(null);
                    drD.hide();
                }
            }, 
            {
               xtype:"textfield",
               id:"drDistance",
               name:"drDistance",
               hidden : true,
               style:"margin-left:5px",
               "emptyText":"DR in Nautical Miles"
            },
            {
                xtype: 'radio',
                text:'No',
                id: 'noDR',
                name: 'rbGroup',
                checked: true,
                hideLabel: true,
                boxLabel: 'No',
                fieldLabel: 'No',
                style: 'margin-left: 10px',
                handler:function(){
                    var drD = Ext.getCmp("drDistance");
                    drD.setValue(null);
                    drD.show();
                }
            }]
    };


var incident_form_panel = {
        xtype       : 'form',
         height   : 480,
        autoWidth   : true,
        autoScroll  : true,
        id          : 'incident_form_panel',
        layout:'anchor',
        defaultType : 'field',
        frame       : true,
        title       : 'Incident',
        items       :[incident_name_control,missing_object_name_control,vessel_device_type_cmb,vessel_vessel_type,vessel_subtype,persons_raft,vessel_length,dr_options_control],

};


var incident_tab = {
     title:"Incident Data",
     id:"incident_tab",
     items: [incident_form_panel]
}