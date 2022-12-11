import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import isAuth from "../middlewares/isAuth.js";
import { CustomerModel } from "../model/customer.model.js";

const customerRouter = express.Router();

//criando o cadastro de um cliente
customerRouter.post(
    "/",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const loggedInUser = req.currentUser;
            const newCustomer = CustomerModel.create({
                ...req.body,
                advogado: loggedInUser._id
            });
            return res.status(201).json(newCustomer);
        } catch (err) {
            console.log(`Erro em CustomerRouter.post Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

//procurando todos os clientes
customerRouter.get(
    "/",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const customers = await CustomerModel.find({});
            return res.status(200).json(customers);
        } catch (err) {
            console.log(`Erro em CustomerRouter.get/all Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

//procurando um cliente especifico
customerRouter.get(
    "/:customerId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const customer = await CustomerModel.findOne({ _id: req.params.customerId });
            return res.status(200).json(customer);
        } catch (err) {
            console.log(`Erro em CustomerRouter.get/one Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

//procurando todos os clientes de um advogado especifico
customerRouter.get(
    "/:advogadoId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const AdvCustomers = await CustomerModel.findOne({ advogado: req.params.advogadoId });
            return res.status(200).json(AdvCustomers);
        } catch (err) {
            console.log(`Erro em CustomerRouter.get/advogado-clientes/all Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

export { customerRouter }