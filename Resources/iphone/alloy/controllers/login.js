function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "login";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.login = Ti.UI.createWindow({
        backgroundColor: "#ffffff",
        navBarHidden: "true",
        id: "login"
    });
    $.__views.login && $.addTopLevelView($.__views.login);
    $.__views.__alloyId7 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: "50dp",
        top: Alloy.Globals.top,
        backgroundColor: "#ff8a00",
        id: "__alloyId7"
    });
    $.__views.login.add($.__views.__alloyId7);
    $.__views.__alloyId8 = Ti.UI.createView({
        width: 40,
        height: 40,
        top: Alloy.Globals.tableTop,
        backgroundColor: "#33B5E5",
        left: 10,
        id: "__alloyId8"
    });
    $.__views.__alloyId7.add($.__views.__alloyId8);
    $.__views.__alloyId9 = Ti.UI.createImageView({
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        color: "#fff",
        backgroundColor: "transparent",
        image: "/images/icon.png",
        touchEnabled: false,
        id: "__alloyId9"
    });
    $.__views.__alloyId8.add($.__views.__alloyId9);
    $.__views.headerTitle = Ti.UI.createLabel({
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#fff",
        top: 10,
        left: "60dp",
        text: "Login to Salesforce",
        id: "headerTitle"
    });
    $.__views.__alloyId7.add($.__views.headerTitle);
    $.__views.__alloyId10 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        top: Alloy.Globals.tableTop,
        backgroundColor: "#33B5E5",
        layout: "vertical",
        id: "__alloyId10"
    });
    $.__views.login.add($.__views.__alloyId10);
    $.__views.wrapper = Ti.UI.createView({
        width: "90%",
        height: Ti.UI.FILL,
        top: 10,
        backgroundColor: "#33B5E5",
        id: "wrapper",
        layout: "vertical"
    });
    $.__views.__alloyId10.add($.__views.wrapper);
    $.__views.__alloyId11 = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: 18
        },
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000000",
        top: 10,
        text: "Username",
        textAlign: "left",
        id: "__alloyId11"
    });
    $.__views.wrapper.add($.__views.__alloyId11);
    $.__views.usrField = Ti.UI.createTextField({
        width: Ti.UI.FILL,
        top: 10,
        height: 48,
        id: "usrField",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        color: "#336699"
    });
    $.__views.wrapper.add($.__views.usrField);
    $.__views.__alloyId12 = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: 18
        },
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000000",
        top: 10,
        text: "Password",
        textAlign: "left",
        id: "__alloyId12"
    });
    $.__views.wrapper.add($.__views.__alloyId12);
    $.__views.pwdField = Ti.UI.createTextField({
        width: Ti.UI.FILL,
        top: 10,
        height: 48,
        id: "pwdField",
        passwordMask: "true",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        color: "#336699"
    });
    $.__views.wrapper.add($.__views.pwdField);
    $.__views.__alloyId13 = Ti.UI.createButton({
        width: Ti.UI.FILL,
        height: 48,
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: 18
        },
        top: 30,
        color: "#ffffff",
        backgroundColor: "#669900",
        title: "Login",
        id: "__alloyId13"
    });
    $.__views.wrapper.add($.__views.__alloyId13);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;