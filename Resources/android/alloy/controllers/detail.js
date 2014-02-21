function Controller() {
    function closeWindow() {
        $.detail.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "detail";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.detail = Ti.UI.createWindow({
        backgroundColor: "#ffffff",
        navBarHidden: "true",
        id: "detail"
    });
    $.__views.detail && $.addTopLevelView($.__views.detail);
    $.__views.__alloyId1 = Ti.UI.createView({
        top: Alloy.Globals.top,
        height: "50dp",
        width: Ti.UI.FILL,
        backgroundColor: "#ff8a00",
        id: "__alloyId1"
    });
    $.__views.detail.add($.__views.__alloyId1);
    $.__views.backView = Ti.UI.createView({
        top: 0,
        bottom: 0,
        left: 0,
        width: "50dp",
        id: "backView"
    });
    $.__views.__alloyId1.add($.__views.backView);
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
    $.__views.__alloyId1.add($.__views.headerTitle);
    $.__views.__alloyId2 = Ti.UI.createScrollView({
        top: Alloy.Globals.tableTop,
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        layout: "vertical",
        id: "__alloyId2"
    });
    $.__views.detail.add($.__views.__alloyId2);
    $.__views.container = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        layout: "horizontal",
        horizontalWrap: "true",
        id: "container"
    });
    $.__views.__alloyId2.add($.__views.container);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var sobject = args["sobject"];
    var id = args["id"];
    Ti.API.info("[dynaforce] [detail] PASSED SOBJECT: " + sobject);
    Ti.API.info("[dynaforce] [detail] PASSED ID: " + id);
    var db = Ti.Database.open(Alloy.Globals.dbName);
    Ti.API.info("[dynaforce] Fetching detail fields");
    try {
        var fieldset = db.execute('SELECT * FROM DetailLayout WHERE sobject = "' + sobject + '" ORDER BY position ASC; ');
    } catch (e) {
        Ti.API.error("[dynaforce] Exception fetching detail field for " + sobject + ": " + e);
    }
    var row = 0;
    var fieldList = [];
    controlmanager = require("controlManager");
    while (fieldset.isValidRow()) {
        Ti.API.info("[dynaforce] DETAIL LAYOUT ROW[" + row + "] POSITION: " + fieldset.fieldByName("position"));
        Ti.API.info("[dynaforce] DETAIL LAYOUT ROW[" + row + "] FIELD: " + fieldset.fieldByName("field"));
        Ti.API.info("[dynaforce] DETAIL LAYOUT ROW[" + row + "] SOBJECT: " + fieldset.fieldByName("sobject"));
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
    Ti.API.info("[dynaforce] Query: SELECT " + selectList + " FROM " + sobject + " WHERE Id=" + '"' + id + '"');
    try {
        var rowset = db.execute("SELECT " + selectList + " FROM " + sobject + " WHERE Id=" + '"' + id + '"');
    } catch (e) {
        Ti.API.error("[dynaforce] Error queryng " + sobject + " data: " + e);
    }
    if (rowset) {
        while (rowset.isValidRow()) {
            for (var i = 0; fieldList.length > i; i++) {
                var fieldControl = controlmanager.readableField(fieldList[i], sobject, rowset, true, Alloy.Globals.dynaforce.DETAIL_LAYOUT_TABLE);
                null != fieldControl && $.container.add(fieldControl);
            }
            rowset.next();
        }
        rowset.close();
    }
    db.close();
    $.detail.open();
    __defers["$.__views.backView!click!closeWindow"] && $.__views.backView.addEventListener("click", closeWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;