import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import isAuth from "../middlewares/isAuth.js";
import { ProcessModel } from "../model/process.model.js";
import { CustomerModel } from "../model/customer.model.js";
import { UserModel } from "../model/user.model.js";

const processRouter = express.Router();

processRouter.post(
    "/:customerId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const loggedInUser = req.currentUser;
            const newProcess = ProcessModel.create({
                ...req.body,
                advogado: loggedInUser._id,
                customer: req.params.customerId
            });
            await UserModel.findOneAndUpdate(
                { _id: loggedInUser._id },
                { $push: { processes: newProcess._doc._id } },
                { runValidators: true }
            );
            await CustomerModel.findOneAndUpdate(
                { _id: req.params.customerId },
                { process: newProcess._doc._id },
                { runValidators: true }
            );
            return res.status(201).json(newProcess);
        } catch (err) {
            console.log(`Erro em processRouter.post Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

export { processRouter }
