import mongoose from "mongoose";

const OTPStoreTypes_Schema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  storedOTP: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: Date,
    required: true,
    expires: 0,
  },
});

export default OTPStoreTypes_Schema;