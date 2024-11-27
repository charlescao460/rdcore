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
        
        var scale = 'large';
        
        me.tbar  = [{   
            xtype   : 'buttongroup',
            items   : [
               {   
                    xtype   : 'button', 
                    glyph   : Rd.config.icnReload , 
                    scale   : scale, 
                    itemId  : 'reload',   
                    tooltip : i18n('sReload')
                },
               // '|',
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
                    text        : '60 Minutes',     
                    toggleGroup : 'time_n', 
                    enableToggle : true, 
                    scale       : scale, 
                    itemId      : 'large'
                }
            ]
        }]
            
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
                '<div class="plain-wrap">',
                    '<div class="sub">',
                        '<tpl if="type==\'ethernet\'">',
                            '<div style="font-size:25px;color:#9999c7;text-align:left;padding-left:20px;padding-top:10px;"><i class="fa fa-sitemap"></i> {name} ',
                        '</tpl>',
                        '<tpl if="type==\'lte\'">',
                            '<div style="font-size:25px;color:#9999c7;text-align:left;padding-left:20px;padding-top:10px;"><i class="fa fa-signal"></i> {name} ',
                        '</tpl>',
                        '<tpl if="type==\'wifi\'">',
                            '<div style="font-size:25px;color:#9999c7;text-align:left;padding-left:20px;padding-top:10px;"><i class="fa fa-wifi"></i> {name} ',
                        '</tpl>',               			
                        '</div>',
                        '<tpl if="apply_sqm_profile">',
                            '<div style="padding-top:5px;"></div>',
                            '<div style="font-size:16px;color:blue;text-align:left;padding-left:20px;padding-top:3px;padding-bottom:3px;">',
		                        '<span style="font-family:FontAwesome;">&#xf00a</span>',
		                        '  {sqm_profile.name}',
	                        '</div>',				                			              
                        '</tpl>',
                        
                        '<div style="padding-top:10px;"></div>',
                        '<tpl if="status==\'online\'">',
		        	        '<div style="font-size:16px;color:green;text-align:left;padding-left:20px;padding-top:3px;padding-bottom:3px;">',
                				'<span style="font-family:FontAwesome;">&#xf111;</span>',
                				' Online for {[Ext.ux.formatDuration(values.online)]}',
                			'</div>',
                	    '</tpl>',
                	    '<tpl if="status==\'offline\'">',
		        	        '<div style="font-size:16px;color:orange;text-align:left;padding-left:20px;padding-top:3px;padding-bottom:3px;">',
                				'<span style="font-family:FontAwesome;">&#xf10c;</span>',
                				' Offline for {[Ext.ux.formatDuration(values.offline)]}',
                			'</div>',
                	    '</tpl>',
                	    '<tpl if="status==\'notracking\'">',
		        	        '<div style="font-size:16px;color:grey;text-align:left;padding-left:20px;padding-top:3px;padding-bottom:3px;">',
                				'<span style="font-family:FontAwesome;">&#xf1db;</span>',
                				' NO TRACKING',
                			'</div>',
                	    '</tpl>',               	 
	        	        '<div style="font-size:16px;color:grey;text-align:left;padding-left:20px;padding-top:3px;padding-bottom:3px;">',
            				'<span style="font-family:FontAwesome;">&#xf0c1;</span>',
            				'<i> Interface up for {[Ext.ux.formatDuration(values.uptime)]}</i>',
            			'</div>',                                                                                       
                    '</div>',			    	    			    	    			                				                		        					        	         	
                '</div>',
            '</tpl>'
        );
        
        var v = Ext.create('Ext.view.View', {
            store       : me.store,
            multiSelect : true,
            tpl         : tpl,
           // cls         : 'custom-dataview', // Apply the custom CSS class here
            itemSelector: 'div.plain-wrap',
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
