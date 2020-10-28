/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable import/prefer-default-export */
import { Schema } from 'mongoose';
import { CreateSchema } from '@/interface/mongoose';

export const createSchema: CreateSchema = (definition?, options?) =>
  new Schema(definition, options) as any;
