const
    Polynom = require("./Polynom.js"),
    Spline = require("./Spline.js"),
    BSpline = require("./BSpline.js");

let f = new Polynom(0, -1, -5, 1);
let S = new Polynom(x => x - 1, x => x / 3, x => 3 * x ** 2 - x);

for (let x = 0; x <= 10; x += 1) {
    console.log([x, f.calc(x), S.calc(x)]);
}