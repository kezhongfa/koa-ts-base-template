import { SchemaOptions, Schema } from 'mongoose';

export type CreateSchema = <T extends { [x: string]: any }, O extends SchemaOptions>(
  definition?: T,
  options?: O
) => Schema & {
  definition: { [P in keyof T]: any };
  options: O;
};
