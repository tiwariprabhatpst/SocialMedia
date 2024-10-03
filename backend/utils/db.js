import mongoose from "mongoose";

const connectDB = async() =>{
    const uri = "mongodb+srv://prabhatpst0811:Hu1fmqqQbx1VSoVu@cluster0.zfoy9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    try{
        await mongoose.connect(uri);
        console.log("mongoDB connected successfully.");
    }
    catch(error){
        console.log(error);
    }
}
export default connectDB;