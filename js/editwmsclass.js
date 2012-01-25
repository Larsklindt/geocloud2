Ext.namespace('wmsClasses');
wmsClasses.init = function (record) {
	wmsClasses.table = record.get("_key_");
    wmsClasses.reader = new Ext.data.JsonReader({
        totalProperty: 'total',
        successProperty: 'success',
        idProperty: 'id',
        root: 'data',
        messageProperty: 'message'
    }, [{
        name: 'id'
    }, {
        name: 'name'
    }, {
        name: 'expression'
    }]);
    wmsClasses.writer = new Ext.data.JsonWriter({
        writeAllFields: false,
        encode: false
    });
    wmsClasses.proxy = new Ext.data.HttpProxy({
        api: {
            read: '/controller/classes/' + screenName + '/getall/' + wmsClasses.table,
            create: '/controller/classes/' + screenName + '/createcolumn/' + wmsClasses.table,
            destroy: '/controller/classes/' + screenName + '/destroy/' + wmsClasses.table
        },
        listeners: {
            //write: wmsClasses.onWrite,
            exception: function (proxy, type, action, options, response, arg) {
                if (type === 'remote') { // success is false
                    //alert(response.message);
                    message = "<p>Sorry, but something went wrong. The whole transaction is rolled back. Try to correct the problem and hit save again. You can look at the error below, maybe it will give you a hint about what's wrong</p><br/><textarea rows=5' cols='31'>" + response.message + "</textarea>";
                    Ext.MessageBox.show({
                        title: 'Failure',
                        msg: message,
                        buttons: Ext.MessageBox.OK,
                        width: 400,
                        height: 300,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            }
        }
    });
    wmsClasses.store = new Ext.data.Store({
        writer: wmsClasses.writer,
        reader: wmsClasses.reader,
        proxy: wmsClasses.proxy,
        autoSave: true
    });
    wmsClasses.store.load();
    wmsClasses.grid = new Ext.grid.EditorGridPanel({
		region: 'center',
        iconCls: 'silk-grid',
        store: wmsClasses.store,
        height: 200,
        viewConfig: {
            forceFit: true
        },
        region: 'center',
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        cm: new Ext.grid.ColumnModel({
            defaults: {
                sortable: true,
                editor: {
                    xtype: "textfield"
                }
            },
            columns: [{
                id: "name",
                header: "Name",
                dataIndex: "name",
                sortable: true
                },{
                id: "expression",
                header: "Expression",
                dataIndex: "expression",
                sortable: true
                }]
        }),
        tbar: [{
            text: 'Delete',
            iconCls: 'silk-delete',
            handler: wmsClasses.onDelete
        }, {
            text: 'Add',
            iconCls: 'silk-add',
            handler: wmsClasses.onAdd
        }],
        listeners: {
            rowdblclick: onSelectClass
        }
    });
};
wmsClasses.onAdd = function () {
    var requestCg = {
                    url: '/controller/classes/' + screenName + '/insert/' + wmsClasses.table,
                    method: 'post',
                    callback: function (options, success, http) {
                        var response = eval('(' + http.responseText + ')');
                        wmsClasses.store.load();
                    }
                };
                Ext.Ajax.request(requestCg);		
	};
wmsClasses.onDelete = function () {
    var record = wmsClasses.grid.getSelectionModel().getSelected();
    if (!record) {
        return false;
    }
    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function (btn) {
        if (btn === "yes") {
            wmsClasses.grid.store.remove(record);
			wmsClasses.store.load();
        } else {
            return false;
        }
    });
};

wmsClasses.onSave = function () {
    wmsClasses.store.save();
};
wmsClasses.onWrite = function (store, action, result, transaction, rs) {
    //console.log('onwrite', store, action, result, transaction, rs);
    if (transaction.success) {
        wmsClasses.store.load();
    }
};

function test() {
    message = "<p>Sorry, but something went wrong. The whole transaction is rolled back. Try to correct the problem and hit save again. You can look at the error below, maybe it will give you a hint about what's wrong</p><br/><textarea rows=5' cols='31'>" + response.message + "</textarea>";
    Ext.MessageBox.show({
        title: 'Failure',
        msg: message,
        buttons: Ext.MessageBox.OK,
        width: 400,
        height: 300,
        icon: Ext.MessageBox.ERROR
    });
}
Ext.namespace('wmsClass');
wmsClass.init = function (id) {
	wmsClass.classId = id; 
    wmsClass.store = new Ext.data.JsonStore({
        // store config
        autoLoad: true,
        url: '/controller/classes/' + screenName + '/get/' + wmsClasses.table + '/' + id,
        baseParams: {
            xaction: 'read'
        },
        storeId: 'configStore',
        // reader config
        successProperty: 'success',
        //idProperty: 'id',
        root: 'data',
        //fields: 'fields',
        fields: [{
            name: 'name'
        }, {
            name: 'expression'
        }, {
            name: 'label'
        }, {
            name: 'color'
        }, {
            name: 'outlinecolor'
        }, {
            name: 'symbol'
        }, {
            name: 'size'
        }, {
            name: 'width'
        }, {
            name: 'label_size'
        }],
        listeners: {
            load: {
                fn: function (store, records, options) {
                    // get the property grid component
                    var propGrid = Ext.getCmp('propGrid');
                    // make sure the property grid exists
                    if (propGrid) {
                        // populate the property grid with store data
                        propGrid.setSource(store.getAt(0).data);
                    }
                }
            }
        }
    });
    wmsClass.grid = new Ext.grid.PropertyGrid({
        id: 'propGrid',
        width: 462,
        autoHeight: true,
        modal: false,
        region: 'center',
        propertyNames: {
            name: 'Name',
            size: 'Symbol size',
            label_size: 'Label size',
            width: 'Line width'
        },
		customEditors: {
        'color': new Ext.grid.GridEditor(new Ext.form.ColorField({
        }), {}),
        'outlinecolor': new Ext.grid.GridEditor(new Ext.form.ColorField({
        }), {}),
        'symbol': new Ext.grid.GridEditor(new Ext.form.ComboBox({
            store: ['','circle', 'square', 'triangle','hatch1','dashed1'],
            editable: false,
            triggerAction: 'all'
        }), {}),
        'size': new Ext.grid.GridEditor(new Ext.form.NumberField({
        		decimalPrecision:0,
        		decimalSeparator:'¤'// Some strange char nobody is using							
        		}),{}),
		'width': new Ext.grid.GridEditor(new Ext.form.NumberField({
        		decimalPrecision:0,
        		decimalSeparator:'¤'// Some strange char nobody is using							
        		}),{}),
		'label_size': new Ext.grid.GridEditor(new Ext.form.NumberField({
        		decimalPrecision:0,
        		decimalSeparator:'¤'// Some strange char nobody is using							
        		}),{})
    },
        viewConfig: {
            forceFit: true,
            scrollOffset: 2 // the grid will never have scrollbars
        },
        tbar: [{
            text: 'Update',
            iconCls: 'silk-accept',
            handler: function () {
                var grid = Ext.getCmp("propGrid");
                var id = Ext.getCmp("configStore");
                var source = grid.getSource();
                //source.id  = wmsClass.classId;
                //var jsonDataStr = null;
                //jsonDataStr = Ext.encode(source);
				var param = {
                            data: source
                        };
				param = Ext.util.JSON.encode(param);
                
                var requestCg = {
                    url: '/controller/classes/' + screenName + '/update/' + wmsClasses.table + '/' + wmsClass.classId,
                    params: param,
					headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                    callback: function (options, success, http) {
                        var response = eval('(' + http.responseText + ')');
						wmsClasses.store.load();
                        wmsClasses.onSubmit(response);
                    }
                };
                Ext.Ajax.request(requestCg);
            }
        }]
    });
};

function onSelectClass(btn, ev) {
    var record = wmsClasses.grid.getSelectionModel().getSelected();
    if (!record) {
        Ext.MessageBox.show({
            title: 'Hi',
            msg: 'You\'ve to select a layer',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO
        });
        return false;
    }
    wmsClass.grid = null;
    winClass = null;
    wmsClass.init(record.get("id"));
    winClass = new Ext.Window({
        title: "Edit class",
        modal: true,
        layout: 'fit',
        width: 500,
        height: 400,
        closeAction: 'close',
        plain: true,
        items: [
        new Ext.Panel({
            frame: false,
            width: 500,
            height: 400,
            layout: 'border',
            items: [wmsClass.grid]
        })]
    });
    winClass.show(this);
}
wmsClasses.onSubmit = function (response) {
        if (response.success) {
			Ext.MessageBox.show({
                        title: 'Success!',
                        msg: 'The style is updated',
                        buttons: Ext.MessageBox.OK,
                        width: 300,
                        height: 300
                    });

        } else {
            message = "<p>Sorry, but something went wrong. The whole transaction is rolled back. Try to correct the problem and hit save again. You can look at the error below, maybe it will give you a hint about what's wrong</p><br/><textarea rows=5' cols='31'>" + result.message + "</textarea>";
                    Ext.MessageBox.show({
                        title: 'Failure',
                        msg: message,
                        buttons: Ext.MessageBox.OK,
                        width: 300,
                        height: 300
                    });
        }
    };