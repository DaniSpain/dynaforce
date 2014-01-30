exports.readableField = function(field, sobject, dataRow) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    Ti.API.info("[dynaforce] [contolManager] SELECT sfdctype FROM ObjectFieldMap WHERE field = '" + field + "' AND sobject = '" + sobject + "';");
    var rowset;
    try {
        rowset = db.execute("SELECT sfdctype FROM ObjectFieldMap WHERE field = '" + field + "' AND sobject = '" + sobject + "' LIMIT 1;");
    } catch (e) {
        Ti.API.error("[dynaforce] [contolManager] Exception retrieving field type: " + e);
    }
    var type;
    if (null != rowset) {
        type = rowset.fieldByName("sfdctype");
        Ti.API.info("[dynaforce] [contolManager] FOUNDED TYPE: " + type);
        if ("string" == type) {
            var label = Ti.UI.createLabel({
                color: "#900",
                font: {
                    fontSize: 20
                },
                text: dataRow.fieldByName(field),
                left: 10,
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE
            });
            return label;
        }
        if ("picklist" == type) {
            var label = Ti.UI.createLabel({
                color: "#000000",
                font: {
                    fontSize: 14
                },
                text: dataRow.fieldByName(field),
                left: 10,
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE
            });
            return label;
        }
        if ("email" == type) {
            var label = Ti.UI.createLabel({
                color: "#0099CC",
                font: {
                    fontSize: 14
                },
                text: dataRow.fieldByName(field),
                left: 10,
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE
            });
            var emailDialog = Ti.UI.createEmailDialog();
            emailDialog.subject = "Hello from DaniSpain";
            emailDialog.toRecipients = [ dataRow.fieldByName(field) ];
            emailDialog.messageBody = "<b>Appcelerator Titanium Rocks!</b>";
            label.addEventListener("click", function() {
                emailDialog.open();
            });
            return label;
        }
    } else Ti.API.error("[dynaforce] [contolManager] CANNOT FIND THE REQUESTED FIELD!");
    rowset.close();
    db.close();
    return null;
};