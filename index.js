import express from "express";
import * as dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(express.json());

//app.use("", router)

app.listen(process.env.PORT, () => {
    console.log(`Porta: ${process.env.PORT}`)
})
