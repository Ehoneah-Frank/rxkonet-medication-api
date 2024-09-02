import mongoose from "mongoose";
import {Schema, Document} from "mongoose";

export interface IIdentifier extends Document {
    system: string;
    value: string;

}

const identifierSchema = new Schema({
    system: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
});

export const identifierModel = mongoose.model<IIdentifier>("identifier", identifierSchema);