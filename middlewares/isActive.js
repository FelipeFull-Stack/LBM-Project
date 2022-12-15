import { UserModel } from "../model/user.model.js"

async function isActive(req, res, next) {

    try {
        const userData = req.auth;
        const user = await UserModel.findOne(
            { _id: userData._id },
            { passwordHash: 0 }
        );
        if (user.isActive === false) {
            return res.status(404).json({ msg: "Usuário não encontrado!" })
        }
        req.currentUser = user;
        next();
    } catch (err) {
        console.log(`Erro no isActive.js : ${err}`);
        return res.status(500).json(err);
    }
}

export default isActive