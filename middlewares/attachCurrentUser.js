import { UserModel } from "../models/user.model.js"

async function attachCurrentUser(req, res, next) {
    try {
        const userData = req.auth //salvando o Auth da requisição no userData
        const user = await UserModel.findOne(
            { _id: userData._id }, //procurando o id do usuário usando o parâmetro salvo em userData
            { passwordHash: 0 } //removendo o retorno do passwordHash
            )
        if (!user) { //testa se encontrou o usuário
            return res.status(404).json({ msg: "Usuário não encontrado!" })
        }
        req.currentUser = user //colocamos as informações do User dentro da nossa Requisição
        next() //passa a requisição adiante
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

export default attachCurrentUser;