import express from "express";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import { generateToken } from "../config/jwt.config.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAuth from "../middlewares/isAuth.js";
// import isAdmin from "../middlewares/isAdmin.js";
import { UserModel } from "../model/user.model.js";

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
        const loggendInUser = req.currentUser;
        return res.status(200).json(loggendInUser);
    } catch (err) {
        console.log(`Erro no profile Backend: ${err}`);
        return res.status(500).json(err);
    }
})






export { userRouter }