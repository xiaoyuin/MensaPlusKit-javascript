let mensaPlusKit = require("../index");

let canteen = mensaPlusKit.canteens[4];
console.log(canteen);

canteen.getMenu(null, function (err, meals) {
    console.log(meals);
    let meal = meals[0];
    meal.getMealDetail(function (err, newMeal) {
        console.log(newMeal);
    })
});