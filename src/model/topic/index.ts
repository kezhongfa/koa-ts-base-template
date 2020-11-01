/* eslint-disable comma-dangle */
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export const TopicSchema = new Schema(
  {
    __v: { type: Number, select: false },
    name: { type: String, required: true },
    avatar_url: { type: String },
    introduction: { type: String, select: false },
  },
  { timestamps: true }
);

export default model('Topic', TopicSchema);
