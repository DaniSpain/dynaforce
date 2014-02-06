
/**
 * Converts a SFDC date to a SQLite readable date
 * @param String sfdcDate the date in Salesforce format
 * @return the converted Date object
 */
exports.convertDateTime = function(sfdcDate) {
	var date = sfdcDate.substring(0,10);
	var time = sfdcDate.substring(11,19);
	var datetime = new Date(date + ' ' + time);
	//Ti.API.log('[sfdcDate] Converted Date: ' + datetime);
	return date + ' ' + time;
	//return datetime;
};

exports.getDateTimeObject = function(sfdcDate) {
	var year = sfdcDate.substring(0,4);
	var month = sfdcDate.substring(5,7);
	var day = sfdcDate.substring(8,10);
	var hour = sfdcDate.substring(11,13);
	var min = sfdcDate.substring(14,16);
	var sec = sfdcDate.substring(17,19);
	var datetime = new Date();
	datetime.setFullYear(year);
	datetime.setMonth(month);
	datetime.setDate(day);
	datetime.setHours(hour);
	datetime.setMinutes(min);
	datetime.setSeconds(sec);
	return datetime;
};
