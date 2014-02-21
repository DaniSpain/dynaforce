// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};




Alloy.Globals.force = require('force');

/** Using externa modules **/
/*
var salesforce = require('appcelerator.salesforce');

Alloy.Globals.connectedApp = new salesforce.ConnectedApp({
        consumerKey : Ti.App.Properties.getString('force.consumer.key'),
        consumerSecret : Ti.App.Properties.getString('force.consumer.secret')
    });
  */
   
Alloy.Globals.dynaforce = require('dynaforce');
Alloy.Globals.dbName = "appDb";

Alloy.Globals.buttonSize = 140;
Alloy.Globals.buttonRadius =Alloy.Globals.buttonSize/2;
if (OS_ANDROID) Alloy.Globals.buttonRadius = Alloy.Globals.buttonSize;


Alloy.Globals.style;
if (Ti.Platform.name === 'iPhone OS'){
  Alloy.Globals.style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
}
else {
  Alloy.Globals.style = Ti.UI.ActivityIndicatorStyle.PLAIN;
}


if (OS_IOS || OS_ANDROID) {
	//Alloy.Collections.todo = Alloy.createCollection('todo');
	Alloy.Globals.top = 0;
	Alloy.Globals.tableTop = '50dp';

	try {
		// check for iOS7
		if (OS_IOS && parseInt(Titanium.Platform.version.split(".")[0], 10) >= 7) {
			Alloy.Globals.top = '20dp';
			Alloy.Globals.tableTop = '70dp';
		}
	} catch(e) {
		// catch and ignore
	}
}
