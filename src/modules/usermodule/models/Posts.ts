import mongoose, { Schema, Document } from "mongoose";
export interface IPost{
    title: string;
    url: string;
    content: string;
    image?: string;
    createdAt: Date;
    updatedAt?: Date;
}
const postSchema: Schema = new Schema({ 
    title: { type: String, required: true },
    url: { type: String, required: true, lowercase: true },
    content: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
 });
 export default mongoose.model<IPost>("Post", postSchema);