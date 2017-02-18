"use strict";
var service_1 = require("./service");
exports.Weather = service_1.Weather;
var path = require("path");
require("./api/get");
var di = require("akala-core");
di.injectWithName(['language'], function (language) {
    language.name = 'weather';
    language.path = path.resolve(__dirname, './interpreter');
    language.register();
})();

//# sourceMappingURL=index.js.map
