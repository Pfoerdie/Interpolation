const
    Polynom = require("./Polynom.js"),
    BSpline = require("./BSpline.js");

// let f = new Polynom(0, -1, -5, 1);
// let S = new Polynom(x => x - 1, x => x / 3, x => 3 * x ** 2 - x);
// let B = new BSpline(0.5, 1.5, 2.5, 3.5);
// console.log(f, S, B);

// for (let x = 0; x <= 4; x += .1) {
//     console.log([x, f.calc(x), S.calc(x), B.calc(x)].map(val => Math.round(val * 1e5) / 1e5).join("\t|\t"));
// }

const
    min = 0,
    max = 100,
    step = 2.5,
    args = (new Array(Math.trunc((max - min) / step))).fill(null).map((val, index) => min + step * index),
    deg = 2,
    splines = (new Array(args.length - deg - 2)).fill(null).map((val, index) => new BSpline(...args.slice(index, index + deg + 2))),
    falseInterPoly = new Polynom(...splines.map(spline => spline.calc.bind(spline)));

for (let x = min; x <= max; x += step) {
    console.log([x, falseInterPoly.calc(x)].join("\t|\t"));
}