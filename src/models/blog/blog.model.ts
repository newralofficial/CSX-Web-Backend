import { model } from "mongoose";
import { blogSchemaDocument } from "./blog.types";
import blogSchema from "./blog.schema";

export const Blog = model<blogSchemaDocument>("Blog", blogSchema)