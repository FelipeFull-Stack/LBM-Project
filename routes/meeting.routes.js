import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import isAuth from "../middlewares/isAuth.js";
import { MeetingModel } from "../model/meeting.model.js";

const meetingRouter = express.Router();

meetingRouter.post(
    "/",
    isAuth,
    attachCurrentUser,
    async (req, res) => {

    }
);

export { meetingRouter }