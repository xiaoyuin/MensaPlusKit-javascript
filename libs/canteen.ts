import {Canteen} from "./models";

let canteensJson = require("../data/canteens.json");

export let canteens = canteensJson.map(c => new Canteen(c));

export function getCanteenByName(name) {

    for (let i = 0; i < canteens.length; i++) {
        let canteen = canteens[i];
        if (canteen.name === name || canteen.fullName === name) {
            return canteen
        }
    }
    return null
}

export function findCanteen(query) {
    return canteens.map((canteen) => canteen.name.includes(query))
}

