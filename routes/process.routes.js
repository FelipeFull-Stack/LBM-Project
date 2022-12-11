import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import isAuth from "../middlewares/isAuth.js";
import { ProcessModel } from "../model/process.model.js";

const processRouter = express.Router();

processRouter.post(
    "/",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const loggendInUser = req.currentUser;
            const newProcess = ProcessModel.create({
                
            });
        } catch (err) {
            console.log(`Erro em processRouter.post Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

export { processRouter }
