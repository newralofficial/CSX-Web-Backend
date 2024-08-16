import { Document, ObjectId, Model, Schema } from 'mongoose';

export interface blogTypes {
  template: 'simple' | 'advanced';
  title: String;
  date: Date;
  heroImage: String;
  content: String;
  embeddedImage?: String;
  comments?: Schema.Types.ObjectId[];
  likedIds?: Schema.Types.ObjectId[];
  tags?: String[];
}

export interface blogSchemaDocument extends blogTypes , Document {}

export interface blogSchemaModel extends Model<blogTypes> {}