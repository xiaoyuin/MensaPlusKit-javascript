var sampleMeal1 = {
    id: null,
    name: "Schwarzwurzel Karree, dazu Tomatenratatouille, bunter Eisbergsalat mit Joghurt-Kräuterdressing",
    canteenName: "Mensa Siedepunkt",
    category: "",
    slot: "Angebot Ausgabe Mitte",
    date: "5月12日（周五）",
    price: "2,80 € / 4,50 €",
    urlPicture: "https://bilderspeiseplan.studentenwerk-dresden.de/m6/201705/183884.jpg?date=201705121518",
    urlDetail: "https://www.studentenwerk-dresden.de/mensen/speiseplan/details-183884.html",
    notes: {},
    urlImages: [],
}

var sampleMeal2 = {
    id: null,
    name: "Schwarzwurzel Karree, dazu Tomatenratatouille, bunter Eisbergsalat mit Joghurt-Kräuterdressing",
    canteenName: "Mensa Siedepunkt",
    category: "",
    slot: "Angebot Ausgabe Mitte",
    date: "5月12日（周五）",
    price: "2,80 € / 4,50 €",
    urlPicture: "https://bilderspeiseplan.studentenwerk-dresden.de/m6/201705/183884.jpg?date=201705121518",
    urlDetail: "https://www.studentenwerk-dresden.de/mensen/speiseplan/details-183884.html",
    notes: {},
    urlImages: [],
}

let request = require("request");
let DomParser = require("dom-parser");
let parser = require("./parser");

function getDetail(callback) {

    let url = this.urlDetail;
    let meal = this;

    request(url, function (error, response, body) {
        if (error) {
            callback(error)
        } else {
            if (response.statusCode === 200) {
                let newMeal = parser.parseMeal(new DomParser().parseFromString(body), url, meal);
                callback(null, newMeal);
            } else {
                console.error("Can not connect to StudentenWerk server");
            }
        }
    })

}

module.exports = {
    getDetail: getDetail
};