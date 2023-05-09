import { Bone, DataTypes } from 'leoric';

const { DATE, INTEGER, TEXT } = DataTypes;

export class DocVersion extends Bone {
  static table = 'doc_versions';

  static attributes = {
    id: {
      type: INTEGER,
      primaryKey: true,
    },
    created_at: DATE,
    updated_at: DATE,
    doc_id: INTEGER,
    source: TEXT,
    html: TEXT,
  };
}
