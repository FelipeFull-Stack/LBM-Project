import { Schema, model, Types } from "mongoose";

const meetingSchema = new Schema({
    date: { type: Date, required: true },
    type: {
        type: String,
        enum: [
            "CONCILIACAO OU MEDIACAO",
            "INSTRUCAO E JULGAMENTO",
            "JUSTIFICACAO"
        ]
    },
    customer: { type: Types.ObjectId, ref: "Customer" },
    process: { type: Types.ObjectId, ref: "Process" },
    advogado: { type: Types.ObjectId, ref: "User" }

});

export const MeetingModel = model("Meeting", meetingSchema);