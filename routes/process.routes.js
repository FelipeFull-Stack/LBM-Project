import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
// import isAdmin from "../middlewares/isAdmin.js";
import isAuth from "../middlewares/isAuth.js";
// import isActive from "../middlewares/isActive";
import { ProcessModel } from "../model/process.model.js";
import { CustomerModel } from "../model/customer.model.js";
import { UserModel } from "../model/user.model.js";
import { MeetingModel } from "../model/meeting.model.js";

const processRouter = express.Router();

//criando o processo do cliente
//criando um registo automaticamente no cliente e no advogado
processRouter.post(
    "/:customerId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const loggedInUser = req.currentUser;
            const newProcess = await ProcessModel.create({
                ...req.body,
                advogado: loggedInUser._id,
                customer: req.params.customerId
            });
            await UserModel.findOneAndUpdate(
                { _id: loggedInUser._id },
                { $push: { processes: newProcess._id } },
                { runValidators: true }
            );
            await CustomerModel.findOneAndUpdate(
                { _id: req.params.customerId },
                { process: newProcess._id },
                { runValidators: true }
            );
            return res.status(201).json(newProcess);
        } catch (err) {
            console.log(`Erro em processRouter.post Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

//procurando todos os processos
processRouter.get(
    "/",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const processes = await ProcessModel.find({});
            return res.status(201).json(processes);
        } catch (err) {
            console.log(`Erro em processRouter.get/all Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

//procurar um processo especifico
processRouter.get(
    "/:processId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const process = await ProcessModel.findOne({ _id: req.params.processId }).populate("advogado").populate("customer").populate("meeting");
            return res.status(201).json(process);
        } catch (err) {
            console.log(`Erro em processRouter.get/one Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

//procurar os processos de um advogado especifico
processRouter.get(
    "/:advogadoId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const AdvProcesses = await ProcessModel.findOne({ advogado: req.params.advogadoId });
            return res.status(201).json(AdvProcesses);
        } catch (err) {
            console.log(`Erro em processRouter.get/one Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

//alterando um processo
processRouter.put(
    "/:processId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const alteredProcess = await ProcessModel.findOneAndUpdate(
                { _id: req.params.processId },
                { ...req.body, $push: { updateAt: new Date(Date.now()) } },
                { runValidators: true }
            );
            return res.status(200).json(alteredProcess);
        } catch (err) {
            console.log(`Erro em processRouter.put Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

processRouter.delete(
    "/:processId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const deletedProcess = await ProcessModel.deleteOne({ _id: req.params.processId });
            await UserModel.findOneAndUpdate(
                { processes: deletedProcess._id },
                {
                    $pull: { processes: deletedProcess._id },
                    $push: { updateAt: new Date(Date.now()) }
                },
                { runValidators: true }
            );
            await CustomerModel.deleteOne({ process: deletedProcess._id });
            await MeetingModel.deleteOne({ process: deletedProcess._id });
            return res.status(200).json(deletedProcess);
        } catch (err) {
            console.log(`Erro em processRouter.delete Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

export { processRouter }
