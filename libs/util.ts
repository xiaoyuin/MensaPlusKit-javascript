import * as moment from "moment"

export function formatTime(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function isDateEqual(date1, date2) {
    return date1.getYear() == date2.getYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate()
}

export function getWeekIndexRelativeToToday(date) {
    let d = date;
    if (moment.isDate(date)) {
        d = moment(date);
    }
    let startOfWeek = moment().startOf('isoWeek');
    let diff = d.startOf('day').diff(startOfWeek, 'days');
    return Math.floor(diff / 7);
}

function transformToDateOnly(dateTime) {
    if (moment.isMoment(dateTime)) {
        return dateTime.startOf('day');
    }
    return new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate())
}

console.log(getWeekIndexRelativeToToday(new Date(2018, 2, 4, 12, 15)));