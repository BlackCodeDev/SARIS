var datum_tabs = {
        xtype:"tabpanel",
        region: 'center',
        activeTab: 0,
        width:700,
        id:"datum_tabs",
        items:[ incident_tab,datum_definition_tab,datum_method_tab,average_surface_weather_tab,search_facilities_tab,total_effort_allocation_tab]
};

function show_datum_Window(){

        var datum_win = new Ext.Window({
                                id:'datum_win',
                                height:550,
                                autoWidth   : true,
                                items  : [datum_tabs],
                                buttons:[{
                                    xtype:"button",
                                    text:"Simulation",
                                    handler:function(){
                                        if(datum_mode=="POINT_DATUM")
                                            PointDatumProbMap(); 
                                        else
                                            LineDatumProbMap();
                                    }
                                },{
                                    xtype:"button",
                                    text:"Save"
                                }]
        });
    
        datum_win.show();
}