import { Schema, Document } from 'mongoose';

export interface IEmployment {
  company: string;
  job: string;
}
export interface IEducation {
  school: string;
  major: string;
  diploma: number;
  entrance_year: number;
  graduation_year: number;
}
export interface IUserDocument extends Document {
  name: string;
  password: string;
  avatar_url?: string;
  gender?: string;
  headline?: string;
  locations?: string[];
  business?: string;
  employments?: IEmployment[];
  educations?: IEducation[];
  following?: Schema.Types.ObjectId;
}
