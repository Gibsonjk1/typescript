"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = {
    handleErrors: (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next),
    flattenObject: (obj, parentKey = "", result = {}) => {
        for (const key in obj) {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            if (obj[key] !== null &&
                typeof obj[key] === "object" &&
                !Array.isArray(obj[key])) {
                util.flattenObject(obj[key], fullKey, result);
            }
            else {
                result[fullKey] = obj[key];
            }
        }
        return result;
    }
};
exports.default = util;
