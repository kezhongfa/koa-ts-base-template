import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const questionSchema = new Schema({
  __v: { type: Number, select: false },
  title: { type: String, required: true },
  description: { type: String },
  questioner: { type: Schema.Types.ObjectId, ref: 'User', select: false },
});

export default model('Question', questionSchema);
