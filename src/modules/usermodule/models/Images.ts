import mongoose, { Schema, model,  Document } from "mongoose";
export interface ISimpleImage {
    path: string;
    relativepath: string;
    filename: string;
    timestamp: Date;

}
export interface IImage extends Document {
    path: string;
    relativepath: string;
    filename: string;
    timestamp: Date;

}
const imgSchema: Schema = new Schema({ 
    path: { type: String },
    relativepath: { String },
    filename: { String },
    timestamp: { 
        type: Date,
        default: Date.now(),
    },
 });
 export default mongoose.model<IImage>("image", imgSchema);