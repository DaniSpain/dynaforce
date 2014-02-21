function openDetail(e) {
	$.trigger('detail', e);
}

var sections = [];
_.each(Alloy.Globals.data, function(apis, name) {
	var section = Ti.UI.createTableViewSection({
		headerTitle: name
	});
	
	_.each(apis, function(name) {
		section.add(Ti.UI.createTableViewRow({
			title: name
		}));
	});
	
	sections.push(section);
});
$.table.setData(sections);
