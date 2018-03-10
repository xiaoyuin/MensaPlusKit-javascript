"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _canteen = require("./libs/canteen");

Object.keys(_canteen).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _canteen[key];
    }
  });
});
//# sourceMappingURL=index.js.map