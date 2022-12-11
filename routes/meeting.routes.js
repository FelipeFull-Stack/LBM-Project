import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
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
            const newMeeting = MeetingModel.create({
                ...req.body,
                advogado: loggedInUser._id,
                customer: req.params.customerId,
                process: req.params.customerId._doc.process
            });
            await UserModel.findOneAndUpdate(
                { _id: loggedInUser._id },
                { $push: { meetings: newMeeting._doc._id } },
                { runValidators: true }
            );
            await CustomerModel.findOneAndUpdate(
                { _id: req.params.customerId },
                { meeting: newMeeting._doc._id },
                { runValidators: true }
            );
            await ProcessModel.findOneAndUpdate(
                { _id: req.params.customerId._doc.process },
                { meeting: newMeeting._doc._id },
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

export { meetingRouter }