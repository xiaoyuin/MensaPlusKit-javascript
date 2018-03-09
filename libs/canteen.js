let canteens = require("./canteens.json");
let request = require("request");
let DomParser = require("dom-parser");
let parser = require("./parser");
let mealMethods = require("./meal");

function getCanteenByName(name) {
    for (let i = 0; i < canteens.length; i++) {
        let canteen = canteens[i];
        if (canteen.name === name || canteen.fullName === name) {
            canteen.getMenu = this.getMenu;
            return canteen
        }
    }
    return null
}

function findCanteen(query) {
    return canteens.map((canteen) => canteen.name.includes(query))
}

function getMenu(date, callback) {

    let url = this.urlMeals;
    let name = this.name;

    request(url, function (error, response, body) {
        if (error) {
            callback(error)
        } else {
            if (response.statusCode === 200) {
                let meals = parser.parseMenu(new DomParser().parseFromString(body), url);
                callback(null, meals.map((m) => {
                    if (name) {
                        m.canteenName = name;
                    }
                    m.getDetail = mealMethods.getDetail;
                    return m;
                }));
            } else {
                console.error("Can not connect to StudentenWerk server");
            }
        }
    })

}

function getDetail(callback) {
    //TODO: Not implemented yet
}

module.exports = {
    canteens: canteens.map((c) => {
        c.getMenu = getMenu;
        return c;
    }),
    getCanteenByName: getCanteenByName,
    findCanteen: findCanteen,
};

