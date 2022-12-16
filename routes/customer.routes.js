import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
// import isAdmin from "../middlewares/isAdmin.js";
import isAuth from "../middlewares/isAuth.js";
// import isActive from "../middlewares/isActive";
import { CustomerModel } from "../model/customer.model.js";
import { MeetingModel } from "../model/meeting.model.js";
import { ProcessModel } from "../model/process.model.js";
import { UserModel } from "../model/user.model.js";

const customerRouter = express.Router();

//criando o cadastro de um cliente
//cria um registro automaticamente no perfil do advogado
customerRouter.post(
    "/",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const loggedInUser = req.currentUser;
            const existCPF = await CustomerModel.findOne({
                cpf: req.body.cpf
            });
            if (existCPF) {
                return res.status(500).json({ msg: "Usuário já cadastrado!" });
            }
            const newCustomer = await CustomerModel.create({
                ...req.body,
                advogado: loggedInUser._id
            });
            await UserModel.findOneAndUpdate(
                { _id: loggedInUser._id },
                { $push: { custumers: newCustomer._id } },
                { runValidators: true }
            );
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
            const customer = await CustomerModel.findOne({ _id: req.params.customerId }).populate("advogado").populate("process").populate("meeting");
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
            const alteredCustomer = await CustomerModel.findOneAndUpdate(
                { _id: req.params.customerId },
                {
                    ...req.body,
                    $push: { updateAt: new Date(Date.now()) }
                },
                { runValidators: true }
            );
            return res.status(200).json(alteredCustomer);
        } catch (err) {
            console.log(`Erro em CustomerRouter.put/customer Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

//deletando um cliente - tornando isActive: "true" turn "false"
//remove automaticamente o cliente alvo do perfil do advogado
customerRouter.delete(
    "/:customerId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const DesactivCustomer = await CustomerModel.deleteOne({ _id: req.params.customerId });
            await UserModel.findOneAndUpdate(
                { customers: req.params.customerId },
                {
                    $pull: { customers: req.params.customerId },
                    $push: { updateAt: new Date(Date.now()) }
                },
                { runValidators: true }
            );
            await ProcessModel.findOneAndUpdate(
                { customer: DesactivCustomer._id },
                {
                    customer: 0,
                    $push: { updateAt: new Date(Date.now()) }
                },
                { runValidators: true }
            );
            await MeetingModel.findOneAndUpdate(
                { customer: DesactivCustomer._id },
                {
                    customer: 0,
                    $push: { updateAt: new Date(Date.now()) }
                },
                { runValidators: true }
            );
            return res.status(200).json(DesactivCustomer);
        } catch (err) {
            console.log(`Erro em CustomerRouter.delete (isActive?) Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);


export { customerRouter }