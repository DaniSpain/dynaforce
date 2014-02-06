/**
 * This class has the role of matcher between the field type and haow has to be represented on the Layout
 * @author Daniele Spagnuolo
 * @version 0.1
 * 
 */

/**
 * Get a view readable depending on the type of field
 * @param String field
 * @param String sobject
 * @param DataRow dataRow
 */
exports.readableField = function(field, sobject, dataRow) {
	//var field = layoutRow.fieldByName('field');
	//var sobject = layoutRow.fieldByName('sobject');
	
	//now we have to retrieve the type of the field on SFDC through the ObjectFieldMap table
	var db = Ti.Database.open(Alloy.Globals.dbName);
	Ti.API.info('[dynaforce] [contolManager] SELECT sfdctype FROM ObjectFieldMap WHERE field = \'' + field + '\' AND sobject = \'' + sobject + '\';');
	var rowset;
	//retireve the Salesforce field type from the ObjectFieldMap table
	try {
		rowset = db.execute('SELECT sfdctype FROM ObjectFieldMap WHERE field = \'' + field + '\' AND sobject = \'' + sobject + '\' LIMIT 1;');
	} catch (e) {
		Ti.API.error('[dynaforce] [contolManager] Exception retrieving field type: ' + e);
	}
	
	var type;
	if (rowset!=null) {
		type = rowset.fieldByName('sfdctype');
		Ti.API.info('[dynaforce] [contolManager] FOUNDED TYPE: ' + type);
		
		// CASE FIELD IS A string FIELD
		if (type=='string') {
			var label = Ti.UI.createLabel({
				color: '#900',
				font: { fontSize:20 },
				//shadowColor: '#aaa',
				//shadowOffset: {x:5, y:5},
				//shadowRadius: 3,
				text: dataRow.fieldByName(field),
				left: 10,
				touchEnabled: false,
				//top: 30,
				width: Ti.UI.SIZE, height: Ti.UI.SIZE
			});
			return label;
		}
		
		//CASE FIELD IS A picklist
		if (type=='picklist') {
			var label = Ti.UI.createLabel({
				color: '#000000',
				font: { fontSize:14 },
				//shadowColor: '#aaa',
				//shadowOffset: {x:5, y:5},
				//shadowRadius: 3,
				text: dataRow.fieldByName(field),
				left: 10,
				touchEnabled: false,
				//top: 30,
				width: Ti.UI.SIZE, height: Ti.UI.SIZE
			});
			return label;
		}
		
		//CASE FIELD IS A email
		if (type=='email') {
			var label = Ti.UI.createLabel({
				color: '#0099CC',
				font: { fontSize:14 },
				//shadowColor: '#aaa',
				//shadowOffset: {x:5, y:5},
				//shadowRadius: 3,
				text: dataRow.fieldByName(field),
				left: 10,
				touchEnabled: true,
				//top: 30,
				width: Ti.UI.SIZE, height: Ti.UI.SIZE
			});
			var emailDialog = Ti.UI.createEmailDialog();
			emailDialog.subject = "Hello from DaniSpain";
			emailDialog.toRecipients = [dataRow.fieldByName(field)];
			emailDialog.messageBody = '<b>Appcelerator Titanium Rocks!</b>';
			label.addEventListener('click', function(e) {
				emailDialog.open();
			});
			return label;
		}
		
		//CASE FIELD IS A DATE or DATE TIME
		if (type=='date' || type=='datetime') {
			var dateUtils = require('sfdcDate');
			var date = null;
			if (dataRow.fieldByName(field)!=null) 
				var date = new Date(dateUtils.getDateTimeObject(dataRow.fieldByName(field)));
				
			Ti.API.info('[dynaforce] LastModifiedDate: ' + date);
			var label = Ti.UI.createLabel({
				color: '#366E36',
				font: { fontSize:15},
				//shadowColor: '#aaa',
				//shadowOffset: {x:5, y:5},
				//shadowRadius: 3,
				text: date.toLocaleString(),
				left: 10,
				touchEnabled: false,
				//top: 30,
				width: Ti.UI.SIZE, height: Ti.UI.SIZE
			});
			return label;
		}
		
	}
	else Ti.API.error('[dynaforce] [contolManager] CANNOT FIND THE REQUESTED FIELD!');
	
	rowset.close();
	db.close();
	return null;
};
