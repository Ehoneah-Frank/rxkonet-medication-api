import mongoose, { Schema, Document } from "mongoose";
import { codingModel, ICoding } from "./codingModel";
import { IIngredient } from "./IngredientModel";
import { identifierModel, IIdentifier } from "./identifierModel";
import { IManufacturer } from "./manufacturerModel";

export interface IMedication extends Document {
  resourceType: string;
  identifier: IIdentifier[];
  status: string;
  brandName: string;
  code: { coding: ICoding[] };
  doseForm?: { coding: ICoding[] };
  manufacturer: IManufacturer;
  ingredient: IIngredient[];
  type?: string;
}


const medicationSchema = new Schema ({
    resourceType: {
        type: String,
        default: "Medication"
    },
    identifier: [{
        type: Schema.Types.ObjectId,
        ref: "identifier",
        required: true,
    }],
    status: {
        type: String,
        required: true,
    },
    brandName: {
        type: String,
        required: true,
    },
    code: {
        coding: [{
            type: Schema.Types.ObjectId,
            ref: "coding",
            required: true,
        }],
    },
    doseForm: {
        coding: [{
            type: Schema.Types.ObjectId,
            ref: "coding",
        }],
    },
    manufacturer: {
        type: Schema.Types.ObjectId,
        ref: "manufacturer",
        required: true,
    },
    ingredients: [{
        item: { coding: [{ type: Schema.Types.ObjectId, ref: "coding"}]},
        strength: {
            numerator: {
                value: { type: Number, required: true },
                unit: { type: String, required: true },
                system: { type: String, required: true },
                code: { type: String, required: true },
            },
        },
    }],
    type: {
        type: {type: String, enum: ["generic", "brand"], required: false},
    }

});

medicationSchema.index({ brandName: 'text', manufacturer: 'text', 'ingredients.item.coding.display': 'text'});

export const medicationModel = mongoose.model<IMedication>("Medication", medicationSchema);