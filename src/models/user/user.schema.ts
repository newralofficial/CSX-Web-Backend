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
    socials:{
      instagram:{
        type:String,
        required:false
      },
      twitter:{
        type:String,
        required:false
      },
      linkedIn:{
        type:String,
        required:false
      },
    },
  },
  { timestamps: true }
);

export default userSchema;
