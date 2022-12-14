import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
// import isAdmin from "../middlewares/isAdmin.js";
import isAuth from "../middlewares/isAuth.js";
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
                { $push: { processes: newProcess._id } },
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
            const process = await ProcessModel.findOne({ _id: req.params.processId });
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
            const DesactivProcess = await ProcessModel.findOneAndUpdate(
                { _id: req.params.processId },
                { isActive: false, $push: { updateAt: new Date(Date.now()) } },
                { runValidators: true }
            );
            await UserModel.findOneAndUpdate(
                { processes: req.params.processId },
                {
                    $pull: { processes: req.params.processId },
                    $push: { updateAt: new Date(Date.now()) }
                },
                { runValidators: true }
            )
            await CustomerModel.findOneAndUpdate(
                { processes: req.params.processId },
                {
                    $pull: { processes: req.params.processId },
                    $push: { updateAt: new Date(Date.now()) }
                },
                { runValidators: true }
            )
            await MeetingModel.findOneAndUpdate(
                { process: req.params.processId },
                {
                    meeting: null,
                    $push: { updateAt: new Date(Date.now()) }
                },
                { runValidators: true }
            )
        } catch (err) {
            console.log(`Erro em processRouter.delete Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

export { processRouter }
