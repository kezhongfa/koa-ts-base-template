/* eslint-disable import/prefer-default-export */
import { Schema } from 'mongoose';

export function loadedAtPlugin(schema: Schema) {
  schema
    .virtual('loadedAt')
    .get(function () {
      // @ts-ignore
      return this._loadedAt;
    })
    .set(function (v: Date) {
      // @ts-ignore
      this._loadedAt = v;
    });

  schema.post(['find', 'findOne'], (docs: any) => {
    console.log('docs:', docs);

    // let _docs = docs;
    if (!Array.isArray(docs)) {
      docs = [docs];
    }
    // const now = new Date();
    for (const doc of docs) {
      doc.sss = 'kkk';
      console.log('docq:', doc);
    }
    console.log('docs1:', docs);
  });
}
