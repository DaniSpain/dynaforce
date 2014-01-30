/**
 * THIS IS DYNAFORCE!
 * @author Daniele Spagnuolo
 * @version 1.0
 */


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
	'email': 'TEXT'
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
	
	Ti.API.info('[dynaforce] CREATE TABLE IF NOT EXISTS DetailLayout(position TINYINT, field TEXT, sobject TEXT, ' + 
			' PRIMARY KEY(position, sobject) ON CONFLICT REPLACE);');				
	try {
		//create detail layout table
		db.execute('DROP TABLE IF EXISTS DetailLayout');
		db.execute('CREATE TABLE IF NOT EXISTS DetailLayout(position TINYINT, field TEXT, sobject TEXT, ' + 
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
		db.execute('CREATE TABLE IF NOT EXISTS ListLayout(position TINYINT, field TEXT, sobject TEXT, ' + 
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
	
	db.close();
};

exports.resetSync = function() {
	Ti.API.info('[dynaforce] Resetting Sync JSON');
	for (var i=0; i<sobjectSync.length; i++) {
		var row = sobjectSync[i];
		Ti.API.info('[dynaforce] ' + JSON.stringify(sobjectSync[i]));
		row.synched = false;
	}
	var syncEnd = false;
	Ti.API.info('[dynaforce] ' + JSON.stringify(sobjectSync));
	//startSync();
	//callbacks.success();
};

exports.syncListLayoutConf = function(callbacks) {
	var layoutObject = 'Layout_Configurator__c';
	var localObject = 'ListLayout';
	var queryString = 'SELECT Field_Name__c, Object__c, Order__c, IsDeleted FROM ' + layoutObject;
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
					Ti.API.info('[dynaforce] INSERT OR REPLACE INTO ' + localObject + ' VALUES ("' + record.Order__c + '", "' + record.Field_Name__c + '", "' + record.Object__c + '");');
					try {
						db.execute('INSERT OR REPLACE INTO ' + localObject + ' VALUES ("' + record.Order__c + '", "' + record.Field_Name__c + '", "' + record.Object__c + '");');
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

exports.startSync = function(callbacks) {
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
								if (f.type='picklist') {
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
					
					var used = db.execute('SELECT field FROM ObjectFieldMap WHERE sobject = "' + sobject + '" AND isUsed = 1;');
					while (used.isValidRow()) {
						usedFields.push(used.fieldByName('field'));
						used.next();
					}
					used.close();
					
					//the Id is dhe default accepted field and LocalId is default created
					usedFields.push('Id');
					//usedFields.push('LocalId');
					//now start integrate data
					var queryString = 'SELECT ';
					for (var i=0; i<usedFields.length; i++) {
						if (i!=usedFields.length-1) queryString +=  usedFields[i] + ',';
						else queryString += usedFields[i];
					}
					queryString += ' FROM ' + sobject;
					Ti.API.info('[dynaforce] QUERY STRING: ' + queryString);
					
					db.close();
					
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
								var statement = 'INSERT OR REPLACE INTO ' + sobject + '(';
								var values = 'VALUES ('; 
								
								for (var j=0; j<usedFields.length; j++) {
									var field = usedFields[j];
									var value = record[usedFields[j]];
									statement += field;
									if (value!=null)
										values += '\'' + value + '\'';
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
								//startSync();
								callbacks.success();
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

