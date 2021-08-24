import mongoose, { Document, Model } from 'mongoose';

export enum BeachPosition {
  N = 'N',
  W = 'W',
  E = 'E',
  S = 'S'
}

export interface Beach {
  _id?: string;
  name: string;
  lat: number;
  lng: number;
  position: BeachPosition;
}

const schema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
}, {
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

interface BeachModel extends Omit<Beach, '_id'>, Document { }
export const Beach: Model<BeachModel> = mongoose.model('Beach', schema) as any;