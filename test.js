const interpl = require("./Interpolation.js");

let f = interpl.Polynom([0, 0, 1]);
let f1 = f.derive();
let B = interpl.BSpline([0, 1, 2, 3, 4]);
let B1 = B.derive();
let B2 = B1.derive();
let S = interpl.Spline([0, 1, 2, 3], [0, 1, 1, 0], [0, 0]);

let data = [];
let step = .1;
for (let x = -.5; x <= 4.5; x += step) {
    data.push({
        'x': x,
        // 'f(x)': f(x),
        // 'f1(x)': f1(x),
        // 'B(x)': B(x),
        // 'B1(x)': B1(x),
        // 'B2(x)': B2(x),
        'S(x)': S(x)
    });
}
console.table(data);

let values = data.map(datum => datum['S(x)']);
for (let k = Math.max(...values) + step, min = Math.min(...values) - step; k >= min; k -= 1.3 * step) {
    let row = values.map(val => (val >= k && val < k + step) ? "*" : " ").join("");
    console.log(row);
}