let mensaPlusKit = require("../dist/index");
let moment = require("moment");

let canteen = mensaPlusKit.canteens[4];
console.log(canteen);

canteen.getMenu(new Date(), function (err, meals) {
    console.log(meals);
    let meal = meals[0];
    meal.getMealDetail(function (err, newMeal) {
        console.log(newMeal);
    })
});

moment.locale("cn")
console.log(moment.weekdays());