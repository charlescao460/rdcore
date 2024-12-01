Ext.define('Rd.view.aps.vcApViewWan', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcApViewWan',
    init    : function() {
    	var me = this;   
    	var dd = Rd.getApplication().getDashboardData();
    	//Set root to use later in the app in order to set 'for_system' (root)
        me.root    = false;
        if(dd.isRootUser){
            me.root = true;   
        }  
    },
    config: {
        span            : 'small', //small, medium, large
        selectedId      : null,
    }, 
    control: {
        'pnlApViewWan' : {
            activate : 'onActivate'
        },
    	'pnlApViewWan #reload': {
            click   : 'reload'
        },
        'pnlApViewWan #small':{
            click: 'onClickSmallButton'
        },
        'pnlApViewWan #medium':{
            click: 'onClickMediumButton'
        },
        'pnlApViewWan #large':{
            click: 'onClickLargeButton'
        },
        'pnlApViewWan #dvApViewWan' : {
        //	itemclick	: 'itemSelected',
        	select	    : 'itemSelected'
        },
        'pnlApViewWan #btnData':{
            click: 'btnDataClick'
        },
        'pnlApViewWan #btnLte':{
            click: 'btnLteClick'
        },
        'pnlApViewWan #btnWifi':{
            click: 'btnWifiClick'
        }       
    },
    itemSelected: function(dv,record){
    	var me = this;
    	me.setSelectedId(record.get('id'));
    	me.updateGraph(record);	
    },
    onActivate: function(){
        var me = this;
        me.reload();
    },
    reload: function(){
        var me = this;
        var dd      = Ext.getApplication().getDashboardData();
        var tz_id   = dd.user.timezone_id; 
        var store   = me.getView().down('#dvApViewWan').getStore();
        store.getProxy().setExtraParams({ap_id: me.getView().apId, span : me.getSpan(), timezone_id:tz_id });
        store.reload({
            callback: function(records, operation, success) {
                if (success) {
                    // Your callback code here
                    if(me.getSelectedId()){
                        var record = store.findRecord('id', me.getSelectedId());
                        me.updateGraph(record);
                       // me.getView().down('#dvApViewWan').getSelectionModel().select(record);
                    }else{
                        me.getView().down('#dvApViewWan').getSelectionModel().select(0);
                    }                   
                } else {
                    console.log('Store reload failed');
                    // Error handling code here
                }
            }
        });

    },
    onClickSmallButton : function(button){
        var me = this;
        me.setSpan('small');
        me.reload();
    },
    onClickMediumButton : function(button){
        var me = this;
        me.setSpan('medium');
        me.reload();
    },
    onClickLargeButton : function(button){
        var me = this;
        me.setSpan('large');
        me.reload();
    },
    updateGraph: function(record){
        var me = this;
        var type    = record.get('type');
        if(type == 'ethernet'){
            if(me.getView().down('#btnWifi').pressed){
                me.getView().down('#btnData').setPressed();
            }
            if(me.getView().down('#btnLte').pressed){
                me.getView().down('#btnData').setPressed();
            }
            me.getView().down('#pnlApViewWanGraph').show();
            me.getView().down('#pnlApViewWanLte').hide();
            me.getView().down('#pnlApViewWanWifi').hide();
            me.getView().down('#btnLte').disable();
            me.getView().down('#btnWifi').disable();           
        }
        
        if(type == 'lte'){
            if(me.getView().down('#btnWifi').pressed){
                me.getView().down('#btnData').setPressed();
                me.getView().down('#pnlApViewWanGraph').show();
                me.getView().down('#pnlApViewWanLte').hide();
            }
            me.getView().down('#btnLte').enable();
            me.getView().down('#btnWifi').disable();
            me.getView().down('#pnlApViewWanWifi').hide();                    
        }
        
         if(type == 'wifi'){
            if(me.getView().down('#btnLte').pressed){
                me.getView().down('#btnData').setPressed();
                me.getView().down('#pnlApViewWanGraph').show();
            }
            me.getView().down('#btnWifi').enable();
            me.getView().down('#pnlApViewWanLte').hide();
            me.getView().down('#btnLte').disable();           
        }
              
        var totals  = record.get('traffic_totals');
        var graph   = record.get('graph_traffic_items');
        var lte     = record.get('graph_lte_items'); 
        var wifi    = record.get('graph_wifi_items');       
        
        if(totals){
            me.getView().down('#pnlTraffic').setData(totals);
        }
        
        if(graph){
           me.getView().down('#crtTraffic').getStore().setData(graph);       
        }
        
        if(lte){
            me.getView().down('#crtLte').getStore().setData(lte);             
            var first_lte_record = record.get('lte_first_signal');  
            if(first_lte_record.mcc){        
                me.getView().down('pnlLteSignal').updateGui(first_lte_record.gui); 
                me.getView().down('pnlLteSignal').setTitle(first_lte_record.time_unit);
            }  
        }
        
        if(wifi){
            me.getView().down('#crtWifi').getStore().setData(wifi);             
            var first_wifi_record = record.get('wifi_first_signal');  
            if(first_wifi_record.ssid){        
                me.getView().down('pnlWifiSignal').updateGuiFromData(first_wifi_record); 
                me.getView().down('pnlWifiSignal').setTitle(first_wifi_record.time_unit);
            }  
        }
        
    },
    btnDataClick : function(btn){
        var me = this;
        me.getView().down('#pnlApViewWanGraph').show();
        me.getView().down('#pnlApViewWanLte').hide();
        me.getView().down('#pnlApViewWanWifi').hide();    
    },
    btnLteClick : function(btn){
        var me = this;
        me.getView().down('#pnlApViewWanGraph').hide();
        me.getView().down('#pnlApViewWanWifi').hide(); 
        me.getView().down('#pnlApViewWanLte').show();   
    },
    btnWifiClick : function(btn){
        var me = this;
        me.getView().down('#pnlApViewWanGraph').hide();
        me.getView().down('#pnlApViewWanLte').hide();
        me.getView().down('#pnlApViewWanWifi').show();      
    }
});
