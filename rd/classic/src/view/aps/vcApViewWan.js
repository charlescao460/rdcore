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
        span            : 'hour', //hour, day, week
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
        }       
    },
    itemSelected: function(dv,record){
    	var me = this;
    	console.log("Item Selected");
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
                    console.log('Store reloaded successfully');
                    // Your callback code here
                    if(me.getSelectedId()){
                        console.log("Select EXISTING record "+me.getSelectedId());
                        var record = store.findRecord('id', me.getSelectedId());
                        me.updateGraph(record);
                       // me.getView().down('#dvApViewWan').getSelectionModel().select(record);
                    }else{
                        console.log("Select FIRST record "+me.getSelectedId());
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
        console.log("Update Graph")
      /*  var totals = record.get('totals');
        var graph  = record.get('graph_items');
        me.getView().down('#plrPackets').getStore().setData([
                { category: 'Processed Packets', count: totals.processed },
                { category: 'Dropped Packets', count: totals.drops }
        ]);
        if(graph){
           me.getView().down('#crtPackets').getStore().setData(graph);
         
        }*/
    }   
});
