import express, { Express } from "express";
import * as bodyParser from "body-parser";
import mongoose, { Mongoose } from "mongoose";
import ClientModules from "./modules/usermodule/init";
import multer, { diskStorage } from "multer";
import path from "path";
import FileUpload from "express-fileupload";


class App {

    public app: Express = express();
    public mongooseClient: Mongoose;

    constructor(){
        this.configurations();
        this.connectDatabase();
        this.initApp();
    }

    public configurations(){
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(FileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
        /*const storage = multer.diskStorage({
            destination: "uploads",
            filename: (req, file, cb) => {
                cb(null, uuid() + path.extname(file.originalname));
            },
        });

        //this.app.use(morgan("dev"));
        this.app.use(multer({ storage }).single("img"));
        this.app.use("/uploads", express.static(path.resolve("uploads")));*/
    }
    public connectDatabase(){
        let host: string = "mongodb://172.20.0.2";
        let dataBase: string = process.env.DATABASE || "blog";
        let connectionString: string = `${host}/${dataBase}`;
        mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        mongoose.connection.on("error", (err) => {
            console.log("ERROR DE CONECCION A LA DB");
            console.log(err);
        });
        mongoose.connection.on("open", () => {
            console.log("BATABASE CONNECTION SUCCESS e");
        });
        this.mongooseClient = mongoose;

    }
    public initApp(){
        console.log("CARGANDO MODULOS");
        const userModules = new ClientModules(this.app);
    }
    
}
export default new App();