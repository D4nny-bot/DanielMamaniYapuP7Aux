import mongoose, { Schema, Document } from "mongoose";
import { IPost } from "./Posts";
export interface IUser {
    fullname: string;
    username: string;
    password: string;
    email: string;
    registerdate: Date;
    posts: Array<IPost>;
}
const userSchema: Schema = new Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    registerdate: { type: Date, requiered: true },
    posts: { type: Array },
});
export default mongoose.model<IUser>("User", userSchema);