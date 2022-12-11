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
        const newCustomer = CustomerModel.create()
    }
);

export { customerRouter }