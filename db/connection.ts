import { MongoClient } from "mongodb";
//import { Callback } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri as string);

let _db: MongoClient | null = null;

export const initDb = async (callback: any) => {
    if (_db) {
        console.log("Db was initailized previously");
        return callback(null, _db);
    }
        await client.connect()
        .then((client: any) =>{
            _db=client;
            callback(null, _db);
            console.log("Connected to MongoDB");
        })
        .catch((err: Error) => {callback(err, null);
        throw new Error("Connection to MongoDB failed: " + err.message);
        });
    };

        export const getDb = () => {
            if (!_db) {
                throw Error("Db not initialized");
            }
            return _db;
        };