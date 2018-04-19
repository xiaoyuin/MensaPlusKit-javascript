import * as moment from "moment"
import * as request from 'request'
import * as DomParser from "dom-parser"

export function requestWebsite(url:string, onSuccess: (website: string) => void, onError?: (err) => void) {
    
    request(url, (error, response, body) => {
        if(error) {
            if (onError) {
                onError(error);
            }
        } else {
            if (response.statusCode === 200) {
                onSuccess(body);
            } else {
                if (onError) {
                    onError(new Error("Unable to connect to StudentenWerk server"));                    
                }
            }
        }
    });

}

export function createDOM(website: string): any {
    return new DomParser().parseFromString(website);
}

export function parseTimeMoment(dateString): {dateString: string, dateObject: Date} {
    moment.locale("de");
    let format = "dddd, DD. MMMM YYYY";
    let date = moment(dateString, format);
    date = date.locale("zh-cn");
    return {dateString: date.format('L'), dateObject: date.toDate()}
}

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