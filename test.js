const interpl = require("./Interpolation.js");

let f = interpl.Polynom([0, 0, 1]);
let f1 = f.derive(2);
// let B = interpl.BSpline([0, 1, 2, 3, 4]);
// let B1 = B._derive();
// let S = interpl.Spline([0, 1, 2, 3], [0, 1, 1, 0], [0, 0]);

console.log("[x, f(x), f1(x), B(x), B1(x), S(x)]");
for (let x = 0; x <= 4; x += .5) {
    console.log([x, f(x), f1(x)]);
}
