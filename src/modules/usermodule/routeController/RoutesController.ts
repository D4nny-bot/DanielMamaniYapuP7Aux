import { Request, Response } from "express";
//import Routes from ""
import BusinessUser from "../businessController/BusinessUser";
import BusinessPost from "../businessController/BusinessPost";
import BusinessImage from "../businessController/BusinessImage";
import { IUser } from "../models/Users";
import { IPost } from "../models/Posts";
import { IImage, ISimpleImage } from "../models/Images";
import jsonwebtoken from "jsonwebtoken";
import sha1 from "sha1";
import path from "path";
import isEmpty from "is-empty"

interface Icredentials {
    email: string;
    password: string;
}

class RoutesController{
    constructor() {

    }
    public async login(request: Request, response: Response){
        var credentials: Icredentials = request.body;
        if (credentials.email == undefined) {
            response.status(300).json({ serverResponse: "Es necesario el parametro email"});
            return;
        }
        if (credentials.password == undefined) {
            response.status(300).json({ serverResponse: "Es necesario el parametro password"});
            return;
        }
        credentials.password = sha1(credentials.password);
        const user: BusinessUser = new BusinessUser();
        let result: Array<IUser> = await user.readUsers(credentials, 0, 1);
        if (result.length == 1) {
            
            var loginUser: any = result[0];
            var token: string = jsonwebtoken.sign(
                { id: loginUser._id, email: loginUser}, "secret");
            response.status(200).json({ 
                serverResponse: { email: loginUser.email, username: loginUser.username, token }});
             return;
        }
        response.status(200).json({ serverResponse: "credenciales incorrectas" });                          
    }
    public mensaje(req: Request, res: Response){

        res.status(200).json({ serverResponse: "Asignment 5, server runninginn" });
    }
    public async createUsers(req: Request, res: Response) {

        var user: BusinessUser = new BusinessUser();
        var userData = req.body;
        userData["registerdate"] = new Date();
        userData["password"] = sha1(userData["password"]);
        let result = await user.addUsers(userData);
        res.status(200).json({ serverResponse: result });
    }
    public async getUsers(req: Request, res: Response) {
        var user: BusinessUser = new BusinessUser();
        const result: Array<IUser> = await user.readUsers();
        res.status(200).json({ serverResponse: result });
    }
    public async updateUsers(req: Request, res: Response) 
    {
        var user: BusinessUser = new BusinessUser();
        var userId: string = req.params.id;
        var params = req.body;
        var result = await user.updateUsers(userId, params);
        res.status(200).json({ serverResponse: result });
    }
    public async deleteUsers(req: Request, res: Response) {
        var user: BusinessUser = new BusinessUser();
        var id: string = req.params.id;
        var result = await user.deleteUsers(id);
        res.status(200).json({ serverResponse: result });
    }

    //--------------------POSTS-----------------
    public async createPosts(req: Request, res: Response) {

        let idu: string = req.params.id;
        let postData = req.body;
        
        var post: BusinessPost = new BusinessPost();
        const resultpost = await post.createPosts(postData);
        if (idu == null) {
            res.status(300).json({ serverResponse: "no se definio el id" });
        }


        var user: BusinessUser = new BusinessUser();
        var result = await user.addPosts(idu, resultpost);
        if(result == null) {
            res.status(300).json({ serverResponse: "el usuario no existe" });
            return;
        }
        res.status(200).json({ serverResponse: result });
    
    }

    public async getPosts(req: Request, res: Response) {
        var post: BusinessPost = new BusinessPost();
        const result: Array<IPost> = await post.readPosts();
        res.status(200).json({ serverResponse: result });
    }
    
    public async updatePosts(req: Request, res: Response) {
        var post: BusinessPost = new BusinessPost();
        var user: BusinessUser = new BusinessUser();
        var idu: string = req.params.idu;
        var idp: string = req.params.idp;
        if(idu && idp == null) {
            res.status(300).json({ serverResponse: "no se definio el id" });
            return;
        }
        var postData = req.body;
        postData["updatedAt"] = new Date();
        let resultp = await post.updatePosts(idp, postData);
        let resultu = await user.updatePosts(idu, idp);
        if (resultu && resultp == null) {
            res.status(300).json({ serverResponse: "id user o posts incorrecto" });
            return;
        }
        res.status(200).json({ serverResponse: resultu }); 
    
    }
    
    public async deleteUserPosts(req: Request, res: Response) {
        let post: BusinessPost = new BusinessPost();
        let user: BusinessUser = new BusinessUser();
        let idu: string = req.params.idu;
        let idp: string = req.params.idp;
        if(idu && idp == null) {
            res.status(300).json({ serverResponse: "no se definio el id" });
            return;
        }
        let result = await user.deleteUserPost(idu, idp);
        if (result == null) {
            res.status(300).json({ serverResponse: "no existe el user o post" });
            return;
        }
        let removedv = await post.deletePosts(idp);
        res.status(201).json({ serverResponse: result });
            return;
        
    }
    public async deletePosts(req: Request, res: Response) {
        let post: BusinessPost = new BusinessPost();
        let id: string = req.params.id;
        let result = await post.deletePosts(id);
        res.status(200).json({ serverResponse: result });
    }
    //----------------IMAGES-----------------------------
    public async newImage(req: Request, res: Response) {
        
        if (isEmpty(req.files)) {
            res.status(300).json({ serverResponse: "No existe un archivo adjunto" });
            return;
        }
        var dir = `${__dirname}/../Images`;
        var absolutepath = path.resolve(dir);
        var files: any = req.files;
        var key: Array<string> = Object.keys(files);
        var file: any = files[key[0]];

        var filehash: string = sha1(new Date().toString()).substr(0, 8);
        var newname: string = `${filehash}_${file.name}`;
        var totalpath = `${absolutepath}/${newname}`;
        file.mv(`${absolutepath}/${newname})`, async (err: any, seccess: any) => {
            if (err) {
                res.status(300).json({ serverResponse: "No se pudo almacenar el archivo" });
                return;
            }
            var image: BusinessImage = new BusinessImage();
            var simpleImg: any = {
                path: totalpath,
                relativepath: `/api/getImage/${newname}`,
                filename: newname,
                timestamp: new Date(),
            };
            let result = await image.createImage(simpleImg);
            res.status(201).json({ serverResponse: "se añadio correctamente" });
            return;
        });
        
    }

    public async imageData(req: Request, res: Response) {
        let img: BusinessImage = new BusinessImage();
        const result: Array<IImage> = await img.getImage();
        res.status(200).json({ serverResponse: result });
    }

    public async getImage(req: Request, res: Response) {
        var id: string = req.params.id;
        if (!id) {
            res.status(300).json({ serverResponse: "Identificador no encontrado" });
            return;
        }
        var img: BusinessImage = new BusinessImage();
        var ima: IImage = await img.getImage(id);
        if (!ima || null) {
            res.status(300).json({ serverResponse: "Error la imagen no existe" });
            return;
        }
        res.sendFile(ima.path);// sendfile devuelve la imagen q esta en path
        return;
    }
    
}
export default RoutesController;