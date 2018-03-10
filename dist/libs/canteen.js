"use strict";

var _parser = require("./parser");

var DomParser = require("dom-parser");
var request = require("request");
var canteens = require("./canteens.json");

function getCanteenByName(name) {
    for (var i = 0; i < canteens.length; i++) {
        var canteen = canteens[i];
        if (canteen.name === name || canteen.fullName === name) {
            canteen.getMenu = this.getMenu;
            return canteen;
        }
    }
    return null;
}

function findCanteen(query) {
    return canteens.map(function (canteen) {
        return canteen.name.includes(query);
    });
}

function getMenu(date, callback) {

    var url = this.urlMeals;
    var name = this.name;

    request(url, function (error, response, body) {
        if (error) {
            callback(error);
        } else {
            if (response.statusCode === 200) {
                var parser = new _parser.Parser(new DomParser().parseFromString(body), url);
                var meals = parser.parseMenu();
                callback(null, meals.map(function (m) {
                    if (name) {
                        m.canteenName = name;
                    }
                    return m;
                }));
            } else {
                console.error("Can not connect to StudentenWerk server");
            }
        }
    });
}

function getDetail(callback) {
    //TODO: Not implemented yet

}

module.exports = {
    canteens: canteens.map(function (c) {
        c.getMenu = getMenu;
        return c;
    }),
    getCanteenByName: getCanteenByName,
    findCanteen: findCanteen
};
//# sourceMappingURL=canteen.js.map