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
  date: {
    type: Date,
    required: false,
    default: Date.now()
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
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  likedIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required:false,
  }],
  tags: [{
    type: String,
    required: false
  }]
},
{ timestamps: true }
);

export default blogSchema;

