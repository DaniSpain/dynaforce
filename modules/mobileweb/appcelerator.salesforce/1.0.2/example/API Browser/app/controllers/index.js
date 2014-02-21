if (OS_IOS && Alloy.isHandheld) {
	Alloy.Globals.navgroup = $.navgroup;
}

$.master.on('detail', function(e) {
	// get the detail controller and window references
	var controller = OS_IOS && Alloy.isTablet ? $.detail : Alloy.createController('detail');
	var win = controller.getView();

	// Defer calling the api until the ui has displayed (login api requires it)
	win.addEventListener('open', function() {
		controller.callApi(e.row.title);
	});
	
	// open the detail windows
	if (OS_IOS && Alloy.isHandheld) {
		Alloy.Globals.navgroup.open(win);
	} else if (OS_ANDROID) {
		win.open();
	}
});

if (OS_ANDROID) {
	$.master.getView().open();
} else {
	$.index.open();
}
