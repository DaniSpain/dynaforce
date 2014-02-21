/**
 * THIS IS DYNAFORCE!
 * @author Daniele Spagnuolo
 * @version 1.0
 */


var LAST_SYNC = Ti.App.Properties.getString('dynaforce.lastSync');

exports.LIST_LAYOUT_TABLE = "ListLayout";
exports.DETAIL_LAYOUT_TABLE = "DetailLayout";

exports.RELATIONSHIP_TABLE = "Relationship";

var JSONImages = new Array();
/*
 * creates a map between the SFDC data types and SQLite data types
 * In exception of:
 * 		- reference
 * 		- picklist
 * They are managed 
 */
var SFDCSQLiteFieldMap = {
	//'id' : 'CHARACTER(20) PRIMARY KEY',
	'string': 'TEXT',
	'boolean': 'BOOLEAN',
	'textarea': 'TEXT',
	'double': 'DOUBLE',
	'phone': 'TEXT',
	'url': 'TEXT',
	'currency': 'DOUBLE',
	'int': 'INTEGER',
	'datetime': 'DATETIME',
	'date': 'DATE',
	'picklist': 'TEXT',
	'email': 'TEXT',
	'reference': 'TEXT'
};

/*
 * We use this JSON to track the synchronization process
 */
var sobjectSync = [
{
	sobject: 'Account',
	synched: false,
},
{
	sobject: 'Contact',
	synched: false,
},
{
	sobject: 'Product__c',
	synched: false,
}
];

exports.init = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);

	Ti.API.info('[dynaforce] CREATE TABLE IF NOT EXISTS ObjectFieldMap ' + 
			'(field TEXT, sfdctype TEXT, sobject TEXT, label TEXT, isUsed BOOLEAN, ' + 
			' PRIMARY KEY(field, sobject));');				
	try {
		//create field map table
		db.execute('CREATE TABLE IF NOT EXISTS ObjectFieldMap ' + 
			'(field TEXT, sfdctype TEXT, sobject TEXT, label TEXT, isUsed BOOLEAN, ' + 
			' PRIMARY KEY(field, sobject));'
		);
		//db.execute('CREATE UNIQUE INDEX IF NOT EXISTS ObjectFieldMap_idx ON ObjectFieldMap(field, sobject);');
		Ti.API.info('[dynaforce] Table ObjectFieldMap SUCCESSFULLY CREATED');
	} catch (e) {
		Ti.API.error('[dynaforce] Exception creating ObjectFieldMap table: ' + e);	
	}
	
	Ti.API.info('[dynaforce] CREATE TABLE IF NOT EXISTS Picklist(value TEXT, field TEXT, sobject TEXT, label TEXT, ' + 
			' PRIMARY KEY(field, sobject));');
	try {
		//create picklist table
		db.execute('CREATE TABLE IF NOT EXISTS Picklist(value TEXT, field TEXT, sobject TEXT, label TEXT, ' + 
			' PRIMARY KEY(field, sobject));'
		);
		//db.execute('CREATE UNIQUE INDEX IF NOT EXISTS Picklist_idx ON Picklist(value, field, sobject);');
		Ti.API.info('[dynaforce] Table Picklist SUCCESSFULLY CREATED');
	} catch (e) {
		Ti.API.error('[dynaforce] Exception creating Picklist table: ' + e);	
	}
	
	Ti.API.info('[dynaforce] CREATE TABLE IF NOT EXISTS DetailLayout(position TINYINT, field TEXT, sobject TEXT, rendering TEXT, ' + 
			' PRIMARY KEY(position, sobject) ON CONFLICT REPLACE);');				
	try {
		//create detail layout table
		db.execute('DROP TABLE IF EXISTS DetailLayout');
		db.execute('CREATE TABLE IF NOT EXISTS DetailLayout(position TINYINT, field TEXT, sobject TEXT, rendering TEXT, ' + 
			' PRIMARY KEY(position, sobject));'
		);
		//db.execute('CREATE UNIQUE INDEX IF NOT EXISTS DetailLayout_idx ON DetailLayout(position, field, sobject);');
		Ti.API.info('[dynaforce] Table DetailLayout SUCCESSFULLY CREATED');
	} catch (e) {
		Ti.API.error('[dynaforce] Exception creating DetailLayout table: ' + e);	
	}
	
	Ti.API.info('[dynaforce] CREATE TABLE IF NOT EXISTS ListLayout(position TINYINT, field TEXT, sobject TEXT, ' + 
			' PRIMARY KEY(position, sobject));');			
	try {
		//create list layout table
		db.execute('DROP TABLE IF EXISTS ListLayout');
		db.execute('CREATE TABLE IF NOT EXISTS ListLayout(position TINYINT, field TEXT, sobject TEXT, rendering TEXT, ' + 
			' PRIMARY KEY(position, sobject));'
		);
		//db.execute('CREATE UNIQUE INDEX IF NOT EXISTS ListLayout_idx ON ListLayout(position,field, sobject);');
		Ti.API.info('[dynaforce] Table ListLayout SUCCESSFULLY CREATED');
	} catch (e) {
		Ti.API.error('[dynaforce] Exception creating ListLayout table: ' + e);	
	}
	
	/*
	Ti.API.info('[dynaforce] REATE TABLE IF NOT EXISTS EditLayout(id INTEGER PRIMARY KEY AUTOINCREMENT, position TINYINT, field TEXT, sobject TEXT, ' + 
			' UNIQUE(position, sobject) ON CONFLICT REPLACE);');				
	try {
		//create edit layout table
		db.execute('DROP TABLE IF EXISTS EditLayout');
		db.execute('CREATE TABLE IF NOT EXISTS EditLayout(id INTEGER PRIMARY KEY AUTOINCREMENT, position TINYINT, field TEXT, sobject TEXT, ' + 
			' UNIQUE(position, sobject) ON CONFLICT REPLACE);'
		);
		//db.execute('CREATE UNIQUE INDEX IF NOT EXISTS EditLayout_idx ON EditLayout(position,field, sobject);');
		Ti.API.info('[dynaforce] Table EditLayout SUCCESSFULLY CREATED');
	} catch (e) {
		Ti.API.error('[dynaforce] Exception creating EditLayout table: ' + e);	
	}
	*/
	
	Ti.API.info('[dynaforce] CREATE TABLE IF NOT EXISTS ' + exports.RELATIONSHIP_TABLE + '(field TEXT, sobject TEXT, relatedObject TEXT, ' + 
			' PRIMARY KEY(field, sobject));');			
	try {
		//create list layout table
		db.execute('DROP TABLE IF EXISTS ' + exports.RELATIONSHIP_TABLE);
		db.execute('CREATE TABLE IF NOT EXISTS ' + exports.RELATIONSHIP_TABLE + '(field TEXT, sobject TEXT, relatedObject TEXT, ' + 
			' PRIMARY KEY(field, sobject));'
		);
		//db.execute('CREATE UNIQUE INDEX IF NOT EXISTS ListLayout_idx ON ListLayout(position,field, sobject);');
		Ti.API.info('[dynaforce] Table ' + exports.RELATIONSHIP_TABLE + ' SUCCESSFULLY CREATED');
	} catch (e) {
		Ti.API.error('[dynaforce] Exception creating ' + exports.RELATIONSHIP_TABLE + ' table: ' + e);	
	}
	
	db.close();
};

/**
 * This function is always called before the overall synchronization
 * Here we also reset the LAST_SYNC property 
 */
exports.resetSync = function() {
	Ti.API.info('[dynaforce] Resetting Sync JSON');
	for (var i=0; i<sobjectSync.length; i++) {
		var row = sobjectSync[i];
		Ti.API.info('[dynaforce] ' + JSON.stringify(sobjectSync[i]));
		row.synched = false;
	}
	var syncEnd = false;
	Ti.API.info('[dynaforce] ' + JSON.stringify(sobjectSync));
	var sfdcDate = require('sfdcDate');
	
	//startSync();
	//callbacks.success();
};

/**
 * Execute the sync of all layout objects defined locally and in the Salesforce mobile configurator
 */
exports.syncLayoutConf = function(callbacks) {
	callbacks.indicator.setMessage('Sync List Layout Configuration');
	syncListLayoutConf({
		success: function() {
			callbacks.indicator.setMessage('Sync Detail Layout Configuration');
			syncDetailLayoutConf({
				success: callbacks.success()
			});
		}
	});
				
	
};

syncListLayoutConf = function(callbacks) {
	var layoutObject = 'Layout_Configurator__c';
	var localObject = 'ListLayout';
	var queryString = 'SELECT Field_Name__c, Object__c, Order__c, Rendering__c, IsDeleted FROM ' + layoutObject;
	Alloy.Globals.force.request({
		type:'GET',
		url:'/query/?q='+Ti.Network.encodeURIComponent(queryString),
		callback: function(data) {
			var db = Ti.Database.open(Alloy.Globals.dbName);
			Ti.API.info('[dynaforce] DATA: ' + JSON.stringify(data));
			var records = data.records;
			for (var i=0; i<records.length; i++) {
				Ti.API.info('[dynaforce] RECORD: ' + JSON.stringify(records[i]));
								
				var record = records[i];
				if (record.IsDeleted!=true) {
					Ti.API.info('[dynaforce] INSERT OR REPLACE INTO ' + localObject + ' VALUES ("' + record.Order__c + '", "' + record.Field_Name__c + '", "' + record.Object__c + '", "' + record.Rendering__c + '");');
					try {
						db.execute('INSERT OR REPLACE INTO ' + localObject + ' VALUES ("' + record.Order__c + '", "' + record.Field_Name__c + '", "' + record.Object__c + '", "' + record.Rendering__c + '");');
					} catch (e) {
						Ti.API.error('[dynaforce] exception inserting data in ' + localObject + ' table: ' + e);
					}
				} else {
					Ti.API.info('[dynaforce] RECORD is DELETED: removing from local DB');
					Ti.API.info('[dynaforce] DELETE FROM ' + localObject + ' WHERE (position = "' + record.Order__c + '" AND sobject = "' + record.Object__c + '");');
					try {
						db.execute('DELETE FROM ' + localObject + ' WHERE (position = "' + record.Order__c + '" AND sobject = "' + record.Object__c + '");');
					} catch (e) {
						Ti.API.info('[dynaforce] Exception deleting row: ' + e);
					}
				}
			}
			db.close;
			Ti.API.info('[dynaforce] ListLayout UPDATED');
			callbacks.success();
		}
	});
};

syncDetailLayoutConf = function(callbacks) {
	var layoutObject = 'Detail_Layout__c';
	var localObject = 'DetailLayout';
	var queryString = 'SELECT Field_Name__c, Object__c, Order__c, Rendering__c, IsDeleted FROM ' + layoutObject;
	Alloy.Globals.force.request({
		type:'GET',
		url:'/query/?q='+Ti.Network.encodeURIComponent(queryString),
		callback: function(data) {
			var db = Ti.Database.open(Alloy.Globals.dbName);
			Ti.API.info('[dynaforce] DATA: ' + JSON.stringify(data));
			var records = data.records;
			for (var i=0; i<records.length; i++) {
				Ti.API.info('[dynaforce] RECORD: ' + JSON.stringify(records[i]));
								
				var record = records[i];
				if (record.IsDeleted!=true) {
					Ti.API.info('[dynaforce] INSERT OR REPLACE INTO ' + localObject + ' VALUES ("' + record.Order__c + '", "' + record.Field_Name__c + '", "' + record.Object__c + '", "' + record.Rendering__c + '");');
					try {
						db.execute('INSERT OR REPLACE INTO ' + localObject + ' VALUES ("' + record.Order__c + '", "' + record.Field_Name__c + '", "' + record.Object__c + '", "' + record.Rendering__c + '");');
					} catch (e) {
						Ti.API.error('[dynaforce] exception inserting data in ' + localObject + ' table: ' + e);
					}
				} else {
					Ti.API.info('[dynaforce] RECORD is DELETED: removing from local DB');
					Ti.API.info('[dynaforce] DELETE FROM ' + localObject + ' WHERE (position = "' + record.Order__c + '" AND sobject = "' + record.Object__c + '");');
					try {
						db.execute('DELETE FROM ' + localObject + ' WHERE (position = "' + record.Order__c + '" AND sobject = "' + record.Object__c + '");');
					} catch (e) {
						Ti.API.info('[dynaforce] Exception deleting row: ' + e);
					}
				}
			}
			db.close;
			Ti.API.info('[dynaforce] DetailLayout UPDATED');
			callbacks.success();
		}
	});
};

/**
 * execute the sync of the object defined in the sobjectSync JSON structure
 * callbacks
 * 	indicator: the ActivityIndicator Ti object
 * 	success: what to do when the app success
 */
exports.startSync = function(callbacks) {
	
	/*
	 * This routine controls sync status on the structure saved on the variable sobjectSync
	 * Every time a sobject sync is finished, the property "synched" of the current object will bi set to TRUE
	 * and the startSync function will be recurvely called.
	 * Automatically this cycle will check for the next sobject to sync
	 */
	var notSyncFound = false;
	var k = 0;
	while(!notSyncFound) {
		Ti.API.info('[dynaforce] index: ' + k);
		var row = sobjectSync[k];
		Ti.API.info('[dynaforce] ' + JSON.stringify(sobjectSync[k]));
		if (row.synched == false) notSyncFound = true;
		k++;
	}
	if (notSyncFound) {
		var row = sobjectSync[k-1];
		row.synched = true;
		var sobject = row.sobject;
		Ti.API.info('[dynaforce] SYNCHRONIZING SOBJECT: ' + sobject);
		callbacks.indicator.setMessage('Sync ' + sobject + ' Data and Structure');
		
		/*
		 * First, synchronize the data description of the SObject
		 */
		Alloy.Globals.force.request({
		type:'GET',
		url:'/sobjects/' + sobject + '/describe', 
		callback: function(data) {
			
				try {
					//bootstrap the database
					var db = Ti.Database.open(Alloy.Globals.dbName);
					
					var fieldList = new Array();
					var typeList = new Array();
					
					//save the used fields, used after to retrieve the data in the SELECT statement
					var usedFields = new Array();
					
					var fields = data.fields;
					Ti.API.info('[dynaforce] RESULT: ' + JSON.stringify(data));
					Ti.API.info('[dynaforce] OBJECT NAME: ' + data.name);

					try {
						//db.execute('CREATE TABLE IF NOT EXISTS ' + sobject + '(Id CHARACTER(20), LocalId INTEGER AUTOINCREMENT, PRIMARY KEY(Id, LocalId));');
						db.execute('CREATE TABLE IF NOT EXISTS ' + sobject + '(Id CHARACTER(20) PRIMARY KEY);');
						Ti.API.info('[dynaforce] TABLE ' + sobject + ' SUCCESSFULLY CREATED (with no columns) OR ALREADY EXISTS');
					} catch (e) {
						Ti.API.error('[dynaforce] Error creating empty table: ' + sobject);
						Ti.API.error('[dinaforce] Exception: ' + e);
					}
					
					for (var i=0; i<fields.length; i++) {
						var f = fields[i];
						/*
						Ti.API.info('[dynaforce] FIELD NAME: ' + f.name);
						Ti.API.info('[dynaforce] FIELD TYPE: ' + f.type);
						Ti.API.info('[dynaforce] FIELD LABEL: ' + f.label);
						if (f.type == 'reference') {
							Ti.API.info('[dynaforce] REFERENCE TO: ' + f.referenceTo[0]);
						}
						*/
						fieldList[i] = f.name;
						typeList[i] = f.type;
						
						//check if the field exists in ObjectFieldMap
						Ti.API.info('[dynaforce] SELECT * FROM ObjectFieldMap WHERE field="' + f.name + 
						  	'" AND sobject = "' + sobject + '" LIMIT 1;');
						var check = db.execute('SELECT * FROM ObjectFieldMap WHERE field="' + f.name + 
						  	'" AND sobject = "' + sobject + '" LIMIT 1;');
						Ti.API.info("[dynaforce] CHECK VALUE = " + check.rowCount);
						if (check.rowCount!=1) {
							Ti.API.info('[dynaforce] CHANGES FOUNDED IN DATA STRUCTURE for field: ' + f.name);
						  	//upsert in ObjectFieldMap
						  	Ti.API.info('[dynaforce] INSERT OR REPLACE INTO ObjectFieldMap VALUES("' + f.name + '", "' + f.type + '", "' + sobject + '", "' + f.label + '",0) ');
						  	try {
						  		db.execute('INSERT OR REPLACE INTO ObjectFieldMap VALUES("' + f.name + '", "' + f.type + '", "' + sobject + '", "' + f.label + '",0); ');
						  	} catch (e) {
						  		Ti.API.error('[dynaforce] Exception upserting in ObjectFieldMap field: ' + f.name + ' type: ' + f.type + ' label: ' + f.label);
						  		Ti.API.error('[dinaforce] Exception: ' + e);
						  	}
							
							//now alter SObject table to crate the new field
							//jump out if the type is "id" because is the only field we have as default in every table
							if (f.type!='id') {
								if (SFDCSQLiteFieldMap.hasOwnProperty(f.type)) {
									//this means that it is a "normal" field
									var sqliteType = SFDCSQLiteFieldMap[f.type];
									
									
									
									
									try {
										Ti.API.info('[dynaforce] ' + 'ALTER TABLE ' + sobject + ' ADD COLUMN ' + f.name + ' ' + sqliteType);
										db.execute('ALTER TABLE ' + sobject + ' ADD COLUMN ' + f.name + ' ' + sqliteType + ';');
										Ti.API.info('[dynaforce] ALTERING SUCCESSFUL');
										
										//say to the bjectFieldMap that the field is ready to use for retrieving data
										db.execute('INSERT OR REPLACE INTO ObjectFieldMap VALUES("' + f.name + '", "' + f.type + '", "' + sobject + '", "' + f.label + '",1) ');
										//usedFields.push(f.name);
									} catch (e) {
										Ti.API.error('[dynaforce] Error altering table with field: ' + f.name + ' of type: ' + f.type + ' label: ' + f.label + ':  ' + e);
									}
								} 
								
								//PICKLIST
								if (f.type=='picklist') {
									Ti.API.info('[dynaforce] Field ' + f.name + ' is a picklist');
									var values = f.picklistValues;
									Ti.API.info('[dynaforce] it has ' + values.length + ' values');
									for (var i=0; i<values.length; i++) {
										var elem = values[i];
										if (elem.active==true) {
											Ti.API.info('[dynaforce] INSERT OR REPLACE INTO Picklist VALUES("' + elem.value + '", "' + f.name + '", "' + sobject + '", "' + elem.label + '");');
											try {
												//db.execute('INSERT OR REPLACE INTO ObjectFieldMap VALUES(NULL, \'' + f.name + '\', \'' + f.type + '\', \'' + sobject + '\', \'' + f.label + '\',1) ');
												db.execute('INSERT OR REPLACE INTO Picklist VALUES("' + elem.value + '", "' + f.name + '", "' + sobject + '", "' + elem.label + '");');
											} catch (e) {
												Ti.API.error('[dynaforce] Exception adding row t Picklist - field: ' + f.name + ' value: ' + elem.value + ' label: ' + elem.label + ': ' +e);
											}
										} else {
											Ti.API.info('[dynaforce] Value ' + elem.value + ' is inactive for field ' + f.name);
										}
									}
								}
								
								//RELATIONSHIP
								
								if (f.type=='reference') {
									Ti.API.info('[dynaforce] Field ' + f.name + ' is a reference');
									var relation = f.referenceTo;
								
									/* 
									 * checking if the object is already in the map
									 * if not, add it to the sync list
									 */
									/*
									var alreadyIn = false;
									for (var j=0; j<relations.length; j++) {
										var objectName = relations[j];
										for (var i=0; i<sobjectSync.length; i++) {
											if (objectName==sobjectSync[i].sobject || objectName=="Group") alreadyIn = true;
										}
										if (!alreadyIn) {
											sobjectSync.push({
												sobject: objectName,
												synched: false
											});
											Ti.API.info('[dynaforce] SOBJECT ' + objectName + ' is already in SYNC list');
										} else {
											Ti.API.info('[dynaforce] SOBJECT ' + objectName + ' ADDED to the SYNC list');
										}
									}
									*/
									
									if (relation.length==1) { 
										var isIn = false;
										for (var i=0; i<sobjectSync.length; i++) {
											if (relation[0]==sobjectSync[i].sobject) isIn = true;
										}
										if (isIn) {
											Ti.API.info('[dynaforce] INSERT OR REPLACE INTO ' + exports.RELATIONSHIP_TABLE + ' VALUES("' + f.name + '", "' + sobject + '", "' + relation[0] + '");');
											try {
												//db.execute('INSERT OR REPLACE INTO ObjectFieldMap VALUES(NULL, \'' + f.name + '\', \'' + f.type + '\', \'' + sobject + '\', \'' + f.label + '\',1) ');
												db.execute('INSERT OR REPLACE INTO ' + exports.RELATIONSHIP_TABLE + ' VALUES("' + f.name + '", "' + sobject + '", "' + relation[0] + '");');
											} catch (e) {
												Ti.API.error('[dynaforce] Exception adding row to ' + exports.RELATIONSHIP_TABLE + ' - field: ' + f.name + ' sobject: ' + sobject + ' relatedObject: ' + relation[0] + ': ' +e);
											}
										} else Ti.API.info('[dynaforce] The relationship is not related to a synched object');
									} else {
										Ti.API.info('[dynaforce] Multiple relationships are not supported');
									}
								}
								
							}
							
							
						} else Ti.API.info('[dynaforce] NO STRUCTURE CHANGES FROM LAST SYNC');
						check.close();
						
					}
					
					/*
					 * CHECKING ObjectFieldMapValues (TEST)
					 */
					/*
					Ti.API.info('[dynaforce] --- ObjectFieldMap EXTRACT ---');
					var fieldMap = db.execute('SELECT * FROM ObjectFieldMap;');
					var row = 0;
					while (fieldMap.isValidRow())
					{
						  Ti.API.info('[dynaforce] FIELD MAP ROW[' + row + '] ID: ' + fieldMap.fieldByName('id'));
						  Ti.API.info('[dynaforce] FIELD MAP ROW[' + row + '] FIELD: ' + fieldMap.fieldByName('field'));
						  Ti.API.info('[dynaforce] FIELD MAP ROW[' + row + '] LABEL: ' + fieldMap.fieldByName('label'));
						  Ti.API.info('[dynaforce] FIELD MAP ROW[' + row + '] TYPE: ' + fieldMap.fieldByName('sfdctype'));
						  Ti.API.info('[dynaforce] FIELD MAP ROW[' + row + '] SOBJECT: ' + fieldMap.fieldByName('sobject'));
						  row++;
						  fieldMap.next();
					}
					fieldMap.close();
					*/
					/*********************************/
					
					/*
					 * CHECKING Picklist (TEST)
					 */
					/*
					Ti.API.info('[dynaforce] --- Picklist EXTRACT ---');
					fieldMap = db.execute('SELECT * FROM Picklist;');
					row = 0;
					while (fieldMap.isValidRow())
					{
						  Ti.API.info('[dynaforce] FIELD MAP ROW[' + row + '] ID: ' + fieldMap.fieldByName('id'));
						  Ti.API.info('[dynaforce] FIELD MAP ROW[' + row + '] VALUE: ' + fieldMap.fieldByName('value'));
						  Ti.API.info('[dynaforce] FIELD MAP ROW[' + row + '] LABEL: ' + fieldMap.fieldByName('label'));
						  Ti.API.info('[dynaforce] FIELD MAP ROW[' + row + '] FIELD: ' + fieldMap.fieldByName('field'));
						  Ti.API.info('[dynaforce] FIELD MAP ROW[' + row + '] SOBJECT: ' + fieldMap.fieldByName('sobject'));
						  row++;
						  fieldMap.next();
					}
					fieldMap.close();
					*/
					/*********************************/
					
					var used = db.execute('SELECT field, sfdctype FROM ObjectFieldMap WHERE sobject = "' + sobject + '" AND isUsed = 1;');
					var usedFieldTypes = [];
					while (used.isValidRow()) {
						usedFields.push(used.fieldByName('field'));
						usedFieldTypes.push(used.fieldByName('sfdctype'));
						used.next();
					}
					used.close();
					
					//the Id is dhe default accepted field and LocalId is default created
					usedFields.push('Id');
					usedFieldTypes.push('id');
					
					//usedFields.push('LocalId');
					//now start integrate data
					var queryString = 'SELECT ';
					for (var i=0; i<usedFields.length; i++) {
						if (i!=usedFields.length-1) queryString +=  usedFields[i] + ',';
						else queryString += usedFields[i];
					}
					queryString += ' FROM ' + sobject + ' ';
					Ti.API.info('[dynaforce] Last SYNC: ' + LAST_SYNC);
					if (LAST_SYNC) {
						var deltaCond = 'WHERE LastModifiedDate > ' + LAST_SYNC;
						queryString += deltaCond;
					}
					Ti.API.info('[dynaforce] QUERY STRING: ' + queryString);
					
					db.close();
					
					Alloy.Globals.force.request({
						type:'GET',
						url:'/query/?q='+Ti.Network.encodeURIComponent(queryString),
						callback: function(data) {
							
							var db = Ti.Database.open(Alloy.Globals.dbName);
							
							Ti.API.info('[dynaforce] DATA: ' + JSON.stringify(data));
							var records = data.records;
							//if (records.length==0) alert('No updates found in table ' + sobject);
							for (var i=0; i<records.length; i++) {
								Ti.API.info('[dynaforce] RECORD: ' + JSON.stringify(records[i]));
								
								var record = records[i];
								var statement = 'INSERT OR REPLACE INTO ' + sobject + '(';
								var values = 'VALUES ('; 
								
								for (var j=0; j<usedFields.length; j++) {
									var field = usedFields[j];
									var type = usedFieldTypes[j];
									var value = record[usedFields[j]];
									
									/*** MANAGING FIELD TYPE EXCEPTIONS ***/
									
									if (value!=null) {
										/*
										if (type=="datetime") {
											try {
												var dateUtils = require('sfdcDate');
												value = dateUtils.convertDateTime(value);	
											} catch (e) {
												Ti.API.error('[dynaforce] Exception converting datetime: ' + e);
											}
										}
										*/
									}
									
									
									statement += field;
									if (value!=null) {
										/*
										try {
											var strValue = '' + value;
											if (strValue.indexOf(/"/g)) {
												strValue.replace(/"/g,"'");
												Ti.API.info('[dynaforce] String replaced value: ' + strValue);
											}
										} catch (e) {
											Ti.API.error("[dynaforce] String exception: " + e);
										}
										*/
										values += '"' + value + '"';
									}
									else values += null;
									if (j!=usedFields.length-1) {
										statement += ',';
										values+= ',';
									}
								}
								var insertQuery = statement + ') ' + values + ');';
								/*
								Ti.API.info('[dynaforce] --- INSERT QUERY --- '); 
								Ti.API.info('[dynaforce] ' + statement + ')');
								Ti.API.info('[dynaforce] ' + values + ')');
								*/
								try {
									db.execute(insertQuery);
									Ti.API.info('[dynaforce] INSERT SUCCESS');
								} catch (e) {
									Ti.API.error('[dynaforce] ' + sobject + ' Data inserting error : ' + e);
								}
							}
							
							/*
							 * **** CHECKING DATABASE DATA (TEST) ****
							 */
							/*
							try {
								Ti.API.info('[dynaforce] --- ' + sobject + ' EXTRACT ---');
								Ti.API.info('[dynaforce] SELECT * FROM ' + sobject + ';');
								var resultSet;
								try {
									resultSet = db.execute('SELECT * FROM ' + sobject + ';');
								} catch (e) {
									Ti.API.error('[dynaforce] Exception retrieving ' + sobject + ' rows: ' + e);
								}
								Ti.API.info('[dynaforce] Number of rows: ' + resultSet.rowCount);
								var row = 0;
								while (resultSet.isValidRow())
								{
									Ti.API.info('[dynaforce] --- ROW ' + row + ' ---');
									for (var i=0; i<usedFields.length; i++) {
										var field = usedFields[i];
										Ti.API.info('[dynaforce] ' + sobject + ' ROW ' + row + ' - ' + field + ': ' + resultSet.fieldByName(field)) + ' of TYPE';
									}
									row++;
									resultSet.next();
								}
								resultSet.close();
							} catch (e) {
								Ti.API.error('[dynaforce] Exception: ' + e);
							}
							*/
							/*********************************/
							
							db.close();
							
							Ti.API.info('[dynaforce] RESTARTING SYNC');
							try {
								if (k!=sobjectSync.length) {
									exports.startSync({
										indicator: callbacks.indicator,
										success: function () {
											callbacks.success();
										}
									});
								} else {
									Ti.API.info('[dynaforce] SYNC COMPLETE');
									var sfdcDate = require('sfdcDate');
									LAST_SYNC = sfdcDate.createTodaySfdcDate();
									Ti.App.Properties.setString('dynaforce.lastSync', LAST_SYNC);
									Ti.API.info('[dynaforce] last sync updated to: ' + LAST_SYNC);
									callbacks.success(); 
								}
								//callbacks.success();
							} catch (e) {
								Ti.API.error('[dynaforce] RESTART SYNC Exception: ' + e);
							}
							
						}
					});
					
					
					//$.activityIndicator.hide();
				} catch (e) {
					Ti.API.info('[dynaforce] Exception: ' + e);
				}
		}
	});
	} else {
		Ti.API.info('[dynaforce] ALL OBJECTS HAVE BEEN SYNCHRONIZED');
		callbacks.success();
	}
};

function retrieveImageList(table) {
	var imageList = new Array();
	var db = Ti.Database.open(Alloy.Globals.dbName);
	Ti.API.info('[dynaforce] SELECT * FROM ' + table + ';');
	var rowset;
	//retireve all the rows from the ListLayout
	try {
		rowset = db.execute('SELECT * FROM ' + table + ';');
	} catch (e) {
		Ti.API.error('[dynaforce] Exception retrieving ' + table + ' rows: ' + e);
	}
	
	while (rowset.isValidRow()) {
		var rendering = rowset.fieldByName("rendering");
		if (rendering=="image") {
			var field = rowset.fieldByName("field");
			var sobject = rowset.fieldByName("sobject");
			
			Ti.API.info('[dynaforce]  SELECT Id,' + field + ' FROM ' + sobject + ';');
			var fieldset;
			//retireve the Salesforce field type from the ObjectFieldMap table
			try {
				fieldset = db.execute('SELECT Id,' + field + ' FROM ' + sobject + ';');
			} catch (e) {
				Ti.API.error('[dynaforce]  Exception retrieving ' + sobject + ' rows: ' + e);
			}
			
			//now scroll all the rows to take the image url
			while (fieldset.isValidRow()) {
				var imgUrl = fieldset.fieldByName(field);
				imageList.push({
					id: fieldset.fieldByName('Id'),
					url: imgUrl,
					downloaded: false
				});
				fieldset.next();
			}
			fieldset.close();
			
		}
		rowset.next();
	}	
	rowset.close();
	
	for (var i=0; i<imageList.length; i++) {
		Ti.API.info('[dynaforce] imageList id: ' + imageList[i].id);
		Ti.API.info('[dynaforce] imageList url: ' + imageList[i].url);
	}
	
	JSONImages = imageList;
}


exports.downloadImages = function(callbacks) {
	retrieveImageList(exports.LIST_LAYOUT_TABLE);
	if (JSONImages.length>0) {
		exports.startDownloadRoutine({
			success: function(){
				callbacks.success();
			}
		});
	} else {
		callbacks.success();
	}
};

exports.startDownloadRoutine = function(callbacks) {
	var notSyncFound = false;
	var k = 0;
	var image;
	while(!notSyncFound) {
		image = JSONImages[k];
		Ti.API.info('[dynaforce] ' + JSON.stringify(JSONImages[k]));
		if (image.downloaded == false) notSyncFound = true;
		k++;
	}
	if (notSyncFound) {
		var url = image.url;
		if (url) {
			var id = image.id;
			var xhr = Titanium.Network.createHTTPClient({
				onload: function() {
			        // first, grab a "handle" to the file where you'll store the downloaded data
					Ti.API.info("[dynaforce] Image Response Data: " + this.responseData);
					Ti.API.info("[dynaforce] Image name: " + id + '.png');
					var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, id + '.png');
					f.write(this.responseData); // write to the file
					Ti.API.info("[dynaforce] file downloaded");
					image.downloaded = true;
					if (k!=JSONImages.length) {
						exports.startDownloadRoutine({
							success: function () {
								callbacks.success();
							}
						});
					} else {
						//we have finish the download
						Ti.API.info("[dynaforce] Image Downloading Complete");
						callbacks.success();
					}
				},
				timeout: 10000
			});
			xhr.open('GET',url);
			xhr.send();
		} else { //if (url)
			image.downloaded = true;
			if (k!=JSONImages.length) {
				exports.startDownloadRoutine({ 
					success: function () {
						callbacks.success();
					}
				});
			} else {
				//we have finish the download
				Ti.API.info("[dynaforce] Image Downloading Complete");
				callbacks.success();
			}
		}
	} else {
		Ti.API.info("[dynaforce] Image Downloading Complete");
		callbacks.success();
	}
};

