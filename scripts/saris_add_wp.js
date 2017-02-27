var add_waypoints_form = {           
        xtype       : 'form',
        height      : 170,
        autoScroll  : true,
        id          : 'map_user_waypoints_form',
        defaultType : 'field',
        
        frame       : true,
        title       : 'Load File',
        items       : [{
                        xtype: 'fileuploadfield',
                        id: 'wp_fileuplod_control',
                        name: 'file',
                        width : 270,
                        emptyText: 'Select csv file to upload...',
                        buttonText: 'Browse'
                        }],
        buttons:[{
                    text:"OK",
                    handler:function(){
                        
                        var wpForm = Ext.getCmp("map_user_waypoints_form");
                        
                        if(wpForm.isValid()){
                            
                            wpForm.submit({
                            url: 'modules/wp_files.php',
                            waitMsg: 'Uploading your file...',
                            success: function (f, a) {
                                        
                                          var result = a.result, data = result.data,
                                          name = data.name, size = data.size,
                                          message = Ext.String.format('<b>Message:</b> {0}<br>' +
                                            '<b>FileName:</b> {1}<br>' +
                                            '<b>FileSize:</b> {2}<br/>' +
                                            '<b>line:</b> {3}</br>',                         
                                            result.msg, name, size,result.line);
                                            
                                            console.log(result.line);
                                
                                            parseWKTGeom(result.line,function(lineString){
                                                Ext.Msg.alert('Route Length', lineString.getLength().toFixed(2) + " meters");
                                            });
                                            
                                           // Ext.Msg.alert('Success', message);
                            },
                            failure: function (f, a) {
                              Ext.Msg.alert('Failure', a.result.msg);
                            }
                      });
                            
                    }
                }
            }]       
};

var add_waypoints_window = new Ext.Window({
        id     : 'map_add_waypoints_form_window',
        width  : 300,
        items  : [add_waypoints_form]
    });



function addWaypoints(){
    add_waypoints_window.show();
}
    