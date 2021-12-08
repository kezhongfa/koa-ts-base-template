/* eslint-disable @typescript-eslint/ban-types */
import { Schema, Document, Model, Query } from 'mongoose';

interface Callback<T, THIS = T> {
  (this: THIS, err: any, doc: T): void;
}
export interface IDeleteModel<T extends Omit<Document, 'delete'>, QueryHelpers = {}>
  extends Model<T, QueryHelpers> {
  /** Count only deleted documents */
  countDeleted: typeof Model.count;
  /** Count all documents including deleted */
  countWithDeleted: typeof Model.count;
  /** Count only deleted documents */
  countDocumentsDeleted: typeof Model.countDocuments;
  /** Count all documents including deleted */
  countDocumentsWithDeleted: typeof Model.countDocuments;
  /** Find only deleted documents */
  findDeleted: typeof Model.find;
  /** Find all documents including deleted */
  findWithDeleted: typeof Model.find;
  /** Find One only deleted documents */
  findOneDeleted: typeof Model.findOne;
  /** Find One all documents including deleted */
  findOneWithDeleted: typeof Model.findOne;
  /** Find One And Update only deleted documents */
  findOneAndUpdateDeleted: typeof Model.findOneAndUpdate;
  /** Find One And Update all documents including deleted */
  findOneAndUpdateWithDeleted: typeof Model.findOneAndUpdate;
  /** Update One only deleted documents */
  updateOneDeleted: typeof Model.updateOne;
  /** Update One all documents including deleted */
  updateOneWithDeleted: typeof Model.updateOne;
  /** Update Many only deleted documents */
  updateManyDeleted: typeof Model.updateMany;
  /** Update Many all documents including deleted */
  updateManyWithDeleted: typeof Model.updateMany;
  /** Aggregate only deleted documents */
  aggregateDeleted: typeof Model.aggregate;
  /** Aggregate all documents including deleted */
  aggregateWithDeleted: typeof Model.aggregate;
  /**
   * Delete documents by conditions
   */
  delete(
    conditions?: any,
    deleteBy?: any,
    fn?: Callback<T, this>
  ): Query<ReturnType<Model<T>['deleteMany']>, T, QueryHelpers>;
  /**
   * Delete a document by ID
   */
  deleteById(
    id?: string | Schema.Types.ObjectId | Callback<T, this>,
    deleteBy?: string | Schema.Types.ObjectId | Document | Callback<T, this>,
    fn?: Callback<T, this>
  ): Query<ReturnType<Model<T>['deleteOne']>, T, QueryHelpers> & QueryHelpers;
  /**
   * Restore documents by conditions
   */
  restore(
    conditions?: any,
    fn?: Callback<T, this>
  ): Query<ReturnType<Model<T>['updateMany']>, T, QueryHelpers>;
}
