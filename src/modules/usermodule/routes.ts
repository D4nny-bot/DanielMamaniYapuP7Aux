import RoutesController from "./routeController/RoutesController";
import { Express } from "express";
import jsonwebtokenSecurity from "./middleware";
class Routes {
    private routesController: RoutesController;
    //private api: string;
    constructor(app: Express) {

        //this.api = "api";
        this.routesController = new RoutesController();
        this.configureRoutes(app);
    }

    private configureRoutes(app: Express) {
        const api: string = "api";
        
        app.route(`/${api}/login`).post(this.routesController.login);
        app.route(`/${api}/mensaje`).get(this.routesController.mensaje);
        app.route(`/${api}/users`).post(jsonwebtokenSecurity, this.routesController.createUsers);
        app.route(`/${api}/users`).get(jsonwebtokenSecurity, this.routesController.getUsers);
        app.route(`/${api}/users/:id`).put(this.routesController.updateUsers);
        app.route(`/${api}/users/:id`).delete(this.routesController.deleteUsers);
        app.route(`/${api}/users/addpost/:id`).put(this.routesController.createPosts);
        app.route(`/${api}/users/updatepost/:idu/:idp`).put(this.routesController.updatePosts);
        app.route(`/${api}/users/deletepost/:idu/:idp`).put(this.routesController.deleteUserPosts);
        //-----------------------POSTS--------------------------
        //app.route(`/${api}/posts/:id`).post(this.routesController.addPosts);
        app.route(`/${api}/posts`).get(this.routesController.getPosts);
        app.route(`/${api}/posts/:id`).delete(this.routesController.deletePosts);

        //-----------------------IMAGE-----------------------
        app.route(`/${api}/newImg`).post(this.routesController.newImage);
        app.route(`/${api}/imagedata`).get(this.routesController.imageData);
        app.route(`/${api}/getimage/:id`).get(this.routesController.getImage);
    }
}
export default Routes;