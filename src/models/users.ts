/* eslint-disable no-magic-numbers */
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false }, // 隐藏无用返回
  name: { type: String, required: true },
  password: { type: String, required: true, select: false }, // 默认不暴露密码
  avatar_url: { type: String },
  gender: { type: String, enum: ['male', 'female'], default: 'male' },
  headline: { type: String },
  locations: { type: [{ type: String }], select: false },
  business: { type: String, select: false },
  employments: {
    type: [
      {
        company: { type: String },
        job: { type: String },
      },
    ],
    select: false,
  },
  educations: {
    type: [
      {
        school: { type: String },
        major: { type: String },
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
        entrance_year: { type: Number },
        graduation_year: { type: Number },
      },
    ],
    select: false,
  },
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    select: false,
  },
});

export default model('User', userSchema);
