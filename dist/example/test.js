"use strict";

var mensaPlusKit = require("../index");

var canteen = mensaPlusKit.canteens[4];
console.log(canteen);

canteen.getMenu(null, function (err, meals) {
    console.log(meals);
    var meal = meals[0];
    meal.getMealDetail(function (err, newMeal) {
        console.log(newMeal);
    });
});
//# sourceMappingURL=test.js.map