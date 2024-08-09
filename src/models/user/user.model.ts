import { model } from "mongoose";
import { userSchemaDocument } from "./user.types";
import userSchema from "./user.schema";

export const User = model<userSchemaDocument>("User", userSchema)