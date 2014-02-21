var args = arguments[0] || {};



//this value will be passed from the parent screen
var sobject = args['sobject'];
Ti.API.info('[dynaforce] PASSED SOBJECT: ' + sobject);



var db = Ti.Database.open(Alloy.Globals.dbName);


Ti.API.info('[dynaforce] Fetching list fields');
try {
	var fieldset = db.execute('SELECT * FROM ListLayout WHERE sobject = "' + sobject + '" ORDER BY position ASC; ');
} catch(e) {
	Ti.API.error('[dynaforce] Exception fetching list field for ' + sobject + ': ' + e);
}

var row=0;
var fieldList = [];

controlmanager = require('controlManager');

while (fieldset.isValidRow()) {
	Ti.API.info('[dynaforce] LIST LAYOUT ROW[' + row + '] POSITION: ' + fieldset.fieldByName('position'));
	Ti.API.info('[dynaforce] LIST LAYOUT ROW[' + row + '] FIELD: ' + fieldset.fieldByName('field'));
	Ti.API.info('[dynaforce] LIST LAYOUT ROW[' + row + '] SOBJECT: ' + fieldset.fieldByName('sobject'));
	Ti.API.info('[dynaforce] LIST LAYOUT ROW[' + row + '] RENDERING: ' + fieldset.fieldByName('rendering'));
	row++;
	var fieldName = fieldset.fieldByName('field');
	fieldList.push(fieldName);
	fieldset.next();
}
fieldset.close();

var selectList = 'Id,';
for (var i=0; i<fieldList.length; i++) {
	selectList += fieldList[i];
	if (i!=fieldList.length-1) selectList += ',';
}
Ti.API.info('[dynaforce] Query: ' + selectList);
Ti.API.info('[dynaforce] Query: SELECT ' + selectList + ' FROM ' + sobject);
try {
	var rowset = db.execute('SELECT ' + selectList + ' FROM ' + sobject);
} catch(e) {
	Ti.API.error('[dynaforce] Error queryng ' + sobject + ' data: ' + e);
}

var tableData = [];

while (rowset.isValidRow()) {
	//Ti.API.info('[dynaforce] LAST MODIFIED DATE: ' + rowset.getFieldByName('LastModifiedDate'));
	var row = Ti.UI.createTableViewRow({
	    className:'listRow', // used to improve table performance on Android
	    selectedBackgroundColor:'#c6eaf7',
	    rowId:rowset.fieldByName('Id'), // custom property, useful for determining the row during events
	    //rowId:'Pippo', 
	    height:Ti.UI.SIZE,
		backgroundColor: '#ffffff',
		touchEnabled: true
	});
	
	var view = Titanium.UI.createView({
	  	left: 0,
		height: "100dp",
		width: Ti.UI.FILL,
		top: "10dp",
		layout: 'vertical',
		touchEnabled: false
	});
	
	for (var i=0; i<fieldList.length; i++) {
		var fieldControl = controlmanager.readableField(fieldList[i], sobject, rowset, false, Alloy.Globals.dynaforce.LIST_LAYOUT_TABLE);
		if (fieldControl!=null)
			view.add(fieldControl);
	}
	row.add(view);
	tableData.push(row);
	//$.tblView.appendRow(row);
	rowset.next();
}

$.tblView.setData(tableData);

rowset.close();

					

db.close();

$.list.open();

function closeWindow(e) {
	$.list.close();
}

$.list.addEventListener('close', function() {
    $.destroy();
});

$.tblView.addEventListener('longpress', function(e){
  alert('Long pressed ' + e.rowData.rowId);
});

$.tblView.addEventListener('click', function(e){
  	//alert('Clicked ' + e.rowData.rowId);
  	var detailView = Alloy.createController('detail', {sobject: sobject, id: e.rowData.rowId}).getView();
	detailView.open();
});
