import { Canteen } from './libs/models';

let canteenJson: any[] = require("./data/canteens.json");

export let canteens: Canteen[] = canteenJson.map((c) => new Canteen(c));

export function getCanteenByName(name): Canteen | undefined {
    return canteens.find(c => c.name === name || c.fullName === name);
}

export function findCanteen(query): Canteen | undefined {
    return canteens.find((canteen) => canteen.name.includes(query))
}

