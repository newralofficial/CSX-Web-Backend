import { Document, Model } from "mongoose";

export interface userTypes {
  name: String;
  email:String;
  gender?: String;
  password: String;
  profilePicture?:String;
  termsCondations:Boolean;
  status:String;
  refreshToken?: String;
};

export interface userSchemaDocument extends userTypes , Document {}

export interface userSchemaModel extends Model<userTypes> {}