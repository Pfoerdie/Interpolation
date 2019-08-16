const _ = require("./tools.js");
const _private = new WeakSet();

function _defaultBase(n, k) {
    _.assert(_.is.uInt(n) && _.is.uInt(k));
    if (n - k < 0) return (x) => 0;
    let j = n - k, q = 1;
    for (let i = j + 1; i <= n; i++) q *= i;
    return (x) => q * (x ** j);
}

function Polynom(coeffs, ...baseArr) {
    _.assert(!new.target);
    _.assert(_.is.array(coeffs) && coeffs.every(_.is.number));
    if (baseArr.length == 0) baseArr = new Array(coeffs.length).fill(_defaultBase);
    baseArr = baseArr.map((base, k) => _.is.function(base) ? coeffs.map((a, n) => base(n, k)) : base);
    _.assert(baseArr.length > 0 && baseArr.every((base, k) => _.is.array(base) && base.length == coeffs.length && base.every(_.is.function)));
    const _coeffs = new Float64Array(coeffs);
    const [_base, ..._derivs] = baseArr;
    let P = (x) => _coeffs.reduce((sum, coeff, n) => sum + coeff * _base[n](x), 0);
    _.define(P, 'derive', function (k = 1) {
        _.assert(_.is.uInt(k) && k <= _derivs.length);
        return Polynom(coeffs, ..._derivs);
    });
    return P;
} // Polynom

module.exports = Polynom;