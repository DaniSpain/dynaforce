$.index.open();

function showIndicator(e){
    $.activityIndicator.show();
    // do some work that takes 6 seconds
    // ie. replace the following setTimeout block with your code
}

Alloy.Globals.dynaforce.init();


Alloy.Globals.force.authorize({
	success: function() {
		
		Titanium.API.info("Authenticated to salesforce");
		Alloy.Globals.dynaforce.resetSync();
		$.activityIndicator.setMessage('Sync Layout Configurations');
		Alloy.Globals.dynaforce.syncListLayoutConf({
			success: function() {
				$.activityIndicator.setMessage('Sync Account Structure & Data');
				Alloy.Globals.dynaforce.startSync({
					success: function() {
						Ti.API.info('[dynaforce] Account SYNC SUCCESS');
						$.activityIndicator.setMessage('Sync Contact Structure & Data');
						try {
							Alloy.Globals.dynaforce.startSync({
								success: function() {
									Ti.API.info('[dynaforce] Contact SYNC SUCCESS');
									$.activityIndicator.hide();
								}
							});
						} catch (e) {
							Ti.API.error('[dynaforce] exception in second sync: ' + e);
						}
					}
				});
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



