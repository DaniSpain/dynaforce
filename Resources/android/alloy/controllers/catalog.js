function Controller() {
    function closeWindow() {
        $.catalog.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "catalog";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.catalog = Ti.UI.createWindow({
        backgroundColor: "#ffffff",
        navBarHidden: "true",
        id: "catalog"
    });
    $.__views.catalog && $.addTopLevelView($.__views.catalog);
    $.__views.__alloyId0 = Ti.UI.createView({
        top: Alloy.Globals.top,
        height: "50dp",
        width: Ti.UI.FILL,
        backgroundColor: "#ff8a00",
        id: "__alloyId0"
    });
    $.__views.catalog.add($.__views.__alloyId0);
    $.__views.backView = Ti.UI.createView({
        top: 0,
        bottom: 0,
        left: 0,
        width: "50dp",
        id: "backView"
    });
    $.__views.__alloyId0.add($.__views.backView);
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
        text: "Catalog",
        id: "headerTitle"
    });
    $.__views.__alloyId0.add($.__views.headerTitle);
    $.__views.scroller = Ti.UI.createScrollView({
        top: Alloy.Globals.tableTop,
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        layout: "horizontal",
        id: "scroller"
    });
    $.__views.catalog.add($.__views.scroller);
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
    var c = 0;
    var view;
    while (rowset.isValidRow()) {
        var fieldControl = controlmanager.catalogView(rowset);
        if (0 == c % 2) {
            view = Titanium.UI.createView({
                left: "10dp",
                rowId: rowset.fieldByName("Id"),
                height: Ti.UI.FILL,
                width: 300,
                top: "10dp",
                bottom: "10dp",
                layout: "vertical",
                touchEnabled: false,
                horizontalWrap: true
            });
            $.scroller.add(view);
        }
        null != fieldControl && view.add(fieldControl);
        c++;
        rowset.next();
    }
    rowset.close();
    db.close();
    $.catalog.open();
    __defers["$.__views.backView!click!closeWindow"] && $.__views.backView.addEventListener("click", closeWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;