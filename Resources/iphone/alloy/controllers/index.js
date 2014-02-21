function Controller() {
    function showIndicator() {
        $.activityIndicator.setMessage("Validate User Credentials");
        $.activityIndicator.show();
    }
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
    function openProducts() {
        $.activityIndicator.setMessage("Reading Products Data");
        $.activityIndicator.show();
        var listView = Alloy.createController("list", {
            sobject: "Product__c"
        }).getView();
        listView.open();
        $.activityIndicator.hide();
    }
    function openCatalog() {
        $.activityIndicator.setMessage("Reading Products Data");
        $.activityIndicator.show();
        var catalog = Alloy.createController("catalog", {
            sobject: "Product__c"
        }).getView();
        catalog.open();
        $.activityIndicator.hide();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#ffffff",
        navBarHidden: "true",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    showIndicator ? $.__views.index.addEventListener("open", showIndicator) : __defers["$.__views.index!open!showIndicator"] = true;
    $.__views.__alloyId3 = Ti.UI.createView({
        top: Alloy.Globals.top,
        height: "50dp",
        width: Ti.UI.FILL,
        backgroundColor: "#ff8a00",
        id: "__alloyId3"
    });
    $.__views.index.add($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createView({
        left: 10,
        width: 40,
        height: 40,
        id: "__alloyId4"
    });
    $.__views.__alloyId3.add($.__views.__alloyId4);
    $.__views.__alloyId5 = Ti.UI.createImageView({
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        color: "#fff",
        backgroundColor: "transparent",
        image: "/images/icon.png",
        touchEnabled: false,
        id: "__alloyId5"
    });
    $.__views.__alloyId4.add($.__views.__alloyId5);
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
    $.__views.__alloyId3.add($.__views.headerTitle);
    $.__views.content = Ti.UI.createView({
        top: Alloy.Globals.tableTop,
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        backgroundColor: "#33B5E5",
        id: "content"
    });
    $.__views.index.add($.__views.content);
    $.__views.__alloyId6 = Ti.UI.createView({
        layout: "horizontal",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        horizontalWrap: "true",
        id: "__alloyId6"
    });
    $.__views.content.add($.__views.__alloyId6);
    $.__views.__alloyId7 = Ti.UI.createButton({
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
        id: "__alloyId7"
    });
    $.__views.__alloyId6.add($.__views.__alloyId7);
    openAccountList ? $.__views.__alloyId7.addEventListener("click", openAccountList) : __defers["$.__views.__alloyId7!click!openAccountList"] = true;
    $.__views.__alloyId8 = Ti.UI.createButton({
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
        id: "__alloyId8"
    });
    $.__views.__alloyId6.add($.__views.__alloyId8);
    openContactList ? $.__views.__alloyId8.addEventListener("click", openContactList) : __defers["$.__views.__alloyId8!click!openContactList"] = true;
    $.__views.__alloyId9 = Ti.UI.createButton({
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
        title: "Products",
        id: "__alloyId9"
    });
    $.__views.__alloyId6.add($.__views.__alloyId9);
    openProducts ? $.__views.__alloyId9.addEventListener("click", openProducts) : __defers["$.__views.__alloyId9!click!openProducts"] = true;
    $.__views.__alloyId10 = Ti.UI.createButton({
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
        title: "Catalog",
        id: "__alloyId10"
    });
    $.__views.__alloyId6.add($.__views.__alloyId10);
    openCatalog ? $.__views.__alloyId10.addEventListener("click", openCatalog) : __defers["$.__views.__alloyId10!click!openCatalog"] = true;
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
    Alloy.Globals.dynaforce.init();
    Alloy.Globals.force.authorize({
        success: function() {
            Titanium.API.info("Authenticated to salesforce");
            Alloy.Globals.dynaforce.resetSync();
            $.activityIndicator.setMessage("Sync Layout Configurations");
            Alloy.Globals.dynaforce.syncLayoutConf({
                indicator: $.activityIndicator,
                success: function() {
                    $.activityIndicator.setMessage("Sync Data Models");
                    Alloy.Globals.dynaforce.startSync({
                        indicator: $.activityIndicator,
                        success: function() {
                            $.activityIndicator.setMessage("Downloading Images");
                            Alloy.Globals.dynaforce.downloadImages({
                                success: function() {
                                    $.activityIndicator.hide();
                                }
                            });
                        }
                    });
                }
            });
        },
        expired: function() {
            Ti.API.info("[dynaforce] Session Expired");
            $.index.close();
        },
        error: function() {
            Ti.API.info("error");
        },
        cancel: function() {
            Ti.API.info("cancel");
        }
    });
    $.index.open();
    __defers["$.__views.index!open!showIndicator"] && $.__views.index.addEventListener("open", showIndicator);
    __defers["$.__views.__alloyId7!click!openAccountList"] && $.__views.__alloyId7.addEventListener("click", openAccountList);
    __defers["$.__views.__alloyId8!click!openContactList"] && $.__views.__alloyId8.addEventListener("click", openContactList);
    __defers["$.__views.__alloyId9!click!openProducts"] && $.__views.__alloyId9.addEventListener("click", openProducts);
    __defers["$.__views.__alloyId10!click!openCatalog"] && $.__views.__alloyId10.addEventListener("click", openCatalog);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;