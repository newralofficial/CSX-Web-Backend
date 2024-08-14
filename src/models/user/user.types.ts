import { Document, Model } from "mongoose";

export interface ISocialLinks {
  instagram?: String;
  twitter?: String;
  linkedIn?: String;
}
export interface userTypes {
  name: String;
  email:String;
  gender?: String;
  password: String;
  profilePicture?:String;
  termsCondations:Boolean;
  status:String;
  refreshToken?: String;
  socials?: ISocialLinks;

};

export interface userSchemaDocument extends userTypes , Document {}

export interface userSchemaModel extends Model<userTypes> {}