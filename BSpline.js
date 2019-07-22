const
    _ = require("./tools.js"),
    Polynom = require("./Polynom.js"),
    Spline = require("./Spline.js");

class BSpline extends Polynom {

    constructor(...coords) {
        _.assert(coords.length > 2 && coords.every(coord => _.is.array(coord) && _.is.number(coord[0]) && _.is.number(coord[1])));
        // TODO
    } // BSpline#constructor

    // constructor(args, values) {
    //     _.assert(_.is.array(args) && _.is.array(values) && args.length > 2 && args.length === values.length && args.every(_.is.number) && values.every(_.is.number));
    //     // TODO
    // } // BSpline#constructor

} // BSpline

module.exports = BSpline;