import sqlite3 from "sqlite3";
import path from "path";

const DEFAULT_DB_FILE = path.join(process.cwd(), "script_db.sqlite");

export const ScriptDB = {
    scriptTableName: "script",
    db: null,
    ready: null,

    create: async function({shopDomain, scriptContent})
    {
        await this.ready;

        const query = `
            INSERT INTO ${this.scriptTableName}
                (shopDomain, scriptContent)
            VALUES (?, ?)
            RETURNING entryId;
        `;
        const rawResults = await this.__query(query, [
            shopDomain,
            scriptContent,
        ]);
        return rawResults[0].entryId;
    },

    read: async function (entryId) {
        await this.ready;

        const query = `
            SELECT * FROM ${this.scriptTableName}
            WHERE entryId = ?;
        `;

        const rows = await this.__query(query, [entryId]);
        if (!Array.isArray(rows) || rows.length !== 1) return undefined;

        return rows[0];
    },

    readByShopDomain: async function (shopDomain) {
        await this.ready;

        const query = `
            SELECT * FROM ${this.scriptTableName}
            WHERE shopDomain = ?;
        `;
        const rows = await this.__query(query, [shopDomain]);

        if (!Array.isArray(rows) || rows.length < 1) {
            console.log('Returning undefined');
            return undefined;
        }
        return rows[0];
    },

    update: async function (entryId, { scriptContent }) {
        await this.ready;

        const query = `
            UPDATE ${this.scriptTableName}
            SET scriptContent = ?
            WHERE entryId = ?;
        `;

        await this.__query(query, [scriptContent, entryId]);

        return true;
    },

    delete: async function (entryId) {
        await this.ready;

        const query = `
            DELETE FROM ${this.scriptTableName}
            WHERE entryId = ?;
        `;
        try {
            await this.__query(query, [entryId]);

            return true;
        }catch (error){
            throw new Error(error);
        }
    },

    list: async function (shopDomain) {
        await this.ready;

        const query = `
            SELECT * FROM ${this.scriptTableName}
            WHERE shopDomain = ?;
        `;

        const results = await this.__query(query, [shopDomain]);

        return results;
    },

    init: async function () {
        this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

        const hasScriptsTable = await this.__hasScriptsTable();

        if (hasScriptsTable) {
            this.ready = Promise.resolve();
        } else {
            const query = `
                CREATE TABLE ${this.scriptTableName} (
                entryId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                shopDomain VARCHAR(511) NOT NULL,
                scriptContent TEXT NOT NULL,
                createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
                )
            `;

            this.ready = this.__query(query);
        }
    },

    __hasScriptsTable: async function () {
        const query = `
            SELECT name FROM sqlite_schema
            WHERE
                type = 'table' AND
                name = ?;
        `;

        const rows = await this.__query(query, [this.scriptTableName]);

        return rows.length === 1;
    },

    __query: function (sql, params = []) {
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

    listAll: async function () {
        try {
            await this.ready;

            const query = `
                SELECT * FROM ${this.scriptTableName};
            `;

            const results = await this.__query(query);

            return results;
        } catch (error) {
            throw error;
        }
    }

};