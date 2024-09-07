import { model } from "mongoose";
import { contactSchemaDocument } from "./contact.types";
import contactSchema from "./contact.schema";

export const Contact = model<contactSchemaDocument>("Contact", contactSchema)