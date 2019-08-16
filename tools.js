exports.define = function define(obj, key, value, get, set) {
    Object.defineProperty(obj, key, (get || set) ? { get, set } : { value });
}; // exports.define

exports.enumerate = function enumerate(obj, key, value, get, set) {
    let enumerable = true;
    Object.defineProperty(obj, key, (get || set) ? { get, set, enumerable } : { value, enumerable });
}; // exports.enumerate

exports.assert = function assert(value, msg, errType = Error) {
    if (!value) {
        let err = msg instanceof Error ? msg : new errType(msg);
        Error.captureStackTrace(err, assert);
        throw err;
    }
}; // exports.assert

exports.is = {
    number: val => typeof val === 'number' && !isNaN(val) && val > - Infinity && val < Infinity,
    uInt: val => exports.is.number(val) && val === Math.trunc(val) && val >= 0,
    array: val => Array.isArray(val),
    function: val => typeof val === 'function'
}; // exports.is