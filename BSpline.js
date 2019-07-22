const
    _ = require("./tools.js");

class BSpline {

    constructor(...args) {
        _.assert(args.length > 2 && args.every(_.is.number));
        _.assert(args.every((val, index) => index == 0 || val > args[index - 1]));
        let deg = args.length - 2;
        let coeffs = new Array(deg + 2);
        for (let k = 0; k < coeffs.length; k++) {
            coeffs[k] = deg + 1;
            for (let i = 0; i < coeffs.length; i++)
                if (i != k) coeffs[k] *= 1 / (args[k] - args[i]);
        }
        _.define(this, '_deg', deg);
        _.define(this, '_args', args);
        _.define(this, '_coeffs', coeffs);
    } // BSpline#constructor

    calc(val) {
        let sum = 0;
        for (let k = 0; k < this._coeffs.length; k++)
            sum += this._coeffs[k] * (Math.max(0, this._args[k] - val) ** this._deg);
        return sum;
    } // BSpline#calc

} // BSpline

module.exports = BSpline;