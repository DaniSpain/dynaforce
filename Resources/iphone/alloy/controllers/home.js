function Controller() {
    function openAccountList() {
        $.activityIndicator.setMessage("Reading Account Data");
        $.activityIndicator.show();
        var listView = Alloy.createController("list", {
            sobject: "Account"
        }).getView();
        listView.open();
        $.activityIndicator.hide();
    }
    function openContactList() {
        $.activityIndicator.setMessage("Reading Contact Data");
        $.activityIndicator.show();
        var listView = Alloy.createController("list", {
            sobject: "Contact"
        }).getView();
        listView.open();
        $.activityIndicator.hide();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.home = Ti.UI.createWindow({
        backgroundColor: "#ffffff",
        navBarHidden: "true",
        id: "home"
    });
    $.__views.home && $.addTopLevelView($.__views.home);
    $.__views.__alloyId0 = Ti.UI.createView({
        top: Alloy.Globals.top,
        height: "50dp",
        width: Ti.UI.FILL,
        backgroundColor: "#ff8a00",
        id: "__alloyId0"
    });
    $.__views.home.add($.__views.__alloyId0);
    $.__views.__alloyId1 = Ti.UI.createView({
        left: 10,
        width: 40,
        height: 40,
        id: "__alloyId1"
    });
    $.__views.__alloyId0.add($.__views.__alloyId1);
    $.__views.__alloyId2 = Ti.UI.createImageView({
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        color: "#fff",
        backgroundColor: "transparent",
        image: "/images/icon.png",
        touchEnabled: false,
        id: "__alloyId2"
    });
    $.__views.__alloyId1.add($.__views.__alloyId2);
    $.__views.headerTitle = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#fff",
        left: "60dp",
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        text: "Dynaforce",
        id: "headerTitle"
    });
    $.__views.__alloyId0.add($.__views.headerTitle);
    $.__views.content = Ti.UI.createView({
        top: Alloy.Globals.tableTop,
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        backgroundColor: "#33B5E5",
        id: "content"
    });
    $.__views.home.add($.__views.content);
    $.__views.__alloyId3 = Ti.UI.createView({
        layout: "horizontal",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        horizontalWrap: "true",
        id: "__alloyId3"
    });
    $.__views.content.add($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createButton({
        color: "#0099CC",
        backgroundColor: "#ffffff",
        backgroundSelectedColor: "#c6eaf7",
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: 18
        },
        top: 10,
        left: 10,
        borderRadius: Alloy.Globals.buttonRadius,
        width: Alloy.Globals.buttonSize,
        height: Alloy.Globals.buttonSize,
        title: "Accounts",
        id: "__alloyId4"
    });
    $.__views.__alloyId3.add($.__views.__alloyId4);
    openAccountList ? $.__views.__alloyId4.addEventListener("click", openAccountList) : __defers["$.__views.__alloyId4!click!openAccountList"] = true;
    $.__views.__alloyId5 = Ti.UI.createButton({
        color: "#0099CC",
        backgroundColor: "#ffffff",
        backgroundSelectedColor: "#c6eaf7",
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: 18
        },
        top: 10,
        left: 10,
        borderRadius: Alloy.Globals.buttonRadius,
        width: Alloy.Globals.buttonSize,
        height: Alloy.Globals.buttonSize,
        title: "Contacts",
        id: "__alloyId5"
    });
    $.__views.__alloyId3.add($.__views.__alloyId5);
    openContactList ? $.__views.__alloyId5.addEventListener("click", openContactList) : __defers["$.__views.__alloyId5!click!openContactList"] = true;
    $.__views.activityIndicator = Ti.UI.createActivityIndicator({
        color: "#ffffff",
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: 16,
            fontWeight: "bold"
        },
        style: Alloy.Globals.style,
        top: 0,
        backgroundColor: "#0099CC",
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        id: "activityIndicator"
    });
    $.__views.content.add($.__views.activityIndicator);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.home.open();
    Alloy.Globals.dynaforce.init();
    __defers["$.__views.__alloyId4!click!openAccountList"] && $.__views.__alloyId4.addEventListener("click", openAccountList);
    __defers["$.__views.__alloyId5!click!openContactList"] && $.__views.__alloyId5.addEventListener("click", openContactList);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;