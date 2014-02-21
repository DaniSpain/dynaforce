var args = arguments[0] || {};

function closeWindow(e) {
	$.detail.close();
}

//this value will be passed from the parent screen
var sobject = args['sobject'];
var id = args['id'];

Ti.API.info('[dynaforce] [detail] PASSED SOBJECT: ' + sobject);
Ti.API.info('[dynaforce] [detail] PASSED ID: ' + id);


var db = Ti.Database.open(Alloy.Globals.dbName);


Ti.API.info('[dynaforce] Fetching detail fields');
try {
	var fieldset = db.execute('SELECT * FROM DetailLayout WHERE sobject = "' + sobject + '" ORDER BY position ASC; ');
} catch(e) {
	Ti.API.error('[dynaforce] Exception fetching detail field for ' + sobject + ': ' + e);
}

var row=0;
var fieldList = [];

controlmanager = require('controlManager');

while (fieldset.isValidRow()) {
	Ti.API.info('[dynaforce] DETAIL LAYOUT ROW[' + row + '] POSITION: ' + fieldset.fieldByName('position'));
	Ti.API.info('[dynaforce] DETAIL LAYOUT ROW[' + row + '] FIELD: ' + fieldset.fieldByName('field'));
	Ti.API.info('[dynaforce] DETAIL LAYOUT ROW[' + row + '] SOBJECT: ' + fieldset.fieldByName('sobject'));
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
Ti.API.info('[dynaforce] Query: SELECT ' + selectList + ' FROM ' + sobject + ' WHERE Id=' + '"' + id + '"');
try {
	var rowset = db.execute('SELECT ' + selectList + ' FROM ' + sobject + ' WHERE Id=' + '"' + id + '"');
} catch(e) {
	Ti.API.error('[dynaforce] Error queryng ' + sobject + ' data: ' + e);
}



if (rowset) {
	while (rowset.isValidRow()) {
		
		for (var i=0; i<fieldList.length; i++) {
			var fieldControl = controlmanager.readableField(fieldList[i], sobject, rowset, true, Alloy.Globals.dynaforce.DETAIL_LAYOUT_TABLE);
			if (fieldControl!=null) {
				$.container.add(fieldControl);
			}
		}
		//row.add(view);
		//tableData.push(row);
		//$.tblView.appendRow(row);
		rowset.next();
	}
	
	rowset.close();
}
					

db.close();

$.detail.open();

