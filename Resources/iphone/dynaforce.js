var SFDCSQLiteFieldMap = {
    string: "TEXT",
    "boolean": "BOOLEAN",
    textarea: "TEXT",
    "double": "DOUBLE",
    phone: "TEXT",
    url: "TEXT",
    currency: "DOUBLE",
    "int": "INTEGER",
    datetime: "DATETIME",
    date: "DATE",
    picklist: "TEXT",
    email: "TEXT"
};

var sobjectSync = [ {
    sobject: "Account",
    synched: false
}, {
    sobject: "Contact",
    synched: false
} ];

exports.init = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    Ti.API.info("[dynaforce] CREATE TABLE IF NOT EXISTS ObjectFieldMap (field TEXT, sfdctype TEXT, sobject TEXT, label TEXT, isUsed BOOLEAN,  PRIMARY KEY(field, sobject));");
    try {
        db.execute("CREATE TABLE IF NOT EXISTS ObjectFieldMap (field TEXT, sfdctype TEXT, sobject TEXT, label TEXT, isUsed BOOLEAN,  PRIMARY KEY(field, sobject));");
        Ti.API.info("[dynaforce] Table ObjectFieldMap SUCCESSFULLY CREATED");
    } catch (e) {
        Ti.API.error("[dynaforce] Exception creating ObjectFieldMap table: " + e);
    }
    Ti.API.info("[dynaforce] CREATE TABLE IF NOT EXISTS Picklist(value TEXT, field TEXT, sobject TEXT, label TEXT,  PRIMARY KEY(field, sobject));");
    try {
        db.execute("CREATE TABLE IF NOT EXISTS Picklist(value TEXT, field TEXT, sobject TEXT, label TEXT,  PRIMARY KEY(field, sobject));");
        Ti.API.info("[dynaforce] Table Picklist SUCCESSFULLY CREATED");
    } catch (e) {
        Ti.API.error("[dynaforce] Exception creating Picklist table: " + e);
    }
    Ti.API.info("[dynaforce] CREATE TABLE IF NOT EXISTS DetailLayout(position TINYINT, field TEXT, sobject TEXT,  PRIMARY KEY(position, sobject) ON CONFLICT REPLACE);");
    try {
        db.execute("DROP TABLE IF EXISTS DetailLayout");
        db.execute("CREATE TABLE IF NOT EXISTS DetailLayout(position TINYINT, field TEXT, sobject TEXT,  PRIMARY KEY(position, sobject));");
        Ti.API.info("[dynaforce] Table DetailLayout SUCCESSFULLY CREATED");
    } catch (e) {
        Ti.API.error("[dynaforce] Exception creating DetailLayout table: " + e);
    }
    Ti.API.info("[dynaforce] CREATE TABLE IF NOT EXISTS ListLayout(position TINYINT, field TEXT, sobject TEXT,  PRIMARY KEY(position, sobject));");
    try {
        db.execute("DROP TABLE IF EXISTS ListLayout");
        db.execute("CREATE TABLE IF NOT EXISTS ListLayout(position TINYINT, field TEXT, sobject TEXT,  PRIMARY KEY(position, sobject));");
        Ti.API.info("[dynaforce] Table ListLayout SUCCESSFULLY CREATED");
    } catch (e) {
        Ti.API.error("[dynaforce] Exception creating ListLayout table: " + e);
    }
    db.close();
};

exports.resetSync = function() {
    Ti.API.info("[dynaforce] Resetting Sync JSON");
    for (var i = 0; sobjectSync.length > i; i++) {
        var row = sobjectSync[i];
        Ti.API.info("[dynaforce] " + JSON.stringify(sobjectSync[i]));
        row.synched = false;
    }
    Ti.API.info("[dynaforce] " + JSON.stringify(sobjectSync));
};

exports.syncListLayoutConf = function(callbacks) {
    var layoutObject = "Layout_Configurator__c";
    var localObject = "ListLayout";
    var queryString = "SELECT Field_Name__c, Object__c, Order__c, IsDeleted FROM " + layoutObject;
    Alloy.Globals.force.request({
        type: "GET",
        url: "/query/?q=" + Ti.Network.encodeURIComponent(queryString),
        callback: function(data) {
            var db = Ti.Database.open(Alloy.Globals.dbName);
            Ti.API.info("[dynaforce] DATA: " + JSON.stringify(data));
            var records = data.records;
            for (var i = 0; records.length > i; i++) {
                Ti.API.info("[dynaforce] RECORD: " + JSON.stringify(records[i]));
                var record = records[i];
                if (true != record.IsDeleted) {
                    Ti.API.info("[dynaforce] INSERT OR REPLACE INTO " + localObject + ' VALUES ("' + record.Order__c + '", "' + record.Field_Name__c + '", "' + record.Object__c + '");');
                    try {
                        db.execute("INSERT OR REPLACE INTO " + localObject + ' VALUES ("' + record.Order__c + '", "' + record.Field_Name__c + '", "' + record.Object__c + '");');
                    } catch (e) {
                        Ti.API.error("[dynaforce] exception inserting data in " + localObject + " table: " + e);
                    }
                } else {
                    Ti.API.info("[dynaforce] RECORD is DELETED: removing from local DB");
                    Ti.API.info("[dynaforce] DELETE FROM " + localObject + ' WHERE (position = "' + record.Order__c + '" AND sobject = "' + record.Object__c + '");');
                    try {
                        db.execute("DELETE FROM " + localObject + ' WHERE (position = "' + record.Order__c + '" AND sobject = "' + record.Object__c + '");');
                    } catch (e) {
                        Ti.API.info("[dynaforce] Exception deleting row: " + e);
                    }
                }
            }
            db.close;
            Ti.API.info("[dynaforce] ListLayout UPDATED");
            callbacks.success();
        }
    });
};

exports.startSync = function(callbacks) {
    var notSyncFound = false;
    var k = 0;
    while (!notSyncFound) {
        Ti.API.info("[dynaforce] index: " + k);
        var row = sobjectSync[k];
        Ti.API.info("[dynaforce] " + JSON.stringify(sobjectSync[k]));
        false == row.synched && (notSyncFound = true);
        k++;
    }
    if (notSyncFound) {
        var row = sobjectSync[k - 1];
        row.synched = true;
        var sobject = row.sobject;
        Ti.API.info("[dynaforce] SYNCHRONIZING SOBJECT: " + sobject);
        callbacks.indicator.setMessage("Sync " + sobject + " Data and Structure");
        Alloy.Globals.force.request({
            type: "GET",
            url: "/sobjects/" + sobject + "/describe",
            callback: function(data) {
                try {
                    var db = Ti.Database.open(Alloy.Globals.dbName);
                    var fieldList = new Array();
                    var typeList = new Array();
                    var usedFields = new Array();
                    var fields = data.fields;
                    Ti.API.info("[dynaforce] RESULT: " + JSON.stringify(data));
                    Ti.API.info("[dynaforce] OBJECT NAME: " + data.name);
                    try {
                        db.execute("CREATE TABLE IF NOT EXISTS " + sobject + "(Id CHARACTER(20) PRIMARY KEY);");
                        Ti.API.info("[dynaforce] TABLE " + sobject + " SUCCESSFULLY CREATED (with no columns) OR ALREADY EXISTS");
                    } catch (e) {
                        Ti.API.error("[dynaforce] Error creating empty table: " + sobject);
                        Ti.API.error("[dinaforce] Exception: " + e);
                    }
                    for (var i = 0; fields.length > i; i++) {
                        var f = fields[i];
                        fieldList[i] = f.name;
                        typeList[i] = f.type;
                        var check = db.execute('SELECT * FROM ObjectFieldMap WHERE field="' + f.name + '" AND sobject = "' + sobject + '" LIMIT 1;');
                        Ti.API.info("[dynaforce] CHECK VALUE = " + check.rowCount);
                        if (1 != check.rowCount) {
                            Ti.API.info("[dynaforce] CHANGES FOUNDED IN DATA STRUCTURE for field: " + f.name);
                            Ti.API.info('[dynaforce] INSERT OR REPLACE INTO ObjectFieldMap VALUES("' + f.name + '", "' + f.type + '", "' + sobject + '", "' + f.label + '",0) ');
                            try {
                                db.execute('INSERT OR REPLACE INTO ObjectFieldMap VALUES("' + f.name + '", "' + f.type + '", "' + sobject + '", "' + f.label + '",0); ');
                            } catch (e) {
                                Ti.API.error("[dynaforce] Exception upserting in ObjectFieldMap field: " + f.name + " type: " + f.type + " label: " + f.label);
                                Ti.API.error("[dinaforce] Exception: " + e);
                            }
                            if ("id" != f.type) {
                                if (SFDCSQLiteFieldMap.hasOwnProperty(f.type)) {
                                    var sqliteType = SFDCSQLiteFieldMap[f.type];
                                    try {
                                        Ti.API.info("[dynaforce] ALTER TABLE " + sobject + " ADD COLUMN " + f.name + " " + sqliteType);
                                        db.execute("ALTER TABLE " + sobject + " ADD COLUMN " + f.name + " " + sqliteType + ";");
                                        Ti.API.info("[dynaforce] ALTERING SUCCESSFUL");
                                        db.execute('INSERT OR REPLACE INTO ObjectFieldMap VALUES("' + f.name + '", "' + f.type + '", "' + sobject + '", "' + f.label + '",1) ');
                                    } catch (e) {
                                        Ti.API.error("[dynaforce] Error altering table with field: " + f.name + " of type: " + f.type + " label: " + f.label + ":  " + e);
                                    }
                                }
                                if (f.type = "picklist") {
                                    Ti.API.info("[dynaforce] Field " + f.name + " is a picklist");
                                    var values = f.picklistValues;
                                    Ti.API.info("[dynaforce] it has " + values.length + " values");
                                    for (var i = 0; values.length > i; i++) {
                                        var elem = values[i];
                                        if (true == elem.active) {
                                            Ti.API.info('[dynaforce] INSERT OR REPLACE INTO Picklist VALUES("' + elem.value + '", "' + f.name + '", "' + sobject + '", "' + elem.label + '");');
                                            try {
                                                db.execute('INSERT OR REPLACE INTO Picklist VALUES("' + elem.value + '", "' + f.name + '", "' + sobject + '", "' + elem.label + '");');
                                            } catch (e) {
                                                Ti.API.error("[dynaforce] Exception adding row t Picklist - field: " + f.name + " value: " + elem.value + " label: " + elem.label + ": " + e);
                                            }
                                        } else Ti.API.info("[dynaforce] Value " + elem.value + " is inactive for field " + f.name);
                                    }
                                }
                            }
                        } else Ti.API.info("[dynaforce] NO STRUCTURE CHANGES FROM LAST SYNC");
                        check.close();
                    }
                    var used = db.execute('SELECT field, sfdctype FROM ObjectFieldMap WHERE sobject = "' + sobject + '" AND isUsed = 1;');
                    var usedFieldTypes = [];
                    while (used.isValidRow()) {
                        usedFields.push(used.fieldByName("field"));
                        usedFieldTypes.push(used.fieldByName("sfdctype"));
                        used.next();
                    }
                    used.close();
                    usedFields.push("Id");
                    usedFieldTypes.push("id");
                    var queryString = "SELECT ";
                    for (var i = 0; usedFields.length > i; i++) queryString += i != usedFields.length - 1 ? usedFields[i] + "," : usedFields[i];
                    queryString += " FROM " + sobject;
                    Ti.API.info("[dynaforce] QUERY STRING: " + queryString);
                    db.close();
                    Alloy.Globals.force.request({
                        type: "GET",
                        url: "/query/?q=" + Ti.Network.encodeURIComponent(queryString),
                        callback: function(data) {
                            var db = Ti.Database.open(Alloy.Globals.dbName);
                            Ti.API.info("[dynaforce] DATA: " + JSON.stringify(data));
                            var records = data.records;
                            for (var i = 0; records.length > i; i++) {
                                Ti.API.info("[dynaforce] RECORD: " + JSON.stringify(records[i]));
                                var record = records[i];
                                var statement = "INSERT OR REPLACE INTO " + sobject + "(";
                                var values = "VALUES (";
                                for (var j = 0; usedFields.length > j; j++) {
                                    var field = usedFields[j];
                                    usedFieldTypes[j];
                                    var value = record[usedFields[j]];
                                    null != value;
                                    statement += field;
                                    values += null != value ? '"' + value + '"' : null;
                                    if (j != usedFields.length - 1) {
                                        statement += ",";
                                        values += ",";
                                    }
                                }
                                var insertQuery = statement + ") " + values + ");";
                                try {
                                    db.execute(insertQuery);
                                    Ti.API.info("[dynaforce] INSERT SUCCESS");
                                } catch (e) {
                                    Ti.API.error("[dynaforce] " + sobject + " Data inserting error : " + e);
                                }
                            }
                            db.close();
                            Ti.API.info("[dynaforce] RESTARTING SYNC");
                            try {
                                if (k != sobjectSync.length) exports.startSync({
                                    indicator: callbacks.indicator,
                                    success: function() {
                                        callbacks.success();
                                    }
                                }); else {
                                    Ti.API.info("[dynaforce] SYNC COMPLETE");
                                    callbacks.success();
                                }
                            } catch (e) {
                                Ti.API.error("[dynaforce] RESTART SYNC Exception: " + e);
                            }
                        }
                    });
                } catch (e) {
                    Ti.API.info("[dynaforce] Exception: " + e);
                }
            }
        });
    } else {
        Ti.API.info("[dynaforce] ALL OBJECTS HAVE BEEN SYNCHRONIZED");
        callbacks.success();
    }
};