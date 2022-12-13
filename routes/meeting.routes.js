import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
// import isAdmin from "../middlewares/isAdmin.js";
import isAuth from "../middlewares/isAuth.js";
import { MeetingModel } from "../model/meeting.model.js";
import { UserModel } from "../model/user.model.js";
import { ProcessModel } from "../model/process.model.js";
import { CustomerModel } from "../model/customer.model.js";

const meetingRouter = express.Router();

//criando uma reunião
//atualizando automaticamente o usuário, o processo e o cliente da reunião
meetingRouter.post(
    "/:customerId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const loggedInUser = req.currentUser;
            const customer = await CustomerModel.findOne({ _id: req.params.customerId });
            const newMeeting = await MeetingModel.create({
                ...req.body,
                advogado: loggedInUser._id,
                customer: req.params.customerId,
                process: customer.process
            });
            console.log(newMeeting);
            await UserModel.findOneAndUpdate(
                { _id: loggedInUser._id },
                { $push: { meetings: newMeeting._id } },
                { runValidators: true }
            );
            await CustomerModel.findOneAndUpdate(
                { _id: req.params.customerId },
                { meeting: newMeeting._id },
                { runValidators: true }
            );
            await ProcessModel.findOneAndUpdate(
                { _id: customer.process },
                { meeting: newMeeting._id },
                { runValidators: true }
            );
            return res.status(201).json(newMeeting);
        } catch (err) {
            console.log(`Erro em meetingRouter.post Back-end ${err}`);
            return res.status(500).json(err);
        }
    }
);

//procurando todas as reuniões
meetingRouter.get(
    "/",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const meetings = await MeetingModel.find({});
            return res.status(200).json(meetings)
        } catch (err) {
            console.log(`Erro em meetingRouter.get/all Back-end ${err}`);
            return res.status(500).json(err);
        }
    }
);

meetingRouter.get(
    "/:meetingId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const meeting = await MeetingModel.findOne({ _id: req.params.meetingId });
            return res.status(200).json(meeting);
        } catch (err) {
            console.log(`Erro em meetingRouter.get/One Back-end ${err}`);
            return res.status(500).json(err);
        }
    }
);

//procurar as reuniões de um advogado especifico
meetingRouter.get(
    "/:advogadoId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const AdvMeetings = await MeetingModel.findOne({ advogado: req.params.advogadoId });
            return res.status(201).json(AdvMeetings);
        } catch (err) {
            console.log(`Erro em meetingRouter.get/advMeetings/all Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

//alterando a data da reunião alvo
meetingRouter.put(
    "/:meetingId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const AlteredMeeting = await MeetingModel.findOneAndUpdate(
                { _id: req.params.meetingId },
                { ...req.body, $push: { updateAt: new Date(Date.now()) } },
                { runValidators: true }
            );
            return res.status(200).json(AlteredMeeting);
        } catch (err) {
            console.log(`Erro em meetingRouter.put Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

//deletando a reunião
//removendo a reunião automaticamente do processo, advogado e do cliente
meetingRouter.delete(
    "/:meetingId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const deletedMeeting = await MeetingModel.deleteOne({ _id: req.params.meetingId });
            await UserModel.findOneAndUpdate(
                { meetings: req.params.meetingId },
                {
                    $pull: { meetings: req.params.meetingId },
                    $push: { updateAt: new Date(Date.now()) }
                },
                { runValidators: true }
            );
            await CustomerModel.findOneAndUpdate(
                { meeting: req.params.meetingId },
                {
                    meeting: null,
                    $push: { updateAt: new Date(Date.now()) }
                },
                { runValidators: true }
            );
            await ProcessModel.findOneAndUpdate(
                { meeting: req.params.meetingId },
                {
                    meeting: null,
                    $push: { updateAt: new Date(Date.now()) }
                },
                { runValidators: true }
            );
            return res.status(200).json(deletedMeeting);
        } catch (err) {
            console.log(`Erro em meetingRouter.delete Back-end: ${err}`);
            return res.status(500).json(err);
        }
    }
);

export { meetingRouter }