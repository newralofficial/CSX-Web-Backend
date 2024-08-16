import mongoose, { Schema, model } from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        description: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
      },
      {
        timestamps: true,
      }
    );
    
export default commentSchema;

