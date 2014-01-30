var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var SyncObjects = new Array("Account");

Alloy.Globals.force = require("force");

Alloy.Globals.dynaforce = require("dynaforce");

Alloy.Globals.dbName = "appDb";

Alloy.Globals.style;

Alloy.Globals.style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;

Alloy.Globals.top = 0;

Alloy.Globals.tableTop = "50dp";

try {
    if (true && parseInt(Titanium.Platform.version.split(".")[0], 10) >= 7) {
        Alloy.Globals.top = "20dp";
        Alloy.Globals.tableTop = "70dp";
    }
} catch (e) {}

Alloy.Globals.SFDCSQLiteFieldMap = {
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
    picklist: "TEXT"
};

Alloy.createController("index");