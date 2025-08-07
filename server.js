//import
import express from "express";
import database from "./Services/database.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import productRoute from './Routes/productRoute.js'
//use
const app = express();
dotenv.config();
//รับค่าข้อมูลมาแล้วแปลงเป็นjson
app.use(bodyParser.json());
app.use(productRoute)


//port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
});
