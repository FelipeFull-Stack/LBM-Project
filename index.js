import express from "express";
import * as dotenv from "dotenv";
import { dbConnection } from "./config/db.config.js"
import { userRouter } from "./routes/user.routes.js";

const app = express();
dotenv.config();
dbConnection();

app.use(express.json());

app.use("/user", userRouter)
//app.use("", router)

app.listen(process.env.PORT, () => {
    console.log(`Porta: ${process.env.PORT}`)
})
