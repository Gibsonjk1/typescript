import { Request, Response, NextFunction } from "express";
const util = {

handleErrors: (fn: Function) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next),

flattenObject: (obj: any, parentKey = "", result: any = {}) => {
  for (const key in obj) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (
      obj[key] !== null &&
      typeof obj[key] === "object" &&
      !Array.isArray(obj[key])
    ) {
      util.flattenObject(obj[key], fullKey, result);
    } else {
      result[fullKey] = obj[key];
    }
  }
  return result;
}
}

export const { handleErrors, flattenObject } = util;
export default util;