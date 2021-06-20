 import ImageModel, { IImage } from "../models/Images";

 class BusinessImage {
     constructor(){

     }
     public async createImage(img: IImage) {
         try {
              let ImgDB = new ImageModel(img);
              let result = await ImgDB.save();
              return result;
         } catch (err) {
             return err;
         }
     }
    public async getImage(): Promise<Array<IImage>>;
    public async getImage(id: string): Promise<IImage>;
    public async getImage(params?: string)
    {
        if(params && typeof params == "string"){
            let result: IImage = await ImageModel.findOne({ _id: params });
            return result;
        } else {
            let imgs: Array<IImage> = await ImageModel.find();
            return imgs;
        }
    }
 }
 export default BusinessImage;