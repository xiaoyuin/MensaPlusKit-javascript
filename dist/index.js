"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./libs/models");
let canteenJson = require("./data/canteens.json");
exports.canteens = canteenJson.map((c) => new models_1.Canteen(c));
function getCanteenByName(name) {
    return exports.canteens.find(c => c.name === name || c.fullName === name);
}
exports.getCanteenByName = getCanteenByName;
function findCanteen(query) {
    return exports.canteens.find((canteen) => canteen.name.includes(query));
}
exports.findCanteen = findCanteen;
//# sourceMappingURL=index.js.map