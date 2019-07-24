const _ = require("./tools.js");

_.define(exports, 'Polynom', Polynom);
function Polynom(coeffs, baseFn, options = {}) {
    _.assert(_.is.array(coeffs) && coeffs.length > 1 && coeffs.every(_.is.number));
    if (!baseFn) {
        baseFn = (coeff, n) => {
            return x => coeff * (x ** n);
        };
        options.deriv = [];
        for (let k = 1; k < coeffs.length; k++) {
            let factor = 1;
            let derivFn = (coeff, n) => {
                if (n - k < 0) return x => 0;
                let nk = n - k;
                for (let i = nk; i <= n; i++)
                    coeff *= i;
                return x => coeff * (x ** nk);
            };
            options.deriv.push(derivFn);
        }
    };
    let base = _.is.function(baseFn) ? coeffs.map(baseFn) : baseFn;
    _.assert(_.is.array(base) && base.length == coeffs.length && base.every(_.is.function));
    if (!options.deriv) options.deriv = [];
    _.assert(_.is.array(options.deriv));
    options.deriv = options.deriv.map(derivFn => _.is.function(derivFn) ? coeffs.map(derivFn) : derivFn);
    _.assert(options.deriv.every(deriv => _.is.array(deriv) && deriv.length == coeffs.length && deriv.every(_.is.function)));
    let P = (x) => coeffs.reduce((sum, coeff, n) => sum + base[n](x), 0);
    _.define(P, 'derive', function (k = 1) {
        _.assert(_.is.number(k) && k > 0 && k <= options.deriv.length);
        return Polynom(coeffs, options.deriv[k - 1], { deriv: options.deriv.slice(k) });
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
    let P = Polynom(coeffs, (coeff, n) => (x => coeff * (Math.max(0, args[n] - x) ** deg)));
    // TODO
} // BSpline

_.define(exports, 'Spline', Spline);
function Spline(args, values, ...bndValues) {
    // TODO
} // Spline