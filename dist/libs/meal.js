"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Info = exports.Meal = exports.MenuItem = exports.Menu = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parser = require("./parser");

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DomParser = require("dom-parser");
var request = require("request");

var Menu = exports.Menu = function Menu(canteen, date) {
    _classCallCheck(this, Menu);

    this.canteen = canteen;
    this.date = date;
    this.items = [];
};

var MenuItem = exports.MenuItem = function MenuItem() {
    _classCallCheck(this, MenuItem);

    this.createdAt = new Date();
};

var Meal = exports.Meal = function (_MenuItem) {
    _inherits(Meal, _MenuItem);

    function Meal() {
        _classCallCheck(this, Meal);

        return _possibleConstructorReturn(this, (Meal.__proto__ || Object.getPrototypeOf(Meal)).call(this));
    }

    _createClass(Meal, [{
        key: "getMealDetail",
        value: function getMealDetail(callback) {

            var url = this.urlDetail;
            var meal = this;

            request(url, function (error, response, body) {
                if (error) {
                    callback(error);
                } else {
                    if (response.statusCode === 200) {
                        var parser = new _parser.Parser(new DomParser().parseFromString(body), url);
                        var newMeal = parser.parseMeal(meal);
                        callback(null, newMeal);
                    } else {
                        console.error("Can not connect to StudentenWerk server");
                    }
                }
            });
        }
    }]);

    return Meal;
}(MenuItem);

var Info = exports.Info = function (_MenuItem2) {
    _inherits(Info, _MenuItem2);

    function Info() {
        _classCallCheck(this, Info);

        return _possibleConstructorReturn(this, (Info.__proto__ || Object.getPrototypeOf(Info)).apply(this, arguments));
    }

    return Info;
}(MenuItem);
//# sourceMappingURL=meal.js.map