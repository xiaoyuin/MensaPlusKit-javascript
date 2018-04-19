"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./libs/models");
const parser_1 = require("./libs/parser");
const utils_1 = require("./libs/utils");
let canteenJson = require("./data/canteens.json");
exports.URL_MENU_TODAY = "https://www.studentenwerk-dresden.de/mensen/speiseplan/";
exports.URL_MENU_TOMORROW = "https://www.studentenwerk-dresden.de/mensen/speiseplan/";
exports.URL_MENSA = "https://www.studentenwerk-dresden.de/mensen/mensen_cafeterien.html";
exports.canteens = canteenJson.map((c) => new models_1.Canteen(c));
function getCanteenByName(name) {
    return exports.canteens.find(c => c.name === name || c.fullName === name);
}
exports.getCanteenByName = getCanteenByName;
function findCanteen(query) {
    return exports.canteens.find((canteen) => canteen.name.includes(query));
}
exports.findCanteen = findCanteen;
function getTodayMenu(callback) {
    utils_1.requestWebsite(exports.URL_MENU_TODAY, (website) => {
        let parser = new parser_1.Parser(utils_1.createDOM(website), exports.URL_MENU_TODAY);
        callback(null, parser.parseToday());
    }, (error) => {
        callback(error, null);
    });
}
exports.getTodayMenu = getTodayMenu;
//# sourceMappingURL=index.js.map