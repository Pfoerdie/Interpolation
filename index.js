const
    _ = require("./tools.js");

_.define(exports, 'Polynom', Polynom);
function Polynom(coeffs, base) {
    _.assert(_.is.array(coeffs) && coeffs.length > 1 && coeffs.every(_.is.number));
    if (base) _.assert(_.is.array(base) && coeffs.length == base.length && base.every(_.is.function));
    else base = coeffs.map((coeff, n) => (x => x ** n));
    let polynom = (x) => coeffs.reduce((sum, coeff, n) => sum + coeff * base[n](x), 0);
    return polynom;
} // Polynom

_.define(exports, 'Spline', Spline);
function Spline(args, values) {
    _.assert(_.is.array(args) && args.length > 2 && args.every(_.is.number) && args.every((val, index) => index == 0 || val > args[index - 1]));
    _.assert(_.is.array(values) && values.length == args.length && values.every(_.is.number));

} // Spline

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
    let base = coeffs.map((coeff, n) => (x => Math.max(0, args[n] - x) ** deg));
    let spline = Polynom(coeffs, base);
    return spline;
} // BSpline