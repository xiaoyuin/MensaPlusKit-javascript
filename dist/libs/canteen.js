"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./models");
let canteensJson = require("../data/canteens.json");
exports.canteens = canteensJson.map(c => new models_1.Canteen(c));
function getCanteenByName(name) {
    for (let i = 0; i < exports.canteens.length; i++) {
        let canteen = exports.canteens[i];
        if (canteen.name === name || canteen.fullName === name) {
            return canteen;
        }
    }
    return null;
}
exports.getCanteenByName = getCanteenByName;
function findCanteen(query) {
    return exports.canteens.map((canteen) => canteen.name.includes(query));
}
exports.findCanteen = findCanteen;
//# sourceMappingURL=canteen.js.map