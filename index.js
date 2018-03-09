var canteens = require('./libs/canteen.js');

var c = canteens.canteens[0];
c.getMenu(null, function (err, meals) {
    // console.log(meals)
    meals[0].getDetail(function (err, newMeal) {
        console.log(newMeal)
    })
});

module.exports = {

};