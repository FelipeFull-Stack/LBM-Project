import { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm
    },
    age: { type: Number },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updateAt: [{ type: Date }],
    isActive: { type: Boolean, default: "true" }, //usar para fazer verificação de email
    function: {
        type: String,
        enum: [
            "ADVOGADO-INICIANTE",
            "ADVOGADO-INTERMEDIARIO",
            "ADVOGADO-SENIOR",
            "SECRETARIA",
            "ESTAGIARIO",
            "DONO"
        ]
    },
    atuation: {
        type: String, enum: [
            "DIREITO DO TRABALHO",
            "DIREITO CIVIL",
            "DIREITO EMPRESARIAL",
            "DIREITO DO CONSUMIDOR",
            "DIREITO ADMINISTRATIVO",
            "DIREITO BANCARIO E OPERACOES FINANCEIRAS",
            "DIREITO ELEITORAL",
            "ARBITRAGEM E MEDICAO",
            "DIREITO IMOBILIARIO",
            "DIREITO AMBIENTAL",
            "DIREITO CONSTITUCIONAL",
            "MERCADO DE CAPITAIS E FINTECH",
            "DIREITO PENAL, PROCESSO PENAL E INQUERITO POLICIAL",
            "DIREITO PREVIDENCIARIO",
            "MARCAS E PATENTES",
            "DIREITO TRIBUTARIO OU FISCAL"
        ]
    },
    meetings: { type: Types.ObjectId, ref: "Meeting" },
    processes: { type: Types.ObjectId, ref: "Process" },
    custumers: { type: Types.ObjectId, ref: "Customer" }
})

export const UserModel = model("User", userSchema)