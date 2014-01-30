var args = arguments[0] || {};



//this value will be passed from the parent screen
var sobject = args['sobject'];
Ti.API.info('[dynaforce] PASSED SOBJECT: ' + sobject);


$.list.open();


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

//var tableData = [];

while (rowset.isValidRow()) {
	var row = Ti.UI.createTableViewRow({
	    className:'forumEvent', // used to improve table performance
	    selectedBackgroundColor:'white',
	    rowId:rowset.fieldByName('Id'), // custom property, useful for determining the row during events
	    height:Ti.UI.SIZE
	});
	
	var view = Titanium.UI.createView({
	  	left: "10dp",
		height: "100dp",
		width: "280dp",
		top: "10dp",
		layout: 'vertical'
	});
	
	for (var i=0; i<fieldList.length; i++) {
		var fieldControl = controlmanager.readableField(fieldList[i], sobject, rowset);
		if (fieldControl!=null)
			view.add(fieldControl);
	}
	row.add(view);
	$.tblView.appendRow(row);
	rowset.next();
}

rowset.close();

					

db.close();


function closeWindow(e) {
	$.list.close();
}

$.list.addEventListener('close', function() {
    $.destroy();
});
