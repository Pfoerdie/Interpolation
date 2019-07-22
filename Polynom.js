const
    _ = require("./tools.js");

class Polynom {

    constructor(...coeffs) {
        let deg = coeffs.length - 1;
        while (deg > 0 && !coeffs[deg]) { deg--; }
        coeffs = coeffs.slice(0, deg + 1).map(coeff => _.is.number(coeff) ? x => coeff : coeff);
        _.assert(coeffs.every(coeff => _.is.function(coeff) && _.is.number(coeff(0))));
        _.define(this, '_deg', deg);
        _.define(this, '_coeffs', coeffs);
    } // Polynom#constructor

    calc(val) {
        let sum = this._coeffs[0](val);
        for (let k = 1; k <= this._deg; k++)
            sum += this._coeffs[k](val) * (val ** k);
        return sum;
    } // Polynom#calc

} // Polynom

module.exports = Polynom;