const
    _ = require("./tools.js");

_.define(exports, 'Polynom', Polynom);
function Polynom(coeffs, baseFn = (coeff, n) => (x => coeff * (x ** n))) {
    _.assert(_.is.array(coeffs) && coeffs.length > 1 && coeffs.every(_.is.number));
    _.assert(_.is.function(baseFn));
    let base = coeffs.map(baseFn);
    let P = (x) => coeffs.reduce((sum, coeff, n) => sum + base[n](x), 0);
    _.define(P, '_derive', function (deriveFn) {
        _.assert(_.is.function(deriveFn));
        return Polynom(coeffs, deriveFn);
    });
    return P;
} // Polynom

_.define(exports, 'BSpline', BSpline);
function BSpline(args) {
    _.assert(_.is.array(args) && args.length > 2 && args.every(_.is.number) && args.every((val, index) => index == 0 || val > args[index - 1]));
    let coeffs = new Array(args.length);
    for (let k = 0; k < args.length; k++) {
        coeffs[k] = args.length - 1;
        for (let i = 0; i < args.length; i++)
            if (i != k) coeffs[k] *= 1 / (args[k] - args[i]);
    }
    let deg = coeffs.length - 2;
    let poly = Polynom(coeffs, (coeff, n) => (x => coeff * (Math.max(0, args[n] - x) ** deg)));
    let xmin = args[0], xmax = args[args.length - 1];
    let B = (x) => x <= xmin ? 0 : x >= xmax ? 0 : poly(x);
    _.define(B, '_derive', function () {
        return poly._derive((coeff, n) => (x => deg * coeff * (Math.max(0, args[n] - x) ** (deg - 1))));
    });
    return B;
} // BSpline

_.define(exports, 'Spline', Spline);
function Spline(args, values, deg = 3) {
    deg = parseInt(deg);
    _.assert(_.is.number(deg) && deg > 0);
    _.assert(_.is.array(args) && args.length >= 2 && args.every(_.is.number) && args.every((val, index) => index == 0 || val > args[index - 1]));
    _.assert(_.is.array(values) && values.length == args.length && values.every(_.is.number));
    let base = new Array(args.length + deg - 1);
    for (let k = 0; k < base.length; k++) {
        let i = k - deg, j = k + 1;
        let baseArgs = args.slice(Math.max(0, i), Math.min(base.length, j + 1));
        if (i < 0) baseArgs.unshift(...(new Array(-i).fill(null).map((val, n) => (args[1] - args[0]) * (n - deg))));
        if (j >= args.length) baseArgs.push(...(new Array(j - args.length + 1).fill(null).map((val, n) => args[args.length - 1] + (args[args.length - 1] - args[args.length - 2]) * (n + 1))));
        base[k] = BSpline(baseArgs);
    }
    let deriveBase = base.map(bspline => bspline._derive());
    // TODO
} // Spline