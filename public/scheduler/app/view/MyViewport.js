/*
 * File: app/view/MyViewport.js
 *
 * This file was generated by Sencha Architect version 3.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('MyApp.view.MyViewport', {
    extend: 'Ext.container.Viewport',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.View',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.grid.column.Number',
        'Ext.grid.column.Boolean'
    ],

    layout: 'border',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    region: 'center',
                    border: false,
                    constrain: true,
                    layout: 'border',
                    title: 'Jobs',
                    items: [
                        {
                            xtype: 'gridpanel',
                            region: 'center',
                            forceFit: true,
                            store: 'MyJsonStore',
                            viewConfig: {
                                autoScroll: false
                            },
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [
                                        {
                                            xtype: 'button',
                                            itemId: 'reload',
                                            text: 'Reload'
                                        },
                                        {
                                            xtype: 'button',
                                            itemId: 'new',
                                            text: 'New'
                                        },
                                        {
                                            xtype: 'button',
                                            itemId: 'delete',
                                            text: 'Delete'
                                        },
                                        {
                                            xtype: 'button',
                                            itemId: 'edit',
                                            text: 'Edit'
                                        },
                                        {
                                            xtype: 'button',
                                            itemId: 'run',
                                            text: 'Run'
                                        }
                                    ]
                                }
                            ],
                            columns: [
                                {
                                    xtype: 'numbercolumn',
                                    width: 35,
                                    dataIndex: 'id',
                                    menuDisabled: true,
                                    text: 'Id',
                                    format: '0'
                                },{
                                    xtype: 'booleancolumn',
                                    width: 35,
                                    dataIndex: 'active',
                                    menuDisabled: true,
                                    text: 'Active',
                                    format: '0'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 50,
                                    dataIndex: 'min',
                                    text: 'Min'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 50,
                                    dataIndex: 'hour',
                                    text: 'Hour'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 80,
                                    dataIndex: 'dayofmonth',
                                    text: 'Day of month'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 60,
                                    dataIndex: 'month',
                                    text: 'Month'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 75,
                                    dataIndex: 'dayofweek',
                                    text: 'Day of week'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 60,
                                    dataIndex: 'schema',
                                    menuDisabled: true,
                                    text: 'Schema'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'name',
                                    menuDisabled: true,
                                    text: 'Table'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'url',
                                    menuDisabled: true,
                                    text: 'Url'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 40,
                                    dataIndex: 'epsg',
                                    text: 'Epsg'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 90,
                                    dataIndex: 'type',
                                    text: 'Type'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 50,
                                    dataIndex: 'encoding',
                                    text: 'Encoding'
                                },
                                {
                                    xtype: 'booleancolumn',
                                    width: 80,
                                    dataIndex: 'lastcheck',
                                    text: 'Success on latest'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'lasttimestamp',
                                    text: 'Last success '
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'delete_append',
                                    text: 'Delete/append'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});