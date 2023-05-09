// import { Column } from 'leoric/src/decorators';
import { Bone, DataTypes } from 'leoric';

// export class Doc extends Bone {
//   static table = 'docs';

//   @Column({
//     type: DataTypes.BIGINT,
//   })
//   id: number;

//   @Column({
//     allowNull: false,
//     type: DataTypes.TEXT,
//   })
//   title: string;

//   @Column({
//     type: DataTypes.TEXT,
//   })
//   content: string;

//   @Column({
//     type: DataTypes.DATE,
//   })
//   created_at: Date;

//   @Column({
//     type: DataTypes.DATE,
//   })
//   updated_at: Date;
// }

export class Doc extends Bone {
  static table = 'docs';

  static attributes = {
    id: DataTypes.BIGINT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    title: DataTypes.TEXT,
    content: DataTypes.TEXT,
  };

  static initialize() {
    this.hasMany('doc_versions', {
      className: 'DocVersion',
      foreignKey: 'doc_id',
    });
  }
}
