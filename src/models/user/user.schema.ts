import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:true,
    },
    email: {
      type: String,
      required:true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    termsCondations: {
      type: Boolean,
      required: false,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: 'active',
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJwtToken = function () {
  const tokenMap: any = { userId: this._id, phone: this.phone };

  return jwt.sign(tokenMap, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

export default userSchema;
