"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Parser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _meal = require("./meal");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canteenAlias = {
    "Mensa WUeins / Sportsbar": "Mensa WUeins",
    "BioMensa U-Boot (Bio-Code-Nummer: DE-ÖKO-021)": "BioMensa U-Boot"
};

var Parser = exports.Parser = function () {
    function Parser(doc, url) {
        _classCallCheck(this, Parser);

        this.doc = doc;
        this.base_url = url;
    }

    _createClass(Parser, [{
        key: "parseMenu",
        value: function parseMenu() {
            // not sure if type needs to be checked or not
            var doc = this.doc;
            var base_url = this.base_url;
            // console.log(doc)
            var meals = [];

            var tables = doc.getElementById('spalterechtsnebenmenue').getElementsByTagName('table');
            // console.log(tables)
            for (var i = 0; i < tables.length; i++) {
                var table = tables[i];
                if (table.id !== 'aktionen') {
                    var dateString = table.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[0].textContent;
                    if (!dateString.startsWith("Angebot")) {
                        continue;
                    }
                    var dateJSON = parseTimeMoment(dateString);
                    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                    for (var j = 0; j < rows.length; j++) {
                        var row = rows[j];
                        var iskeinangebot = row.getElementsByClassName('keinangebot').length !== 0;
                        if (iskeinangebot) {
                            // no meals to be parsed (should)
                            // console.debug("No meals today")
                        } else {
                            var infos = row.getElementsByClassName('info');
                            if (infos.length !== 0) {
                                var info = new _meal.Info();
                                Object.assign(info, {
                                    name: infos[0].textContent,
                                    date: dateJSON.dateString,
                                    dateObject: dateJSON.dateObject,
                                    category: 'Information',
                                    slot: 'Information',
                                    urlDetail: null
                                });
                                meals.push(info);
                            } else {
                                // parsing meal item starts
                                var item = row.getElementsByClassName('text')[0];
                                if (item) {
                                    var meal = new _meal.Meal();
                                    Object.assign(meal, {
                                        name: item.textContent,
                                        date: dateJSON.dateString,
                                        dateObject: dateJSON.dateObject
                                    });

                                    // parse urlDetail
                                    var urlDetail = row.getElementsByTagName('a')[0];
                                    if (urlDetail) {
                                        var url = rel2abs(base_url, urlDetail.getAttribute('href'));
                                        if (url.includes('?')) {
                                            url = url.substring(0, url.indexOf('?'));
                                        }
                                        meal.urlDetail = url;
                                    }

                                    // parse urlImages
                                    var vectorImages = ["alkohol.png", "fleischlos.png", "knoblauch.png", "rindfleisch.png", "schweinefleisch.png", "vegan.png"];
                                    var json = [];
                                    var urlImages = row.getElementsByClassName('stoffe')[0];
                                    if (urlImages) {
                                        var a = urlImages.getElementsByTagName('a')[0];
                                        if (a) {
                                            var imgs = a.getElementsByTagName('img');
                                            for (var _i = 0; _i < imgs.length; _i++) {
                                                var img = imgs[_i];
                                                var _url = rel2abs(base_url, img.getAttribute('src'));
                                                for (var _i2 = 0; _i2 < vectorImages.length; _i2++) {
                                                    var vector = vectorImages[_i2];
                                                    if (_url.includes(vector)) {
                                                        _url = vector;
                                                        break;
                                                    }
                                                }
                                                json.push(_url);
                                            }
                                        }
                                    }

                                    meal.urlImages = json;
                                    // parse price information
                                    var price = row.getElementsByClassName('preise')[0];
                                    if (price) {
                                        meal.price = price.textContent.replace('&euro;', '€').replace('&euro;', '€').replace('&nbsp;', '');
                                    }
                                    meals.push(meal);
                                }
                                // parsing meal item ends
                            }
                        }
                    }
                }
            }

            return meals;
        }
    }, {
        key: "parseMeal",
        value: function parseMeal(base_meal) {
            var doc = this.doc;
            var base_url = this.base_url;
            var meal = base_meal;

            // parse slot information
            var slot = doc.getElementById('speiseplandetails').getElementsByTagName('h1')[0].textContent;
            if (slot.includes('Abendangebot')) {
                meal.slot = 'Abendangebot';
            } else if (slot.includes('Sonntagsangebot')) {
                meal.slot = 'Sonntagsangebot';
            } else {
                var startIndex = slot.indexOf('Angebot');
                if (slot.includes(base_meal.canteenName)) {
                    startIndex = slot.indexOf(base_meal.canteenName) + base_meal.canteenName.length;
                }
                var endIndex = slot.indexOf('vom');
                if (startIndex !== -1 && endIndex !== -1) {
                    meal.slot = slot.substring(startIndex, endIndex).trim();
                }
            }

            // parse picture
            var urlPicture = doc.getElementById('essenfoto');
            if (urlPicture) {
                urlPicture = urlPicture.getAttribute('href');
                var url = rel2abs(base_url, urlPicture);
                if (url.includes('?')) {
                    url = url.substring(0, url.indexOf('?'));
                }
                meal.urlPicture = url;
            }

            // parse notes information
            var div = doc.getElementById('speiseplandetailsrechts');
            if (div) {
                var json = {};
                var h2s = div.getElementsByTagName('h2');
                var uls = div.getElementsByTagName('ul');
                for (var i = 0; i < h2s.length; i++) {
                    if (uls[i]) {
                        var lis = uls[i].getElementsByTagName('li');
                        var h2 = h2s[i].textContent;
                        var list = [];
                        for (var j = 0; j < lis.length; j++) {
                            list.push(lis[j].textContent);
                        }
                        json[h2] = list;
                    }
                }
                meal.notes = json;
            } else {
                meal.notes = {};
            }

            // parsing ends
            return meal;
        }
    }, {
        key: "parseToday",
        value: function parseToday() {
            var meals = {};

            var tables = doc.getElementById('spalterechtsnebenmenue').getElementsByTagName('table');
            // console.log(tables)
            for (var i = 0; i < tables.length; i++) {
                var table = tables[i];
                if (table.id !== 'aktionen') {
                    var canteenName = table.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[0].textContent;
                    if (!canteenName.startsWith("Angebot")) {
                        continue;
                    }
                    var canteen = canteenName.substring(8).trim();
                    if (canteen in canteenAlias) {
                        canteen = canteenAlias[canteen];
                    }
                    var rows = table.getElementsByTagName('tbody');
                    var count = 0;
                    for (var j = 0; j < rows.length; j++) {
                        var row = rows[j];
                        var iskeinangebot = row.getElementsByClassName('keinangebot').length !== 0;
                        if (iskeinangebot) {
                            // no meals to be parsed (should)
                            break;
                        } else {
                            var texts = row.getElementsByClassName('text');
                            count += texts.length;
                        }
                    }
                    meals[canteen] = count;
                }
            }
            return meals;
        }
    }]);

    return Parser;
}();

function parseTimeMoment(dateString) {
    var moment = require("moment");
    moment.locale("de");
    var format = "dddd, DD. MMMM YYYY";
    var date = moment(dateString, format);
    date = date.locale("zh-cn");
    return { dateString: date.format('L'), dateObject: date };
}

function parseTime(dateString) {
    var format = "dddd, DD. MMMM YYYY";
    var fecha = require("fecha");
    fecha.i18n = {
        dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        amPm: ['am', 'pm'],
        // D is the day of the month, function returns something like...  3rd or 11th
        DoFn: function DoFn(D) {
            return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
        }
    };
    var daysInChinese = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var date = fecha.parse(dateString, format);
    return {
        dateString: date.getMonth() + 1 + "月" + date.getDate() + "日" + "（" + daysInChinese[date.getDay()] + "）",
        dateObject: date
    };
}

function rel2abs(base, relative) {
    if (relative.startsWith('//')) {
        return "https:" + relative;
    }
    var stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); // remove current file name (or empty string)
    // (omit if "base" is the current folder without trailing slash)
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] == ".") continue;
        if (parts[i] == "..") stack.pop();else stack.push(parts[i]);
    }
    return stack.join("/");
}
//# sourceMappingURL=parser.js.map