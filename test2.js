const
    interpl = require("./index.js");

let f = interpl.Polynom([0, 0, 1]);
let S = interpl.BSpline([0, 1, 2, 3, 4]);

for (let x = 0; x <= 4; x += .5) {
    console.log([x, S(x)]);
}