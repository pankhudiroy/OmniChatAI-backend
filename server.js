

// app.use(express.json());
// app.use(cors());

// app.use("/api", chatRoutes);

// const connectDB = async() =>{
//     try{
//        await mongoose.connect(process.env.MONGODB_URI);
//        console.log("connected with DB");
//     }catch(err){
//        console.log("Failed to connect", err);
//     }
// }

// app.listen(PORT , ()=>{
//     console.log(`Server is listening on ${PORT}`);
//     connectDB();
// })
import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080;
// const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with DB");
  } catch (err) {
    console.log("Failed to connect", err);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
  });
});


