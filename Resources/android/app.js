var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var SyncObjects = new Array("Account");

Alloy.Globals.force = require("force");

Alloy.Globals.dynaforce = require("dynaforce");

Alloy.Globals.dbName = "appDb";

Alloy.Globals.buttonSize = 140;

Alloy.Globals.buttonRadius = Alloy.Globals.buttonSize / 2;

Alloy.Globals.buttonRadius = Alloy.Globals.buttonSize;

Alloy.Globals.style;

Alloy.Globals.style = Ti.UI.ActivityIndicatorStyle.PLAIN;

Alloy.Globals.top = 0;

Alloy.Globals.tableTop = "50dp";

try {} catch (e) {}

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