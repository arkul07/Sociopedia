import express from "express";
import cors from "cors";
import multer from "multer";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"
import {register} from "./controllers/auth.js"

// Configs
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//File Storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
// Whenever someone uploads a file to your website it will be saved to the destination folder

const upload = multer({storage}) //This upload variable will be used each time you want to save an uploaded file


app.post("/auth/register", upload.single("picture"), register)

app.use("/auth",authRoutes)


//Setting up mongoose

const port = process.env.PORT || 6001

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(port, () => console.log("Server Started"))
}).catch((err) => console.log(err))