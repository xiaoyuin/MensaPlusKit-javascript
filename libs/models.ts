import {Parser} from "./parser";
import * as utils from "./utils"

export class Canteen {

    name: string;
    fullName: string;
    address: string;
    coordinates: string;
    notes;
    mId: number;

    urlLogo: string;
    urlDetail: string;
    urlOpenTimes: string;
    urlAnsprechpartner: string;
    urlLageplan: string;
    urlMeals: string;
    urlMealsW1: string;
    urlMealsW2: string;

    constructor(json) {
        Object.assign(this, json);
    }

    getMenu(date, callback: (err, meals) => void): void {

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
            let parser = new Parser(utils.createDOM(website), url)
                .setCanteenName(name)
                .setDate(date)
                .setMId(mId);
            let meals = parser.parseMenu();
            callback(null, meals);
        }, (error) => {
            callback(error, null);
        });

    }

    getDetail(callback: (err, newCanteen) => void): void {

    }
}

export class Menu {

    canteenName: string;
    date: Date;
    items: MenuItem[];

    constructor(canteenName: string, date: Date) {
        this.canteenName = canteenName;
        this.date = date;
        this.items = [];
    }

}

export class MenuItem {

    id: string;
    text: string;
    createdAt: Date;
    canteenName: string;
    date: string;
    dateObject: Date;
    category: string;

    constructor() {
        this.createdAt = new Date();
    }

}

export class Meal extends MenuItem {

    name: string;
    price: string;
    slot: string;
    notes;

    urlDetail: string;
    urlImages: string[];
    urlPicture: string;
    urlThumbnail: string;

    constructor() {
        super();
    }

    getMealDetail(callback: (err, meal) => void): void {

        let url = this.urlDetail;
        let meal = this;

        utils.requestWebsite(url, (website) => {
            let parser = new Parser(utils.createDOM(website), url);
            let newMeal = parser.parseMeal(meal);
            Object.assign(meal, newMeal);
            callback(null, newMeal);
        }, (error) => {
            callback(error, null);
        })
    }

}

export class Info extends MenuItem {

    constructor() {
        super();
    }
}