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

//alterando um cliente
customerRouter.put(
    "/:customerId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const modifyCustomer = await CustomerModel.findOneAndUpdate(
                { _id: req.params.customerId },
                { ...req.body },
                { runValidators: true }
            );
            return res.status(200).json(modifyCustomer);
        } catch (err) {
            console.log(`Erro em CustomerRouter.get/advogado-clientes/all Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
)

//deletando um cliente - tornando isActive: "true" turn "false"
customerRouter.delete(
    "/:customerId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const AdvCustomers = await CustomerModel.findOne(
                { _id: req.params.customerId },
                { isActive: false },
                { runValidators: true }
            );
            return res.status(200).json(AdvCustomers);
        } catch (err) {
            console.log(`Erro em CustomerRouter.delete (isActive?) Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);


export { customerRouter }