import { Schema, model, Types } from "mongoose";

const processSchema = new Schema({
    numProcess: { type: Number, required: true },
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
    // isActive: { type: Boolean, default: true },

    advogado: { type: Types.ObjectId, ref: "User" },    //one-to-one
    customer: { type: Types.ObjectId, ref: "Customer" },//one-to-one
    meeting: { type: Types.ObjectId, ref: "Meeting" }   //one-to-one

});

export const ProcessModel = model("Process", processSchema);