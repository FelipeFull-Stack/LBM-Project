import { Schema, model, Types } from "mongoose";

const processSchema = new Schema({
    numProcess: { type: Number, required: true, trim: true },
    type: {
        type: String,
        enum: [
            "CONHECIMENTO",
            "CAUTELAR",
            "EXECUCAO"
        ],
        required: true
    },
    value: { type: Number, required: true },
    etapa: {
        type: String,
        enum: [
            "PETICAO INICIAL",
            "CITACAO",
            "REPLICA",
            "FASE PROBATORIA",
            "SENTENCA",
            "RECURSOS",
            "CUMPRIMENTO DA SENTENCA"
        ],
    },
    comarca: {//a ideia inicial era colocar um enum para cada comarca (MAS SÃO 231 COMARCAS DIFERENTES FORA AS EXCLUSIVAS)
        type: String,
        required: true,
        trim: true
    },
    advogado: { type: Types.ObjectId, ref: "User" },
    meeting: { type: Types.ObjectId, ref: "Meeting" },
    customer: { type: Types.ObjectId, ref: "Customer" }

});

export const ProcessModel = model("Process", processSchema);