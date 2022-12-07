import express from "express";
import * as dotenv from "dotenv";
import { UserModel } from "../model/user.model.js"
import bcrypt from "bcrypt"

dotenv.config();
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
    try {
        const { password } = req.body
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
        return res.status(201).json(newUser)
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})

export { userRouter }