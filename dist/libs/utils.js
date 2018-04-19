"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const request = require("request");
const DomParser = require("dom-parser");
function requestWebsite(url, onSuccess, onError) {
    request(url, (error, response, body) => {
        if (error) {
            if (onError) {
                onError(error);
            }
        }
        else {
            if (response.statusCode === 200) {
                onSuccess(body);
            }
            else {
                if (onError) {
                    onError(new Error("Unable to connect to StudentenWerk server"));
                }
            }
        }
    });
}
exports.requestWebsite = requestWebsite;
function createDOM(website) {
    return new DomParser().parseFromString(website);
}
exports.createDOM = createDOM;
function parseTimeMoment(dateString) {
    moment.locale("de");
    let format = "dddd, DD. MMMM YYYY";
    let date = moment(dateString, format);
    date = date.locale("zh-cn");
    return { dateString: date.format('L'), dateObject: date.toDate() };
}
exports.parseTimeMoment = parseTimeMoment;
function formatTime(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}
exports.formatTime = formatTime;
function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}
exports.formatNumber = formatNumber;
function isDateEqual(date1, date2) {
    return date1.getYear() == date2.getYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
}
function getWeekIndexRelativeToToday(date) {
    let d = date;
    if (moment.isDate(date)) {
        d = moment(date);
    }
    let startOfWeek = moment().startOf('isoWeek');
    let diff = d.startOf('day').diff(startOfWeek, 'days');
    return Math.floor(diff / 7);
}
exports.getWeekIndexRelativeToToday = getWeekIndexRelativeToToday;
function transformToDateOnly(dateTime) {
    if (moment.isMoment(dateTime)) {
        return dateTime.startOf('day');
    }
    return new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate());
}
console.log(getWeekIndexRelativeToToday(new Date(2018, 2, 4, 12, 15)));
//# sourceMappingURL=utils.js.map