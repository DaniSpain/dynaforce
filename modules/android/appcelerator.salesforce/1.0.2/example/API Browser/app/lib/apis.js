var salesforce = require('appcelerator.salesforce');

// Create an instance of our connected application
var connectedApp = new salesforce.ConnectedApp({
	//contentType : 'application/xml',      // 'application/json' is the default
	//accept : 'application/xml',           // 'application/json' is the default
	consumerKey : Alloy.CFG.consumerKey,
	consumerSecret : Alloy.CFG.consumerSecret,
	securityToken : Alloy.CFG.securityToken,
	apiVersion : 'v26.0'
});

var lastId = Ti.App.Properties.getString('lastId');
var lastImageId = Ti.App.Properties.getString('lastImageId');

exports.versions = function(logResults) {
	salesforce.versions({
		success : logResults,
		error : logResults
	});
};

exports.login = function(logResults) {
	connectedApp.login({
		success : logResults,
		error : logResults
	});
};

exports.loginApi = function(logResults) {
	connectedApp.loginApi({
		username : Alloy.CFG.username,
		password : Alloy.CFG.password,
		success : logResults,
		error : logResults
	});
};

exports.logout = function(logResults) {
	connectedApp.logout({
		success : logResults,
		error : logResults
	});
};

exports.refresh = function(logResults) {
	connectedApp.refresh({
		success : logResults,
		error: logResults
	});
};

exports.sobjects = function(logResults) {
	connectedApp.sobjects({
		success : logResults,
		error : logResults
	});
};

exports.metadata = function(logResults) {
	connectedApp.metadata({
		name: 'Account',
		success : logResults,
		error : logResults
	});
};

exports.describe = function(logResults) {
	connectedApp.describe({
		name: 'Account',
		success : logResults,
		error : logResults
	});
};

exports.create = function(logResults) {
	var data;
	
	if (connectedApp.contentType == 'application/json') {
		data = {
			"Name" : "Express Logistics and Transport"
		};
	} else {
		data = Ti.XML.parseString('<Record>' +
			'<Name>Express Logistics and Transport</Name>' +
			'</Record>'
		);
	}
	connectedApp.create({
		name: 'Account',
		data: data,
		success : function(results, meta) {
			logResults(results,  meta);
			if (meta.contentType.match(/application\/json/i)) {
				lastId = results.id;
			} else if (meta.contentType.match(/application\/xml/i)) {
				data = results.documentElement.getElementsByTagName('id');
				if (data && data.length > 0) {
					lastId = data.item(0).textContent;
				}
			}
			// Persist the id 
			Ti.App.Properties.setString('lastId', lastId);
		},
		error : logResults
	});
};

exports.retrieve = function(logResults) {
	connectedApp.retrieve({
		name: 'Account',
		id: lastId,
		success : logResults,
		error : logResults,
		progress: function(progress) {
			Ti.API.info((progress * 100) + '%');
		}
	});
};

exports.update = function(logResults) {
	var data;
	
	if (connectedApp.contentType == 'application/json') {
		data = {
			"BillingCity" : "San Francisco"
		};
	} else {
		data = Ti.XML.parseString('<Record>' +
			'<BillingCity>San Francisco</BillingCity>' +
			'</Record>'
		);
	}
	connectedApp.update({
		name: 'Account',
		id: lastId,
		data: data,
		success : logResults,
		error : logResults
	});
};

exports.remove = function(logResults) {
	connectedApp.remove({
		name: 'Account',
		id: lastId,
		success : logResults,
		error : logResults
	});
};

exports.query = function(logResults) {
	connectedApp.query({
		soql: 'SELECT name from Account',
		success : logResults,
		error : logResults
	});
};

exports.searchQuery = function(logResults) {
	connectedApp.searchQuery({
		sosl: 'FIND {express}',
		success : logResults,
		error : logResults
	});
};

exports.searchScopeOrder = function(logResults) {
	connectedApp.searchScopeOrder({
		success : logResults,
		error : logResults
	});
};

exports.upsertBlob = function(logResults) {
	var file = Ti.Filesystem.getFile('appIcon.png');
	if (!file.exists()) {
		throw new Error('Missing `appicon.png` file');
	}
	var blob = file.read();
	var data;

	if (connectedApp.contentType == 'application/json') {
		data = {
			"Name" : "App Icon",
			"FolderId": "00li0000000UAFuAAO",
			"Type": 'png',
			"ContentType": blob.mimeType
		};
	} else {
		data = Ti.XML.parseString('<Record>' +
			'<Name>App Icon</Name>' +
			'<FolderId>00li0000000UAFuAAO</FolderId>' +
			'<Type>png</Type>' +
			'<ContentType>' + blob.mimeType + '</ContentType>' +
			'</Record>'
		);
	}
	connectedApp.upsertBlob({
		name: 'Document',
		blobField: 'Body',
		blob: blob,
		data: data,
		success : function(results, meta) {
			logResults(results, meta);
			if (meta.contentType.match(/application\/json/i)) {
				lastImageId = results.id;
			} else if (meta.contentType.match(/application\/xml/i)) {
				data = results.documentElement.getElementsByTagName('id');
				if (data && data.length > 0) {
					lastImageId = data.item(0).textContent;
				}
			}
			// Persist the image id
			Ti.App.Properties.setString('lastImageId', lastImageId);
		},
		error : logResults
	});
};

exports.retrieveBlob = function(logResults) {
	connectedApp.retrieveBlob({
		name: 'Document',
		id: lastImageId,
		blobField: 'Body',
		success : function(results, meta) {
			logResults(results, meta);
		},
		error : logResults,
		progress: function(progress) {
			Ti.API.info((progress * 100) + '%');
		}
	});
};

exports.upsertExternal = function(logResults) {
	var data;
	
	if (connectedApp.contentType == 'application/json') {
		data = {
			"Name" : "California Wheat Corporation",
			"Type" : "New Customer"
		};
	} else {
		data = Ti.XML.parseString('<Record>' +
			'<Name>California Wheat Corporation</Name>' +
			'<Type>New Customer</Type>' +
			'</Record>'
		);
	}
	
	connectedApp.upsertExternal({
		name: 'Account',
		fieldName: 'customExtIdField__c',
		fieldValue: '11999',
		data: data,
		success : logResults,
		error : logResults
	});
};

exports.retrieveExternal = function(logResults) {
	connectedApp.retrieveExternal({
		name: 'Account',
		fieldName: 'customExtIdField__c',
		fieldValue: '11999',
		success : logResults,
		error : logResults
	});
};
