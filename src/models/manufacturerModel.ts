import mongoose from "mongoose";
import {Schema, Document} from "mongoose"


export interface IManufacturer extends Document {
    name: string;
    address?: string;
    contact?: string;
}

const manufacturerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    contact: {
        type: String,
    },
});

export const manufacturerModel = mongoose.model<IManufacturer>("Manufacturer", manufacturerSchema);
