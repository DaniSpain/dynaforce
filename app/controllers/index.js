$.index.open();

function showIndicator(e){
    $.activityIndicator.show();
    // do some work that takes 6 seconds
    // ie. replace the following setTimeout block with your code
}

Alloy.Globals.dynaforce.init();

/*
 * This is a TEST json for testing the DetailLayout table and the visualization on the app
 */
var tmpDetail = [
	{
		'field': 'Name',
		'order': 0,
		'sobject':'Account'	
	},
	{
		'field': 'Rating',
		'order': 1,
		'sobject':'Account'	
	},
	{
		'field': 'LastModifiedDate',
		'order': 2,
		'sobject':'Account'	
	},
	{
		'field': 'IsDeleted',
		'order': 3,
		'sobject':'Account'	
	},
	{
		'field': 'BillingCity',
		'order': 4,
		'sobject':'Account'	
	},
	{
		'field': 'Industry',
		'order': 5,
		'sobject':'Account'	
	}
];

/*
 * This is a TEST json for testing the ListLayout table and the visualization on the app
 */
var tmpList = [
	{
		'field': 'Name',
		'order': 0,
		'sobject':'Account'	
	},
	{
		'field': 'Categoria__c',
		'order': 1,
		'sobject':'Account'	
	},
	{
		'field': 'LastModifiedDate',
		'order': 2,
		'sobject':'Account'	
	},
	
	{
		'field': 'FirstName',
		'order': 0,
		'sobject': 'Contact'
	},
	{
		'field': 'LastName',
		'order': 1,
		'sobject': 'Contact'
	},
	{
		'field': 'Email',
		'order': 2,
		'sobject': 'Contact',
	}
];

var db = Ti.Database.open(Alloy.Globals.dbName);


/*
 * filling DetailLayout with test data tmp_detail
 */
for (var i=0; i<tmpDetail.length; i++) {
	var elem = tmpDetail[i];
	Ti.API.info('[dynaforce] INSERT OR REPLACE INTO DetailLayout VALUES(' + elem.order + ', "' + elem.field + '", "' + elem.sobject + '");');
	try {
		db.execute('INSERT OR REPLACE INTO DetailLayout VALUES(' + elem.order + ', "' + elem.field + '", "' + elem.sobject + '");');
	} catch (e) {
		Ti.API.error('Exception filling sample data in DetailLayout :' + e);
	}
}

/*
 * filling ListLayout with test data tmpList
 */
for (var i=0; i<tmpList.length; i++) {
	var elem = tmpList[i];
	Ti.API.info('[dynaforce] INSERT OR REPLACE INTO ListLayout VALUES(' + elem.order + ', "' + elem.field + '", "' + elem.sobject + '");');
	try {
		db.execute('INSERT OR REPLACE INTO ListLayout VALUES(' + elem.order + ', "' + elem.field + '", "' + elem.sobject + '");');
	} catch (e) {
		Ti.API.error('Exception filling sample data in ListLayout :' + e);
	}
}

db.close();

Alloy.Globals.force.authorize({
	success: function() {
		
		Titanium.API.info("Authenticated to salesforce");
		Alloy.Globals.dynaforce.resetSync();
		Alloy.Globals.dynaforce.startSync({
			success: function() {
				Ti.API.info('[dynaforce] FIRST SYNC SUCCESS');
				try {
					Alloy.Globals.dynaforce.startSync({
						success: function() {
							$.activityIndicator.hide();
						}
					});
				} catch (e) {
					Ti.API.error('[dynaforce] exception in second sync: ' + e);
				}
			}
		});
		//var homeView = Alloy.createController('home').getView();
		//homeView.open();
		
	},
	error: function() {
		Ti.API.info('error');
	},
	cancel: function() {
		Ti.API.info('cancel');
	}
});	

function openAccountList() {
	var listView = Alloy.createController('list', {sobject: 'Account'}).getView();
	listView.open();
}

function openContactList() {
	//alert('not yet implemented -.-');
	var listView = Alloy.createController('list', {sobject: 'Contact'}).getView();
	listView.open();
}



