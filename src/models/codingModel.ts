import mongoose, { Schema, model, Document } from "mongoose";


export interface ICoding extends Document{
    system: string;
    code: string;
    display: string;
}

const codingSchema = new Schema ({
    system: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    display: {
        type: String,
        required: true,
    },

});

export const codingModel = mongoose.model<ICoding>("coding", codingSchema);