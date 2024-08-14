import mongoose from "mongoose";
const { Schema } = mongoose;

const blogSchema = new Schema({
  userId:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  template: {
    type: String,
    enum: ['simple', 'advanced'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  aboutAuthor: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  heroImage: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  embeddedImage: {
    type: String,
    required: false
  },
  comments: [{
    type: Schema.Types.ObjectId
  }],
  likedIds: [{
    type: Schema.Types.ObjectId
  }],
  authorImage: {
    type: String,
    required: true
  },
},
{ timestamps: true }
);

export default blogSchema;

