"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
const utils = require("./util");
const request = require("request");
const DomParser = require("dom-parser");
class Canteen {
    constructor(json) {
        Object.assign(this, json);
    }
    getMenu(date, callback) {
        let weekIndex = utils.getWeekIndexRelativeToToday(date);
        if (weekIndex === undefined || weekIndex < 0 || weekIndex > 2) {
            callback(new Error(), []);
            return;
        }
        let urls = [this.urlMeals, this.urlMealsW1, this.urlMealsW2];
        let url = urls[weekIndex];
        let name = this.name;
        let mId = this.mId;
        request(url, function (error, response, body) {
            if (error) {
                callback(error, null);
            }
            else {
                if (response.statusCode === 200) {
                    let parser = new parser_1.Parser(new DomParser().parseFromString(body), url, name, new Date(), mId);
                    let meals = parser.parseMenu();
                    callback(null, meals.map((m) => {
                        if (name) {
                            m.canteenName = name;
                        }
                        return m;
                    }));
                }
                else {
                    console.error("Can not connect to StudentenWerk server");
                }
            }
        });
    }
}
exports.Canteen = Canteen;
class Menu {
    constructor(canteen, date) {
        this.canteen = canteen;
        this.date = date;
        this.items = [];
    }
}
exports.Menu = Menu;
class MenuItem {
    constructor() {
        this.createdAt = new Date();
    }
}
exports.MenuItem = MenuItem;
class Meal extends MenuItem {
    constructor() {
        super();
    }
    getMealDetail(callback) {
        let url = this.urlDetail;
        let meal = this;
        request(url, function (error, response, body) {
            if (error) {
                callback(error, null);
            }
            else {
                if (response.statusCode === 200) {
                    let parser = new parser_1.Parser(new DomParser().parseFromString(body), url, meal.canteenName, new Date(), -1);
                    let newMeal = parser.parseMeal(meal);
                    Object.assign(meal, newMeal);
                    callback(null, newMeal);
                }
                else {
                    console.error("Can not connect to StudentenWerk server");
                }
            }
        });
    }
}
exports.Meal = Meal;
class Info extends MenuItem {
    constructor() {
        super();
    }
}
exports.Info = Info;
//# sourceMappingURL=models.js.map