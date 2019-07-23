const
    interpl = require("./index.js");

function defaultDerive(n) {
    if (n > 0) return (x) => n * (x ** (n - 1));
    else return (x) => 0;
}

let f = interpl.Polynom([0, 0, 1]);
let f1 = f._derive(defaultDerive);
let B = interpl.BSpline([0, 1, 2, 3, 4]);
let B1 = B._derive();
let S = interpl.Spline([0, 1, 2, 3], [0, 1, 1, 0], 3);

console.log("[x, f(x), f1(x), B(x), B1(x)]");
for (let x = 0; x <= 4; x += .5) {
    console.log([x, f(x), f1(x), B(x), B1(x)]);
}
