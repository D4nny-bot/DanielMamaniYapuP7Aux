import UsersModel, { IUser } from "../models/Users";
import PostModel, { IPost } from "../models/Posts";
import BusinessPost from "./BusinessPost";
import { model } from "mongoose";

class BusinessUser {
    constructor() {

    }
    public async addUsers(user: IUser) {

        try {
            let userdb = new UsersModel(user);
            let result = await userdb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async readUsers(): Promise<Array<IUser>>;
    public async readUsers(id: string): Promise<IUser>;
    public async readUsers(query: any, skip: number, limit: number): Promise<Array<IUser>>;
    
    public async readUsers(params1?: string | any, params2?: number, params3?: number): Promise<Array<IUser>|IUser>{
        if (params1 && typeof params1 == "string") {
            var result: IUser = await UsersModel.findOne({_id: params1});
            return result;
        } else if(params1){
            let skip = params2? params2: 0; 
            let limit = params3? params3: 1;
            let listUser: Array<IUser> = await UsersModel.find(params1).skip(skip).limit(limit);
            return listUser;
        } else {
            let listUser: Array<IUser> = await UsersModel.find();
            return listUser;
        }
    }
    public async updateUsers(id: string, user: any) {
        let result = await UsersModel.update({ _id: id }, { $set: user });
        return result;
    }
    public async deleteUsers(id: string) {
        let result = await UsersModel.remove({ _id: id });
        return result;
    }
    public async addPosts(idu: string, post: IPost) {
        let user = await UsersModel.findOne({ _id: idu });
        if (user != null) {
            user.posts.push(post);
            return await user.save();
        }
        return null;
    }
    public async updatePosts(idu: string, idp: string) {
        let user = await UsersModel.findOne({ _id: idu });
        let post = await PostModel.findOne({ _id: idp });

        //let user1: Array<IPost> = await UsersModel.find(user.posts: idp);
        if (user && post != null) {
            
            let url1: string = post.url;
            let postUser: Array<any> = user.posts;
            
            let con: number = 0;
            while(postUser != null) {
                if(postUser[con]._id == idp){
                    postUser[con] = post;
                    break;
                }
                con++;
            }
            //var uri: string = postUser[1].url;
            
            //console.log("looooool");
            //console.log(postUser);
            let result = await UsersModel.update({ _id: idu }, { $set: {posts: postUser} });
            return await user.save();
            
            
        }
        return null;
        
    }
    public async deleteUserPost(idu: string, idp: string) {
        let user = await UsersModel.findOne({ _id: idu });
        let post = await PostModel.findOne({ _id: idp });
        if (user && post != null) {
            let postUser: Array<any> = user.posts;
            let newPost: Array<any> = user.posts;
            let con: number = 0;
            while(con < postUser.length) {
                if(postUser[con]._id == idp){
                    postUser.splice(con, 1);
                    break;
                }
                con++;
            }
            
            return await user.save();
        }
        return null;

    }

}


export default BusinessUser;