var sea_current_direction = {
                                xtype:"textfield",
                                id:"seacurrent_direction",
                                name:"seacurrent_direction",
                                fieldLabel:"Direction",
                                value:57,
                                
                                
                            };
var sea_current_speed =     {
                                xtype:"textfield",
                                id:"seacurrent_speed",
                                name:"seacurrent_speed",
                                fieldLabel:"Speed",
                                value:1.86,
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
                                value:0.43
                              
                            };

var sea_current_info =      {
                                xtype: 'fieldset',
                                flex: 1,
                                layout: 'anchor',
                                defaults: {
                                    anchor: '100%',
                                    hideEmptyLabel: false
                                },
                                title:"Sea Current",
                                items:[sea_current_direction,sea_current_speed,sea_current_prob_error]
                            }
/*
Ext.onReady(function()
{
var d = Math.sqrt(parseFloat(Ext.getCmp("seacurrent_speed").getValue())/10);
Ext.getCmp.setValue(d);
});
*/