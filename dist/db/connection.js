"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.initDb = void 0;
const mongodb_1 = require("mongodb");
//import { Callback } from "mongoose";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URI;
const client = new mongodb_1.MongoClient(uri);
let _db = null;
const initDb = async (callback) => {
    if (_db) {
        console.log("Db was initailized previously");
        return callback(null, _db);
    }
    await client.connect()
        .then((client) => {
        _db = client;
        callback(null, _db);
        console.log("Connected to MongoDB");
    })
        .catch((err) => {
        callback(err, null);
        throw new Error("Connection to MongoDB failed: " + err.message);
    });
};
exports.initDb = initDb;
const getDb = () => {
    if (!_db) {
        throw Error("Db not initialized");
    }
    return _db;
};
exports.getDb = getDb;
exports.default = { initDb: exports.initDb, getDb: exports.getDb };
