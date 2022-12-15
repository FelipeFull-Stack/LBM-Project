import express from "express";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import { generateToken } from "../config/jwt.config.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAuth from "../middlewares/isAuth.js";
// import isActive from "../middlewares/isActive";
// import isAdmin from "../middlewares/isAdmin.js";
import { UserModel } from "../model/user.model.js";
import { MeetingModel } from "../model/meeting.model.js";
import { CustomerModel } from "../model/customer.model.js";
import { ProcessModel } from "../model/process.model.js";

dotenv.config();
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
    try {
        const { password } = req.body;

        if (
            !password ||
            !password.match(
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
            )
        ) {
            return res.status(400).json({
                msg: "Dados Inválidos",
            });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await UserModel.create({
            ...req.body,
            passwordHash: hashedPassword,
            roler: "USER"
        });
        delete newUser._doc.passwordHash;
        return res.status(201).json(newUser);
    } catch (err) {
        console.log(`Erro no signup Backend: ${err}`);
        return res.status(500).json(err);
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ msg: "Email ou senha invalidos" });
        }

        if (!(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(404).json({ msg: "Email ou senha invalidos" });
        }

        const token = generateToken(user);

        return res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                _id: user._id,
                role: user.role
            },
            token: token
        })
    } catch (err) {
        console.log(`Erro no login Backend: ${err}`);
        return res.status(500).json(err);
    }
});

userRouter.get("/profile", isAuth, attachCurrentUser, async (req, res) => {
    try {
        const loggendInUser = await UserModel.findOne({ _id: req.currentUser._id }).populate("custumers").populate("processes").populate("meetings");
        // const advogado = await UserModel.findOne({ _id: req.params.advogadoId }).populate("customers").populate("processes").populate("meetings");
        return res.status(200).json(loggendInUser);
    } catch (err) {
        console.log(`Erro no profile Backend: ${err}`);
        return res.status(500).json(err);
    }
})

userRouter.delete(
    "/:userId",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const deletedUser = UserModel.deleteOne({ _id: loggendInUser._id });
            await MeetingModel.deleteMany({ advogado: deletedUser._id });
            await CustomerModel.deleteMany({ advogado: deletedUser._id });
            await ProcessModel.deleteMany({ advogado: deletedUser._id });
            return res.status(200).json(deletedUser)
        } catch (err) {
            console.log(`Erro em userRouter.delete - Back-end : ${err}`);
            return res.status(500).json(err);
        }
    }
)




export { userRouter }