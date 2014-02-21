function Controller() {
    function closeWindow() {
        $.list.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "list";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.list = Ti.UI.createWindow({
        backgroundColor: "#ffffff",
        navBarHidden: "true",
        id: "list"
    });
    $.__views.list && $.addTopLevelView($.__views.list);
    $.__views.__alloyId11 = Ti.UI.createView({
        top: Alloy.Globals.top,
        height: "50dp",
        width: Ti.UI.FILL,
        backgroundColor: "#ff8a00",
        id: "__alloyId11"
    });
    $.__views.list.add($.__views.__alloyId11);
    $.__views.backView = Ti.UI.createView({
        top: 0,
        bottom: 0,
        left: 0,
        width: "50dp",
        id: "backView"
    });
    $.__views.__alloyId11.add($.__views.backView);
    closeWindow ? $.__views.backView.addEventListener("click", closeWindow) : __defers["$.__views.backView!click!closeWindow"] = true;
    $.__views.backImage = Ti.UI.createImageView({
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        color: "#fff",
        backgroundColor: "transparent",
        image: "/images/ic_action_back.png",
        id: "backImage"
    });
    $.__views.backView.add($.__views.backImage);
    $.__views.headerTitle = Ti.UI.createLabel({
        left: "60dp",
        color: "#fff",
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        text: "My Accounts",
        id: "headerTitle"
    });
    $.__views.__alloyId11.add($.__views.headerTitle);
    $.__views.tblView = Ti.UI.createTableView({
        top: Alloy.Globals.tableTop,
        separatorColor: "#0099CC",
        id: "tblView"
    });
    $.__views.list.add($.__views.tblView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var sobject = args["sobject"];
    Ti.API.info("[dynaforce] PASSED SOBJECT: " + sobject);
    var db = Ti.Database.open(Alloy.Globals.dbName);
    Ti.API.info("[dynaforce] Fetching list fields");
    try {
        var fieldset = db.execute('SELECT * FROM ListLayout WHERE sobject = "' + sobject + '" ORDER BY position ASC; ');
    } catch (e) {
        Ti.API.error("[dynaforce] Exception fetching list field for " + sobject + ": " + e);
    }
    var row = 0;
    var fieldList = [];
    controlmanager = require("controlManager");
    while (fieldset.isValidRow()) {
        Ti.API.info("[dynaforce] LIST LAYOUT ROW[" + row + "] POSITION: " + fieldset.fieldByName("position"));
        Ti.API.info("[dynaforce] LIST LAYOUT ROW[" + row + "] FIELD: " + fieldset.fieldByName("field"));
        Ti.API.info("[dynaforce] LIST LAYOUT ROW[" + row + "] SOBJECT: " + fieldset.fieldByName("sobject"));
        Ti.API.info("[dynaforce] LIST LAYOUT ROW[" + row + "] RENDERING: " + fieldset.fieldByName("rendering"));
        row++;
        var fieldName = fieldset.fieldByName("field");
        fieldList.push(fieldName);
        fieldset.next();
    }
    fieldset.close();
    var selectList = "Id,";
    for (var i = 0; fieldList.length > i; i++) {
        selectList += fieldList[i];
        i != fieldList.length - 1 && (selectList += ",");
    }
    Ti.API.info("[dynaforce] Query: " + selectList);
    Ti.API.info("[dynaforce] Query: SELECT " + selectList + " FROM " + sobject);
    try {
        var rowset = db.execute("SELECT " + selectList + " FROM " + sobject);
    } catch (e) {
        Ti.API.error("[dynaforce] Error queryng " + sobject + " data: " + e);
    }
    var tableData = [];
    while (rowset.isValidRow()) {
        var row = Ti.UI.createTableViewRow({
            className: "listRow",
            selectedBackgroundColor: "#c6eaf7",
            rowId: rowset.fieldByName("Id"),
            height: Ti.UI.SIZE,
            backgroundColor: "#ffffff",
            touchEnabled: true
        });
        var view = Titanium.UI.createView({
            left: 0,
            height: "100dp",
            width: Ti.UI.FILL,
            top: "10dp",
            layout: "vertical",
            touchEnabled: false
        });
        for (var i = 0; fieldList.length > i; i++) {
            var fieldControl = controlmanager.readableField(fieldList[i], sobject, rowset, false, Alloy.Globals.dynaforce.LIST_LAYOUT_TABLE);
            null != fieldControl && view.add(fieldControl);
        }
        row.add(view);
        tableData.push(row);
        rowset.next();
    }
    $.tblView.setData(tableData);
    rowset.close();
    db.close();
    $.list.open();
    $.list.addEventListener("close", function() {
        $.destroy();
    });
    $.tblView.addEventListener("longpress", function(e) {
        alert("Long pressed " + e.rowData.rowId);
    });
    $.tblView.addEventListener("click", function(e) {
        var detailView = Alloy.createController("detail", {
            sobject: sobject,
            id: e.rowData.rowId
        }).getView();
        detailView.open();
    });
    __defers["$.__views.backView!click!closeWindow"] && $.__views.backView.addEventListener("click", closeWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;