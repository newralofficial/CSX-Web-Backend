import { Document, Model } from "mongoose";

export interface IOTPStore {
    mobileNumber: String,
    storedOTP: String,
    expirationTime: Date
}

export interface IOTPStore_Documents extends IOTPStore, Document {}

export interface IOTPStore_Model extends Model<IOTPStore> {};

