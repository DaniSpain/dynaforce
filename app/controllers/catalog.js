var args = arguments[0] || {};

function closeWindow(e) {
	$.catalog.close();
}

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
var c = 0;
var view;
while (rowset.isValidRow()) {
	//Ti.API.info('[dynaforce] LAST MODIFIED DATE: ' + rowset.getFieldByName('LastModifiedDate'));
	
	
	

	var fieldControl = controlmanager.catalogView(rowset);
	
	if (c % 2 == 0) {
		//it means that we are starting a new 1x2 panel
		view = Titanium.UI.createView({
		  	left: "10dp",
		  	rowId:rowset.fieldByName('Id'),
			height: Ti.UI.FILL,
			width: 300,
			top: "10dp",
			bottom: "10dp",
			layout: 'vertical',
			touchEnabled: false,
			horizontalWrap: true
		});
		$.scroller.add(view);
	}
	
	if (fieldControl!=null) view.add(fieldControl);
	c++;
	rowset.next();
}


rowset.close();

					

db.close();
$.catalog.open();
