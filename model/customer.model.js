import { Schema, model, Types } from "mongoose";

const customerSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm
    },
    cpf: { type: Number, required, trim: true },
    age: { type: Number },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updateAt: [{ type: Date }],
    process: { type: Types.ObjectId, ref: "Process" },
    meeting: { type: Types.ObjectId, ref: "Meeting" },
    advogado: { type: Types.ObjectId, ref: "User" },
});

export const CustomerModel = model("Customer", customerSchema)