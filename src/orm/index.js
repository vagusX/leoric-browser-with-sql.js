import Realm from 'leoric';
import SqlJSDriver from 'leoric/src/drivers/sqljs';

class ORM {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor({ models, database, logger = () => {} }) {
    this.realm = new Realm({
      database,
      models: models,
      driver: SqlJSDriver,
      logger,
      initSqlJs: async (options) => {
        const { default: initSqlJs } = await import('sql.js');
        const SQL = await initSqlJs();
        const { data = null, name, version } = options;
        const database = new SQL.Database(data);

        if (process.env.NODE_ENV !== 'production') {
          window._dumpdb = () => {
            if (!database) return;
            // core dump as file
            const binaryArray = database.export();
            // download this binaryArray as a file
            const blob = new Blob([binaryArray], {
              type: 'application/octet-stream',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.download = `${name}_${version}.db`;
            a.href = url;
            a.click();
          };
        }

        // PRIMARY KEY AUTOINCREMENT
        await database.run(`CREATE TABLE doc_versions (
          \`id\` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          \`created_at\` DATE NOT NULL,
          \`updated_at\` DATE NOT NULL,
          \`doc_id\` BIGINT(20) NOT NULL,
          \`source\` VARCHAR NOT NULL,
          \`html\` VARCHAR
        );`);

        await database.run(`CREATE TABLE docs (
          \`id\` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          \`created_at\` DATE NOT NULL,
          \`updated_at\` DATE NOT NULL,
          \`title\` VARCHAR NOT NULL,
          \`content\` VARCHAR
        );`);

        console.log('migration done');

        return database;
      },
    });
  }

  get connected() {
    return this.realm?.connected;
  }

  async connect() {
    if (!this.realm) {
      console.log("ORM didn't initialize");
      return;
    }

    // 建立数据库连接
    await this.realm.driver.getConnection();
    console.log('orm connected');

    // realm 连接
    return await this.realm.connect();
  }

  async disconnect(callback) {
    if (!this.realm) {
      console.log("ORM didn't initialize");
      return;
    }

    return await this.realm.disconnect(callback);
  }

  get bone() {
    return this.realm?.models;
  }
}

export function createOrm(models) {
  const userId = 'local_user';
  const database = `leoric_${userId}.db`;

  if (!userId) {
    console.warn('userId is invalid when open database');
  }

  console.log(`will open database: ${database}`);

  return new ORM({
    models,
    database,
    logger: (params) => {
      // console.error(params);
    },
  });
}
