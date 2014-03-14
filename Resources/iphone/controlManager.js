function getFieldWithLabel(dataView, labelText) {
    var view = Titanium.UI.createView({
        left: 10,
        height: "100dp",
        width: "300dp",
        top: "10dp",
        layout: "vertical",
        touchEnabled: false,
        horizontalWrap: true
    });
    var fieldLabelView = Ti.UI.createLabel({
        color: "#000000",
        font: {
            fontSize: 12
        },
        text: labelText,
        left: 10,
        touchEnabled: false,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE
    });
    view.add(fieldLabelView);
    view.add(dataView);
    return view;
}

exports.readableField = function(field, sobject, dataRow, withLabel, layoutTable) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    Ti.API.info("[dynaforce] [contolManager] SELECT sfdctype, label FROM ObjectFieldMap WHERE field = '" + field + "' AND sobject = '" + sobject + "';");
    var rowset;
    try {
        rowset = db.execute("SELECT sfdctype, label FROM ObjectFieldMap WHERE field = '" + field + "' AND sobject = '" + sobject + "' LIMIT 1;");
    } catch (e) {
        Ti.API.error("[dynaforce] [contolManager] Exception retrieving field type: " + e);
    }
    var type;
    var fieldLabel;
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
                touchEnabled: false,
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE
            });
            if (withLabel) {
                fieldLabel = rowset.fieldByName("label");
                Ti.API.info("[dynaforce] [contolManager] FOUNDED LABEL: " + fieldLabel);
                return getFieldWithLabel(label, fieldLabel);
            }
            return label;
        }
        if ("textarea" == type) {
            var label = Ti.UI.createLabel({
                color: "#0099CC",
                font: {
                    fontSize: 14
                },
                text: dataRow.fieldByName(field),
                left: 10,
                touchEnabled: false,
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE
            });
            if (withLabel) {
                fieldLabel = rowset.fieldByName("label");
                Ti.API.info("[dynaforce] [contolManager] FOUNDED LABEL: " + fieldLabel);
                return getFieldWithLabel(label, fieldLabel);
            }
            return label;
        }
        if ("picklist" == type) {
            var label = Ti.UI.createLabel({
                color: "#000000",
                font: {
                    fontSize: 15,
                    fontWeight: "bold"
                },
                text: dataRow.fieldByName(field),
                left: 10,
                touchEnabled: false,
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE
            });
            if (withLabel) {
                fieldLabel = rowset.fieldByName("label");
                Ti.API.info("[dynaforce] [contolManager] FOUNDED LABEL: " + fieldLabel);
                return getFieldWithLabel(label, fieldLabel);
            }
            return label;
        }
        if ("email" == type) {
            var label = Ti.UI.createLabel({
                color: "#0099CC",
                font: {
                    fontSize: 16
                },
                text: dataRow.fieldByName(field),
                left: 10,
                touchEnabled: true,
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
            if (withLabel) {
                fieldLabel = rowset.fieldByName("label");
                Ti.API.info("[dynaforce] [contolManager] FOUNDED LABEL: " + fieldLabel);
                return getFieldWithLabel(label, fieldLabel);
            }
            return label;
        }
        if ("currency" == type) {
            var label = Ti.UI.createLabel({
                color: "#669900",
                font: {
                    fontSize: 15
                },
                text: dataRow.fieldByName(field),
                left: 10,
                touchEnabled: false,
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE
            });
            if (withLabel) {
                fieldLabel = rowset.fieldByName("label");
                Ti.API.info("[dynaforce] [contolManager] FOUNDED LABEL: " + fieldLabel);
                return getFieldWithLabel(label, fieldLabel);
            }
            return label;
        }
        if ("date" == type || "datetime" == type) {
            var dateUtils = require("sfdcDate");
            var date = null;
            var strDate;
            if (null != dataRow.fieldByName(field)) {
                var date = new Date(dateUtils.getDateTimeObject(dataRow.fieldByName(field)));
                strDate = date.toLocaleString();
            } else strDate = "";
            Ti.API.info("[dynaforce] Date field data: " + date);
            var label = Ti.UI.createLabel({
                color: "#366E36",
                font: {
                    fontSize: 12
                },
                text: strDate,
                left: 10,
                touchEnabled: false,
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE
            });
            if (withLabel) {
                fieldLabel = rowset.fieldByName("label");
                Ti.API.info("[dynaforce] [contolManager] FOUNDED LABEL: " + fieldLabel);
                return getFieldWithLabel(label, fieldLabel);
            }
            return label;
        }
        if ("url" == type) {
            Ti.API.info("[dynaforce] [contolManager] SELECT rendering FROM " + layoutTable + " WHERE field = '" + field + "' AND sobject = '" + sobject + "';");
            var layoutSet;
            try {
                layoutSet = db.execute("SELECT rendering FROM " + layoutTable + " WHERE field = '" + field + "' AND sobject = '" + sobject + "' LIMIT 1;");
            } catch (e) {
                Ti.API.error("[dynaforce] [contolManager] Exception retrieving field rendering type: " + e);
            }
            var rendering = null;
            if (null != layoutSet) {
                rendering = layoutSet.fieldByName("rendering");
                Ti.API.info("[dynaforce] [contolManager] RENDERING: " + rendering);
                layoutSet.close();
            }
            if (rendering) {
                if ("image" == rendering) {
                    var control = Ti.UI.createImageView({
                        left: 10,
                        width: 70,
                        height: 70
                    });
                    Ti.API.info("[dynaforce] Image name: " + dataRow.fieldByName("Id") + ".png");
                    var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, dataRow.fieldByName("Id") + ".png");
                    f && (control.image = f.nativePath);
                }
            } else var control = Ti.UI.createLabel({
                color: "#000000",
                font: {
                    fontSize: 15,
                    fontWeight: "bold"
                },
                text: dataRow.fieldByName(field),
                left: 10,
                touchEnabled: false,
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE
            });
            if (withLabel) {
                fieldLabel = rowset.fieldByName("label");
                Ti.API.info("[dynaforce] [contolManager] FOUNDED LABEL: " + fieldLabel);
                return getFieldWithLabel(control, fieldLabel);
            }
            return control;
        }
    } else Ti.API.error("[dynaforce] [contolManager] CANNOT FIND THE REQUESTED FIELD!");
    rowset.close();
    db.close();
    return null;
};

exports.editableField = function() {};

exports.catalogView = function(dataRow) {
    var control = Ti.UI.createImageView({
        top: 10,
        width: 200,
        height: 200
    });
    Ti.API.info("[dynaforce] Image name: " + dataRow.fieldByName("Id") + ".png");
    var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, dataRow.fieldByName("Id") + ".png");
    f && (control.image = f.nativePath);
    return control;
};