import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: false,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default contactSchema;
