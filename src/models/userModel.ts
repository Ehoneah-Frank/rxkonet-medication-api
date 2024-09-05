import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

export interface IUser extends Document {
  username: string;
  apiKey: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  apiKey: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(16).toString('hex'),
  },
});

export const userModel = mongoose.model<IUser>('User', UserSchema);
