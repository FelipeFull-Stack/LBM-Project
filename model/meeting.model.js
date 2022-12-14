import { Schema, model, Types } from "mongoose";

const meetingSchema = new Schema({
    date: { type: Date, required: true },
    time: { type: Number, required: true },
    type: {
        type: String,
        enum: [
            "CONCILIACAO OU MEDIACAO",
            "INSTRUCAO E JULGAMENTO",
            "JUSTIFICACAO"
        ]
    },
    // content: { type: String },

    advogado: { type: Types.ObjectId, ref: "User" },    //one-to-one
    customer: { type: Types.ObjectId, ref: "Customer" },//one-to-one
    process: { type: Types.ObjectId, ref: "Process" }   //one-to-one

});

export const MeetingModel = model("Meeting", meetingSchema);