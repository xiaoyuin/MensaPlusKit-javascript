import {Parser} from "./parser";

let DomParser = require("dom-parser");
let request = require("request");

export class Menu {

    constructor(canteen, date) {
        this.canteen = canteen;
        this.date = date;
        this.items = [];
    }

}

export class MenuItem {

    constructor() {
        this.createdAt = new Date();

    }

}

export class Meal extends MenuItem {

    constructor() {
        super();
    }

    getMealDetail(callback) {

        let url = this.urlDetail;
        let meal = this;

        request(url, function (error, response, body) {
            if (error) {
                callback(error)
            } else {
                if (response.statusCode === 200) {
                    let parser = new Parser(new DomParser().parseFromString(body), url);
                    let newMeal = parser.parseMeal(meal);
                    callback(null, newMeal);
                } else {
                    console.error("Can not connect to StudentenWerk server");
                }
            }
        })
    }

}

export class Info extends MenuItem {

}

