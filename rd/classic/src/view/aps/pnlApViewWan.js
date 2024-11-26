Ext.define('Rd.view.aps.pnlApViewWan', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlApViewWan',
    border  : false,
    frame   : false,
    layout  : {
        type        : 'fit'
    },
    store   : undefined,
  	requires    : [
        'Rd.view.aps.vcApViewWan',
        'Rd.view.aps.pnlApViewWanGraph'
    ],
    controller  : 'vcApViewWan',
    initComponent: function(){
        var me = this;
        
        var scale = 'medium';
        
        me.tbar  = [
            {   
                xtype   : 'button', 
                glyph   : Rd.config.icnReload , 
                scale   : scale, 
                itemId  : 'reload',   
                tooltip : i18n('sReload')
            },
            '|',
            {   
                xtype       : 'button', 
                text        : '15 Minutes',    
                toggleGroup : 'time_n', 
                enableToggle : true,
                scale       : scale, 
                itemId      : 'small', 
                pressed     : true
            },
            { 
                xtype       : 'button', 
                text        : '30 Minutes',   
                toggleGroup : 'time_n', 
                enableToggle : true, 
                scale       : scale, 
                itemId      : 'medium'
            },       
            { 
                xtype       : 'button', 
                text        : '1 Hour',     
                toggleGroup : 'time_n', 
                enableToggle : true, 
                scale       : scale, 
                itemId      : 'large'
            }         
        ];
            
        me.store = Ext.create('Ext.data.Store',{
            model: 'Rd.model.mDynamicPhoto',
            proxy: {
                type        :'ajax',
                url         : '/cake4/rd_cake/wan-reports/index-data-view.json',
                batchActions: true,
                format      : 'json',
                reader      : {
                    type        : 'json',
                    rootProperty: 'items'
                }
            },
            listeners: {
                load: function(store, records, successful) {
                    if(!successful){
                        Ext.ux.Toaster.msg(
                            'Error encountered',
                            store.getProxy().getReader().rawData.message.message,
                            Ext.ux.Constants.clsWarn,
                            Ext.ux.Constants.msgWarn
                        );
                    } 
                },
                scope: this
            },
            autoLoad: false
        });
        
        var tpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="dataview-item">',
                    '<h2 class="dataview-heading">',
                    '<tpl if="type==\'ethernet\'">',
        				'<div style="font-size:25px;color:#9999c7;text-align:left;padding-left:20px;padding-top:10px;"><i class="fa fa-sitemap"></i> {name} ',
        			'</tpl>',
        			'<tpl if="type==\'lte\'">',
        				'<div style="font-size:25px;color:#9999c7;text-align:left;padding-left:20px;padding-top:10px;"><i class="fa fa-signal"></i> {name} ',
        			'</tpl>',
        			'<tpl if="type==\'wifi\'">',
        				'<div style="font-size:25px;color:#9999c7;text-align:left;padding-left:20px;padding-top:10px;"><i class="fa fa-wifi"></i> {name} ',
        			'</tpl>',
                    '</h2>',
                '</div>',
            '</tpl>'
        );
        

        var v = Ext.create('Ext.view.View', {
            store       : me.store,
            multiSelect : true,
            tpl         : tpl,
            cls         : 'custom-dataview', // Apply the custom CSS class here
            itemSelector: 'div.dataview-item',
            itemId		: 'dvApViewWan',
            emptyText   : 'No WAN Stats Available'
        });
    
        me.items =  [
            {
                xtype       : 'panel',
                layout      : {
                    type    : 'hbox',         
                    align   : 'stretch'
                },
                items   : [{
                    xtype       : 'panel',
                    frame       : false,
                    height      : '100%', 
                    width       :  450,
                    itemId      : 'pnlForApViewWanView',
                    layout: {
                       type     : 'vbox',
                       align    : 'stretch'
                    },
                    items       : v,
                    autoScroll  : true
                },
                {
                    xtype       : 'pnlApViewWanGraph',
                    flex        : 1
                }]
            }
        ]   
                                   
        me.callParent(arguments);
    }
});
