/* eslint-disable no-magic-numbers */
import mongoose from 'mongoose';
import { IUserDocument } from './type';

const { Schema, model } = mongoose;

export const userSchema = new Schema({
  __v: { type: Number, select: false }, // 隐藏无用返回
  name: { type: String, required: true },
  password: { type: String, required: true, select: false }, // 默认不暴露密码
  avatar_url: { type: String },
  gender: { type: String, enum: ['male', 'female'], default: 'male' },
  headline: { type: String },
  locations: { type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }], select: false },
  business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false },
  employments: {
    type: [
      {
        company: { type: Schema.Types.ObjectId, ref: 'Topic' },
        job: { type: Schema.Types.ObjectId, ref: 'Topic' },
      },
    ],
    select: false,
  },
  educations: {
    type: [
      {
        school: { type: Schema.Types.ObjectId, ref: 'Topic' },
        major: { type: Schema.Types.ObjectId, ref: 'Topic' },
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
  followingTopics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    select: false,
  },
});

export default model<IUserDocument>('User', userSchema);
