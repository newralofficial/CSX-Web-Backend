import { Document, Model } from 'mongoose';

  export interface contactTypes {
    firstName: string;
    lastName?: string;
    email: string;
    phoneNumber?:number;
    subject: string;
    message: string;
  }
  
  export interface contactSchemaDocument extends contactTypes , Document {}
  
  export interface contactSchemaModel extends Model<contactTypes> {}