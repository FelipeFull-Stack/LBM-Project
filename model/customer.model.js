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
    cpf: { type: String, required: true },
    age: { type: String },
    phone: { type: String },

    createdAt: { type: Date, default: new Date(Date.now()) },
    updateAt: [{ type: Date }],

    advogado: { type: Types.ObjectId, ref: "User" },  //one-to-one
    process: { type: Types.ObjectId, ref: "Process" },//one-to-one
    meeting: { type: Types.ObjectId, ref: "Meeting" },//one-to-one
});

export const CustomerModel = model("Customer", customerSchema)