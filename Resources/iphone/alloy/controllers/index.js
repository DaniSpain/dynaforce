function Controller() {
    function showIndicator() {
        $.activityIndicator.show();
    }
    function openAccountList() {
        var listView = Alloy.createController("list", {
            sobject: "Account"
        }).getView();
        listView.open();
    }
    function openContactList() {
        var listView = Alloy.createController("list", {
            sobject: "Contact"
        }).getView();
        listView.open();
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
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    showIndicator ? $.__views.index.addEventListener("open", showIndicator) : __defers["$.__views.index!open!showIndicator"] = true;
    $.__views.activityIndicator = Ti.UI.createActivityIndicator({
        color: "#ffffff",
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: 26,
            fontWeight: "bold"
        },
        style: Alloy.Globals.style,
        top: 50,
        backgroundColor: "#CFCFCF",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        id: "activityIndicator",
        message: "Loading..."
    });
    $.__views.index.add($.__views.activityIndicator);
    $.__views.__alloyId0 = Ti.UI.createView({
        layout: "vertical",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    $.__views.__alloyId1 = Ti.UI.createButton({
        backgroundColor: "#DEDEDE",
        top: 10,
        width: 200,
        height: 100,
        title: "Accounts",
        id: "__alloyId1"
    });
    $.__views.__alloyId0.add($.__views.__alloyId1);
    openAccountList ? $.__views.__alloyId1.addEventListener("click", openAccountList) : __defers["$.__views.__alloyId1!click!openAccountList"] = true;
    $.__views.__alloyId2 = Ti.UI.createButton({
        backgroundColor: "#DEDEDE",
        top: 10,
        width: 200,
        height: 100,
        title: "Contacts",
        id: "__alloyId2"
    });
    $.__views.__alloyId0.add($.__views.__alloyId2);
    openContactList ? $.__views.__alloyId2.addEventListener("click", openContactList) : __defers["$.__views.__alloyId2!click!openContactList"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    Alloy.Globals.dynaforce.init();
    var tmpDetail = [ {
        field: "Name",
        order: 0,
        sobject: "Account"
    }, {
        field: "Rating",
        order: 1,
        sobject: "Account"
    }, {
        field: "LastModifiedDate",
        order: 2,
        sobject: "Account"
    }, {
        field: "IsDeleted",
        order: 3,
        sobject: "Account"
    }, {
        field: "BillingCity",
        order: 4,
        sobject: "Account"
    }, {
        field: "Industry",
        order: 5,
        sobject: "Account"
    } ];
    var tmpList = [ {
        field: "Name",
        order: 0,
        sobject: "Account"
    }, {
        field: "Categoria__c",
        order: 1,
        sobject: "Account"
    }, {
        field: "LastModifiedDate",
        order: 2,
        sobject: "Account"
    }, {
        field: "FirstName",
        order: 0,
        sobject: "Contact"
    }, {
        field: "LastName",
        order: 1,
        sobject: "Contact"
    }, {
        field: "Email",
        order: 2,
        sobject: "Contact"
    } ];
    var db = Ti.Database.open(Alloy.Globals.dbName);
    for (var i = 0; tmpDetail.length > i; i++) {
        var elem = tmpDetail[i];
        Ti.API.info("[dynaforce] INSERT OR REPLACE INTO DetailLayout VALUES(" + elem.order + ', "' + elem.field + '", "' + elem.sobject + '");');
        try {
            db.execute("INSERT OR REPLACE INTO DetailLayout VALUES(" + elem.order + ', "' + elem.field + '", "' + elem.sobject + '");');
        } catch (e) {
            Ti.API.error("Exception filling sample data in DetailLayout :" + e);
        }
    }
    for (var i = 0; tmpList.length > i; i++) {
        var elem = tmpList[i];
        Ti.API.info("[dynaforce] INSERT OR REPLACE INTO ListLayout VALUES(" + elem.order + ', "' + elem.field + '", "' + elem.sobject + '");');
        try {
            db.execute("INSERT OR REPLACE INTO ListLayout VALUES(" + elem.order + ', "' + elem.field + '", "' + elem.sobject + '");');
        } catch (e) {
            Ti.API.error("Exception filling sample data in ListLayout :" + e);
        }
    }
    db.close();
    Alloy.Globals.force.authorize({
        success: function() {
            Titanium.API.info("Authenticated to salesforce");
            Alloy.Globals.dynaforce.resetSync();
            Alloy.Globals.dynaforce.startSync({
                success: function() {
                    Ti.API.info("[dynaforce] FIRST SYNC SUCCESS");
                    try {
                        Alloy.Globals.dynaforce.startSync({
                            success: function() {
                                $.activityIndicator.hide();
                            }
                        });
                    } catch (e) {
                        Ti.API.error("[dynaforce] exception in second sync: " + e);
                    }
                }
            });
        },
        error: function() {
            Ti.API.info("error");
        },
        cancel: function() {
            Ti.API.info("cancel");
        }
    });
    __defers["$.__views.index!open!showIndicator"] && $.__views.index.addEventListener("open", showIndicator);
    __defers["$.__views.__alloyId1!click!openAccountList"] && $.__views.__alloyId1.addEventListener("click", openAccountList);
    __defers["$.__views.__alloyId2!click!openContactList"] && $.__views.__alloyId2.addEventListener("click", openContactList);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;