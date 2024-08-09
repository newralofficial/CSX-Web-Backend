import { model } from "mongoose";
import { IOTPStore_Documents } from "./otpStore.types";
import OTPStoreTypes_Schema from "./otpStore.schema";

export const OTP_Store = model<IOTPStore_Documents>(
  "OTP_Store",
  OTPStoreTypes_Schema
);
