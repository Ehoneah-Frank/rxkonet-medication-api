import mongoose, { Schema, model } from "mongoose";
import { ICoding } from "./codingModel";

export interface IIngredient extends Document {
  item: { coding: ICoding[] };
  strength: {
    numerator: {
      value: number;
      unit: string;
      system: string;
      code: string;
    };
  };
}

const IngredientSchema = new Schema({
  item: {
    coding: [
      {
        type: Schema.Types.ObjectId,
        ref: "Coding",
      },
    ],
  },
  strength: {
    numerator: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
      system: { type: String, required: true },
      code: { type: String, required: true },
    },
  },
});

export const ingredientModel = mongoose.model<IIngredient>(
  "ingredient",
  IngredientSchema
);
