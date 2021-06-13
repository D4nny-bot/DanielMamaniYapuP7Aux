import { Express } from "express";
import Routes from "./routes";
class usermodule {
    private routes: Routes;
    constructor(app: Express) {
        console.log("INIT USER MODULE");
        this.routes = new Routes(app);
    }
}
export default usermodule;