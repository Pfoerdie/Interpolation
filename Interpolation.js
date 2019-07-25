const _ = require("./tools.js");

function _defaultBase(n) {
    return (x) => x ** n;
} // _defaultBase

function _defaultDeriv(n, k) {
    if (n - k < 0) return (x) => 0;
    let j = n - k, q = 1;
    for (let i = j; i <= n; i++)
        q *= i;
    return (x) => q * (x ** j);
} // _defaultDeriv

_.define(exports, 'Polynom', Polynom);
function Polynom(coeffs, base, ...derivations) {
    _.assert(_.is.array(coeffs) && coeffs.every(_.is.number));
    _.assert(coeffs.length > 1);
    if (base) {
        if (_.is.function(base))
            base = coeffs.map((coeff, n) => base(n));
        _.assert(_.is.array(base) && base.every(_.is.function));
        _.assert(base.length == coeffs.length);
        derivations = derivations.map(deriv => _.is.function(deriv) ? coeffs.map((coeff, n) => deriv(n)) : deriv);
        _.assert(derivations.every(derivBase => _.is.array(derivBase) && derivBase.length == coeffs.length && derivBase.every(_.is.function)));
    } else {
        _.assert(derivations.length == 0);
        base = coeffs.map((coeff, n) => _defaultBase(n));
        for (let k = 1; k < coeffs.length; k++)
            derivations.push(coeffs.map((coeff, n) => _defaultDeriv(n, k)));
    }
    let P = (x) => coeffs.reduce((sum, coeff, n) => sum + coeff * base[n](x), 0);
    _.define(P, 'derive', function (k = 1) {
        _.assert(_.is.number(k) && k > 0);
        _.assert(k <= derivations.length);
        return Polynom(coeffs, ...(derivations.slice(k - 1)));
    });
    return P;
} // Polynom

_.define(exports, 'BSpline', BSpline);
function BSpline(args) {
    _.assert(_.is.array(args) && args.length > 2 && args.every(_.is.number));
    _.assert(args.length > 2 && args.every((val, index) => index == 0 || val > args[index - 1]));
    let coeffs = new Array(args.length);
    for (let k = 0; k < args.length; k++) {
        coeffs[k] = args.length - 1;
        for (let i = 0; i < args.length; i++)
            if (i != k) coeffs[k] *= 1 / (args[k] - args[i]);
    }
    let deg = coeffs.length - 2;
    let genFns = [];
    let xs = args[0];
    let i = 1;
    for (let j = deg; j >= 0; j--) {
        let q = i;
        genFns.push((n) => {
            let xn = args[n];
            return (x) => (x > xs && x < xn) ? q * ((xn - x) ** j) : 0;
        });
        i *= -j;
    }
    return Polynom(coeffs, ...genFns);
} // BSpline

_.define(exports, 'Spline', Spline);
function Spline(args, values, ...bndValues) {
    // TODO
} // Spline