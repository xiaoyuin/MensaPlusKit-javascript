'use strict';

function formatTime(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}

function isDateEqual(date1, date2) {
    return date1.getYear() == date2.getYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
}

function getWeekIndexRelativeToToday(date) {}

function transformToDateOnly() {}

module.exports = {
    formatTime: formatTime,
    isDateEqual: isDateEqual,
    getWeekIndexRelativeToToday: getWeekIndexRelativeToToday
};
//# sourceMappingURL=util.js.map