import express from "express";
import * as dotenv from "dotenv";
import { dbConnection } from "./config/db.config.js";
import { userRouter } from "./routes/user.routes.js";
import { processRouter } from "./routes/process.routes.js"
import { meetingRouter } from "./routes/meeting.routes.js";
import { customerRouter } from "./routes/customer.routes.js";
import { uploadImageRouter } from "./routes/uploadImage.routes.js";
import cors from "cors";

dotenv.config();
const app = express();
dbConnection();

app.use(cors({ origin: process.env.REACT_APP_URL }));//
app.use(express.json());

app.use("/user", userRouter);                //acessa rota de Usuário / Advogado
app.use("/customer", customerRouter);        //acessa rota de Clientes
app.use("/process", processRouter);          //acessa rota de Processos
app.use("/meeting", meetingRouter);          //acessa rota de Reuniões

//rotas extras
app.use("/upload-image", uploadImageRouter); //acessa rota de upload

app.listen(Number(process.env.PORT), () => {
    console.log(`Porta: ${process.env.PORT}`);
})
