import PostsModel, { IPost } from "../models/Posts";
import UsersModel, { IUser } from "../models/Users";

class BusinessPost {
    constructor() {

    }
    public async createPosts(post: IPost){
        try {
            let postdb = new PostsModel(post);
            let result = await postdb.save();
            return result;
        } catch (err) {
            return err;
        }
    }

    public async readPosts(){

        
        const result: Array<IPost> = await PostsModel.find();
        return result;
    }
    public async deletePosts(id: string) {
        let result = await PostsModel.remove({ _id: id });
        return result;
    }
    public async updatePosts(id: string, post: any) {
        let result = await PostsModel.update({ _id: id }, { $set: post });
        return result;
    }

}
export default BusinessPost;
