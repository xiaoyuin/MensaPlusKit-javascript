import { Canteen } from './libs/models';
import { Parser } from './libs/parser';
import { requestWebsite, createDOM } from './libs/utils';

let canteenJson: any[] = require("./data/canteens.json");

export const URL_MENU_TODAY: string = "https://www.studentenwerk-dresden.de/mensen/speiseplan/";
export const URL_MENU_TOMORROW: string = "https://www.studentenwerk-dresden.de/mensen/speiseplan/";
export const URL_MENSA: string = "https://www.studentenwerk-dresden.de/mensen/mensen_cafeterien.html";


export let canteens: Canteen[] = canteenJson.map((c) => new Canteen(c));

export function getCanteenByName(name): Canteen | undefined {
    return canteens.find(c => c.name === name || c.fullName === name);
}

export function findCanteen(query): Canteen | undefined {
    return canteens.find((canteen) => canteen.name.includes(query))
}

export function getTodayMenu(callback: (error, result) => void) {
    requestWebsite(URL_MENU_TODAY, (website) => {
        let parser = new Parser(createDOM(website), URL_MENU_TODAY);
        callback(null, parser.parseToday());
    }, (error) => {
        callback(error, null);
    });
}