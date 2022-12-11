import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import isAuth from "../middlewares/isAuth.js";
import { CustomerModel } from "../model/customer.model.js";

const customerRouter = express.Router();

customerRouter.post(
    "/",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        const loggedInUser = req.currentUser;
        const newCustomer = CustomerModel.create({
            ...req.body,
            advogado: loggedInUser._id
        });
        return res.status(201).json(newCustomer);
    }
);



export { customerRouter }