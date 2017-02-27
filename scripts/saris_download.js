var download_form =  {
                xtype       : 'form',
                autoScroll  : true,
                id          : 'download_form',
                defaultType : 'field',
                frame       : true,
                method      :'POST',
                standardSubmit: true,
                title       : 'Download File',
                items       : [
                    {
                        fieldLabel:'File Name',
                        id:"download_form_filename",
                        name:"download_form_filename"
                    },

                    {
                        xtype:"hidden",
                        id:"kml_string",
                        name:"kml_string"
                    },

                ],
                
            buttons:[
                {
                    text:"OK",
                    handler:function(){

                        var filename = Ext.getCmp("download_form_filename").getValue();
                        var kml = Ext.getCmp("kml_string").getValue();
                        var downForm = Ext.getCmp("download_form");
                       
               
                        downForm.submit({
                            url: 'download.php',
                            success: function(form, action) {
                               //Ext.Msg.alert('Success', action.result.message);
                            },
                            failure: function(form, action) {
                                //Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
                            }
                        });
              
                    }
                }
            ]
    };
    
  

function showDownloadDialog(node){
      var download_form_window = new Ext.Window({
        id     : 'download_form_window',
        items  : [download_form]
    });
    
    var tree_node_layer = map.getLayer(node.data.id);
    var featuresExport = tree_node_layer.features
    var result = GetKMLFromFeatures(featuresExport);
    
    download_form_window.show();
    Ext.getCmp("kml_string").setValue(result);
   // var frm = Ext.getCmp("download_form_window");
                             
   
                             
}
    