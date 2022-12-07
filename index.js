import express from "express";
import * as dotenv from "dotenv";
import { dbConnection } from "./config/db.config.js"

const app = express();
dotenv.config();
dbConnection();

app.use(express.json());

//app.use("", router)

app.listen(process.env.PORT, () => {
    console.log(`Porta: ${process.env.PORT}`)
})
