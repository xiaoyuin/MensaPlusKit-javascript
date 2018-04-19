"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
const utils = require("./utils");
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
        utils.requestWebsite(url, (website) => {
            let parser = new parser_1.Parser(utils.createDOM(website), url)
                .setCanteenName(name)
                .setDate(date)
                .setMId(mId);
            let meals = parser.parseMenu();
            callback(null, meals);
        }, (error) => {
            callback(error, null);
        });
    }
    getDetail(callback) {
    }
}
exports.Canteen = Canteen;
class Menu {
    constructor(canteenName, date) {
        this.canteenName = canteenName;
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
        utils.requestWebsite(url, (website) => {
            let parser = new parser_1.Parser(utils.createDOM(website), url);
            let newMeal = parser.parseMeal(meal);
            Object.assign(meal, newMeal);
            callback(null, newMeal);
        }, (error) => {
            callback(error, null);
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