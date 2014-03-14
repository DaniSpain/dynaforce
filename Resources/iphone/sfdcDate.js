function getDateString(curdate) {
    var year = curdate.getFullYear();
    var month = normalizeDateString(curdate.getMonth() + 1);
    var day = normalizeDateString(curdate.getDate());
    var hours = normalizeDateString(curdate.getHours());
    var minutes = normalizeDateString(curdate.getMinutes());
    var seconds = normalizeDateString(curdate.getSeconds());
    return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds + "Z";
}

function normalizeDateString(datePart) {
    return datePart > 9 ? datePart : "0" + datePart;
}

exports.convertDateTime = function(sfdcDate) {
    var date = sfdcDate.substring(0, 10);
    var time = sfdcDate.substring(11, 19);
    new Date(date + " " + time);
    return date + " " + time;
};

exports.getDateTimeObject = function(sfdcDate) {
    var year = sfdcDate.substring(0, 4);
    var month = sfdcDate.substring(5, 7);
    var day = sfdcDate.substring(8, 10);
    var hour = sfdcDate.substring(11, 13);
    var min = sfdcDate.substring(14, 16);
    var sec = sfdcDate.substring(17, 19);
    var datetime = new Date();
    datetime.setFullYear(year);
    datetime.setMonth(month);
    datetime.setDate(day);
    datetime.setHours(hour);
    datetime.setMinutes(min);
    datetime.setSeconds(sec);
    return datetime;
};

exports.createTodaySfdcDate = function() {
    var curdate = new Date();
    curdate.getFullYear();
    normalizeDateString(curdate.getMonth() + 1);
    normalizeDateString(curdate.getDate());
    normalizeDateString(curdate.getHours());
    normalizeDateString(curdate.getMinutes());
    normalizeDateString(curdate.getSeconds());
    Ti.API.info("[dynaforce] [sfdcDate] UTC String: " + curdate.toUTCString());
    var UTCHours = curdate.toUTCString().substring(17, 19);
    Ti.API.info("[dynaforce] [sfdcDate] UTC hours: " + UTCHours);
    curdate.setHours(UTCHours);
    var datestring = getDateString(curdate);
    Ti.API.info("[dynaforce] [sfdcDate] Current datetime SFDC format: " + datestring);
    return datestring;
};