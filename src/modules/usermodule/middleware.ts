import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction, request, response } from "express";
import BusinessUser from "./businessController/BusinessUser";
import { IUser } from "./models/Users";
import Posts, { IPost } from "./models/Posts";

var jsonwebtokenSecurity = (req: Request, res: Response, next: NextFunction) => {
    var token: string = req.headers["authorization"];
    if (!token) {
        res.status(300).json({ serverResponse: "no tiene acceso a este endpoint" });
        return;
    }
    jsonwebtoken.verify(token, "secret", async(err, success: any) => {
        if(err) {
            res.status(300).json({ serverResponse: "Token no valido " + err.message });
            return;
        }
        var id = success.id;
        var user: BusinessUser =new BusinessUser();
        var userdata: IUser = await user.readUsers(id);
        if(!userdata){
            res.status(300).json({ serverResponse: "el usuario no existe" });
            return;
        }
        var posts: Array<IPost> = userdata.posts;
        console.log("loooosoosos");
        console.log(req.url);
        if(success) {
            next();
            return;
        }
        res.status(300).json({ serverResponse: "Usted no cuenta con los servicios" });
    });
}
export default jsonwebtokenSecurity;