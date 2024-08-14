import { model } from "mongoose";
import { commentSchemaDocument } from "./comment.types";
import commentSchema from "./comment.schema";

export const Comment = model<commentSchemaDocument>("Comment", commentSchema)