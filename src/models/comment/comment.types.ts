import { Document, Model, Schema } from 'mongoose';

export interface commentTypes {
  body: string;
  userId: Schema.Types.ObjectId;
  blogId: Schema.Types.ObjectId;
}

export interface commentSchemaDocument extends commentTypes , Document {}

export interface commentSchemaModel extends Model<commentTypes> {}