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
 * @param Boolean withLabel says if the returned control is with label or not
 * @param String layoutTable the name of the layout table (ListLayout, DetailLayout, EditLayout)
 */
exports.readableField = function(field, sobject, dataRow, withLabel, layoutTable) {
	//var field = layoutRow.fieldByName('field');
	//var sobject = layoutRow.fieldByName('sobject');
	
	//now we have to retrieve the type of the field on SFDC through the ObjectFieldMap table
	var db = Ti.Database.open(Alloy.Globals.dbName);
	Ti.API.info('[dynaforce] [contolManager] SELECT sfdctype, label FROM ObjectFieldMap WHERE field = \'' + field + '\' AND sobject = \'' + sobject + '\';');
	var rowset;
	//retireve the Salesforce field type from the ObjectFieldMap table
	try {
		rowset = db.execute('SELECT sfdctype, label FROM ObjectFieldMap WHERE field = \'' + field + '\' AND sobject = \'' + sobject + '\' LIMIT 1;');
	} catch (e) {
		Ti.API.error('[dynaforce] [contolManager] Exception retrieving field type: ' + e);
	}
	
	var type;
	var fieldLabel;

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
			if (withLabel) {
				fieldLabel = rowset.fieldByName('label');
				Ti.API.info('[dynaforce] [contolManager] FOUNDED LABEL: ' + fieldLabel);
				return getFieldWithLabel(label, fieldLabel);
			} else return label;
		}
		
		// CASE FIELD IS A textarea FIELD
		if (type=='textarea') {
			var label = Ti.UI.createLabel({
				color: '#0099CC',
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
			if (withLabel) {
				fieldLabel = rowset.fieldByName('label');
				Ti.API.info('[dynaforce] [contolManager] FOUNDED LABEL: ' + fieldLabel);
				return getFieldWithLabel(label, fieldLabel);
			} else return label;
		}
		
		//CASE FIELD IS A picklist
		if (type=='picklist') {
			var label = Ti.UI.createLabel({
				color: '#000000',
				font: { fontSize:15, fontWeight: "bold" },
				//shadowColor: '#aaa',
				//shadowOffset: {x:5, y:5},
				//shadowRadius: 3,
				text: dataRow.fieldByName(field),
				left: 10,
				touchEnabled: false,
				//top: 30,
				width: Ti.UI.SIZE, height: Ti.UI.SIZE
			});
			if (withLabel) {
				fieldLabel = rowset.fieldByName('label');
				Ti.API.info('[dynaforce] [contolManager] FOUNDED LABEL: ' + fieldLabel);
				return getFieldWithLabel(label, fieldLabel);
			} else return label;
		}
		
		//CASE FIELD IS A email
		if (type=='email') {
			var label = Ti.UI.createLabel({
				color: '#0099CC',
				font: { fontSize:16 },
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
			if (withLabel) {
				fieldLabel = rowset.fieldByName('label');
				Ti.API.info('[dynaforce] [contolManager] FOUNDED LABEL: ' + fieldLabel);
				return getFieldWithLabel(label, fieldLabel);
			} else return label;
		}
		
		//CURRENCY
		if (type=='currency') {
			var label = Ti.UI.createLabel({
				color: '#669900',
				font: { fontSize:15 },
				//shadowColor: '#aaa',
				//shadowOffset: {x:5, y:5},
				//shadowRadius: 3,
				text: dataRow.fieldByName(field),
				left: 10,
				touchEnabled: false,
				//top: 30,
				width: Ti.UI.SIZE, height: Ti.UI.SIZE
			});
			if (withLabel) {
				fieldLabel = rowset.fieldByName('label');
				Ti.API.info('[dynaforce] [contolManager] FOUNDED LABEL: ' + fieldLabel);
				return getFieldWithLabel(label, fieldLabel);
			} else return label;
		}
		
		//CASE FIELD IS A DATE or DATE TIME
		if (type=='date' || type=='datetime') {
			var dateUtils = require('sfdcDate');
			var date = null;
			var strDate;
			if (dataRow.fieldByName(field)!=null) {
				var date = new Date(dateUtils.getDateTimeObject(dataRow.fieldByName(field)));
				strDate = date.toLocaleString();
			}
			else strDate = '';
				
			Ti.API.info('[dynaforce] Date field data: ' + date);
			var label = Ti.UI.createLabel({
				color: '#366E36',
				font: { fontSize:12},
				//shadowColor: '#aaa',
				//shadowOffset: {x:5, y:5},
				//shadowRadius: 3,
				text: strDate,
				left: 10,
				touchEnabled: false,
				//top: 30,
				width: Ti.UI.SIZE, height: Ti.UI.SIZE
			});
			if (withLabel) {
				fieldLabel = rowset.fieldByName('label');
				Ti.API.info('[dynaforce] [contolManager] FOUNDED LABEL: ' + fieldLabel);
				return getFieldWithLabel(label, fieldLabel);
			} else return label;
		}
		
		//CASE FIELD IS AN URL
		/*
		 * Here we have multiple possibilities:
		 * we could have a simple text or an image, a document or a web link
		 * We treat these conditions with the "rendering" filed on the Layout table
		 */
		if (type=='url') {
			
			Ti.API.info('[dynaforce] [contolManager] SELECT rendering FROM ' + layoutTable + ' WHERE field = \'' + field + '\' AND sobject = \'' + sobject + '\';');
			var layoutSet;
			//retireve the Salesforce field type from the ObjectFieldMap table
			try {
				layoutSet = db.execute('SELECT rendering FROM ' + layoutTable + ' WHERE field = \'' + field + '\' AND sobject = \'' + sobject + '\' LIMIT 1;');
			} catch (e) {
				Ti.API.error('[dynaforce] [contolManager] Exception retrieving field rendering type: ' + e);
			}
			var rendering = null;
			if (layoutSet!=null) {
				rendering = layoutSet.fieldByName('rendering');
				Ti.API.info('[dynaforce] [contolManager] RENDERING: ' + rendering);
				layoutSet.close();
			}
			
			if (rendering) {
				if (rendering=="image") {
					var control = Ti.UI.createImageView({
						left:10,
						width:70,
						height:70,
					});
					
					/*
					 * Getting the file, if the image has been already downloaded
					 */
					Ti.API.info("[dynaforce] Image name: " + dataRow.fieldByName('Id') + '.png');
					var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, dataRow.fieldByName("Id") + '.png');
					if (f) control.image = f.nativePath;


				}
				
				
			} else {
				var control = Ti.UI.createLabel({
					color: '#000000',
					font: { fontSize:15, fontWeight: "bold" },
					//shadowColor: '#aaa',
					//shadowOffset: {x:5, y:5},
					//shadowRadius: 3,
					text: dataRow.fieldByName(field),
					left: 10,
					touchEnabled: false,
					//top: 30,
					width: Ti.UI.SIZE, height: Ti.UI.SIZE
				});
			}
			if (withLabel) {
				fieldLabel = rowset.fieldByName('label');
				Ti.API.info('[dynaforce] [contolManager] FOUNDED LABEL: ' + fieldLabel);
				return getFieldWithLabel(control, fieldLabel);
			} else return control;
		}
		
		
	}
	else Ti.API.error('[dynaforce] [contolManager] CANNOT FIND THE REQUESTED FIELD!');
	
	rowset.close();
	db.close();
	return null;
};

function getFieldWithLabel(dataView, labelText) {
	var view = Titanium.UI.createView({
		left: 10,
		height: "100dp",
		width: "300dp",
		top: "10dp",
		layout: 'vertical',
		touchEnabled: false,
		horizontalWrap: true
	});
	var fieldLabelView = Ti.UI.createLabel({
		color: '#000000',
		font: { fontSize:12 },
		text: labelText,
		left: 10,
		touchEnabled: false,
		//top: 30,
		width: Ti.UI.SIZE, height: Ti.UI.SIZE
	});
	view.add(fieldLabelView);
	view.add(dataView);
	return view;
}

exports.editableField = function(field, sobject, dataRow) {};

exports.catalogView = function(dataRow) {
	var control = Ti.UI.createImageView({
		top: 10,
		width:200,
		height:200,
	});
					
	/*
	 * Getting the file, if the image has been already downloaded
	 */
	Ti.API.info("[dynaforce] Image name: " + dataRow.fieldByName('Id') + '.png');
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, dataRow.fieldByName("Id") + '.png');
	if (f) control.image = f.nativePath;
	
	return control;
};
