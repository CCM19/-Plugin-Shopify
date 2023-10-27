import sqlite3 from 'sqlite3';
import path from 'path';

const DEFAULT_DB_FILE = path.join(process.cwd(), "script_db.sqlite");

export const ScriptDB = {
  scriptTableName: "script",
  shopDataTableName: "shopData",
  shopAddressTableName: "shopAddress",
  db: null,
  ready: null,

  async createScriptEntry({shopDomain, scriptContent, shopDataId}) {
    await this.ready;

    const query = `
            INSERT INTO ${this.scriptTableName}
                (shopDomain, scriptContent, shopDataId)
            VALUES (?, ?, ?)
            RETURNING entryId;
        `;
    const rawResults = await this.__query(query, [
      shopDomain,
      scriptContent,
      shopDataId,
    ]);
    return rawResults[0].entryId;
  },

  async read(entryId) {
    await this.ready;

    const query = `
            SELECT * FROM ${this.scriptTableName}
            WHERE entryId = ?;
        `;

    const rows = await this.__query(query, [entryId]);
    if (!Array.isArray(rows) || rows.length !== 1) { return undefined; }

    return rows[0];
  },

  async readByShopDomain(shopDomain) {
    await this.ready;

    const query = `
            SELECT * FROM ${this.scriptTableName}
            WHERE shopDomain = ?;
        `;
    const rows = await this.__query(query, [shopDomain]);

    if (!Array.isArray(rows) || rows.length < 1) {
      return undefined;
    }
    return rows[0];
  },
  async readByShopId(shopId) {
    await this.ready;

    const query = `
            SELECT * FROM ${this.shopDataTableName}
            WHERE shopId = ?;
        `;
    const rows = await this.__query(query, [shopId]);

    if (!Array.isArray(rows) || rows.length < 1) {
      return undefined;
    }
    return rows[0];
  },

  async update(entryId, {scriptContent}) {
    await this.ready;

    const query = `
            UPDATE ${this.scriptTableName}
            SET scriptContent = ?
            WHERE entryId = ?;
        `;

    await this.__query(query, [scriptContent, entryId]);

    return true;
  },

  async delete(entryId) {
    await this.ready;

    const query = `
            DELETE FROM ${this.scriptTableName}
            WHERE entryId = ?;
        `;
    try {
      await this.__query(query, [entryId]);

      return true;
    } catch (error) {
      throw new Error(error);
    }
  },

  async list(shopDomain) {
    await this.ready;

    const query = `
            SELECT * FROM ${this.scriptTableName}
            WHERE shopDomain = ?;
        `;

    const results = await this.__query(query, [shopDomain]);

    return results;
  },

  async init() {
    this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

    const hasScriptsTable = await this.__hasScriptsTable();
    const hasShopDataTable = await this.__hasShopDataTable();
    const hasShopAddressTable = await this.__hasShopAddressTable();

    if (hasScriptsTable && hasShopDataTable) {
      this.ready = Promise.resolve();
    } else {
      const createTablesQueries = [];

      if (!hasScriptsTable) {
        createTablesQueries.push(`
                    CREATE TABLE ${this.scriptTableName} (
                        entryId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                        shopDomain VARCHAR(511) PRIMARY KEY NOT NULL,
                        scriptContent TEXT,
                        createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                        shopDataId INTEGER,
                        FOREIGN KEY (shopDataId) REFERENCES ${this.shopDataTableName}(shopDataId)
                    )
                `);
      }

      if (!hasShopDataTable) {
        createTablesQueries.push(`
                    CREATE TABLE ${this.shopDataTableName} (
                        shopDataId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                        shopId VARCHAR(511) PRIMARY KEY NOT NULL, 
                        name VARCHAR(511),
                        company VARCHAR(511),
                        eMail VARCHAR(511) NOT NULL
                    )
                `);
      }

      if (!hasShopAddressTable) {
        createTablesQueries.push(`
                CREATE TABLE ${this.shopAddressTableName}(
                    addressId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
                    country VARCHAR(511),  
                    streetAddress VARCHAR(511),
                    additionalAddress VARCHAR(511),
                    city VARCHAR(511),
                    zip VARCHAR(511),
                    shopDataId INTEGER,
                    FOREIGN KEY (shopDataId) REFERENCES  ${this.shopDataTableName}(shopDataId)
                )
                `);

      }

      this.ready = Promise.all(createTablesQueries.map((query) => this.__query(query)));
    }
  },
  async addShopData({shopId, name, company, eMail}) {
    await this.ready;

    const query = `
      INSERT INTO ${this.shopDataTableName}
          ( shopId, name, company, eMail)
      VALUES (?, ?, ?, ?)
      RETURNING shopDataId;
  `;
    const rawResults = await this.__query(query, [shopId, name, company, eMail]);
    return rawResults[0].entryId;
  },

  async addAddress({country, streetAddress, additionalAddress, city, zip, shopDataId}) {
    await this.ready;

    const query = `
      INSERT INTO ${this.shopAddressTableName}
          (country, streetAddress,additionalAddress, city, zip, shopDataId)
      VALUES (?, ?, ?, ?, ?, ?);
  `;
    const rawResults = await this.__query(query, [country, streetAddress,additionalAddress, city, zip, shopDataId]);
    return rawResults[0].entryId;
  },

  async __hasScriptsTable() {
    const query = `
            SELECT name FROM sqlite_schema
            WHERE
                type = 'table' AND
                name = ?;
        `;

    const rows = await this.__query(query, [this.scriptTableName]);

    return rows.length === 1;
  },

  async __hasShopDataTable() {
    const query = `
            SELECT name FROM sqlite_schema
            WHERE
                type = 'table' AND
                name = ?;
        `;

    const rows = await this.__query(query, [this.shopDataTableName]);

    return rows.length === 1;
  },
  async __hasShopAddressTable() {
    const query = `
            SELECT name FROM sqlite_schema
            WHERE
                type = 'table' AND
                name = ?;
        `;

    const rows = await this.__query(query, [this.shopDataTableName]);

    return rows.length === 1;
  },
  __query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  },

  async listAll() {
    await this.ready;
    const query = `
                SELECT * FROM ${this.scriptTableName};
            `;
    return await this.__query(query);
  },

};
