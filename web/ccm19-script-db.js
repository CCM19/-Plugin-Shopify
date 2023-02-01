import sqlite3 from "sqlite3";
import path from "path";
import shopify from "./shopify.js";

const DEFAULT_DB_FILE = path.join(process.cwd(), "ccm19_script_db.sqlite");

export const ScriptDb = {
    scriptTableName: "ccm19_script",
    db: null,
    ready : null,
    create: async function ({
    script,
                       }) {
        await this.ready;

        const query = `INSERT INTO ${this.scriptTableName}
        (title, script)
        VALUES( ?, ?)
        RETURNING id;
        `;
    const rawResults = await this.__query(query,[
        script,
    ]);
    return rawResults[0].id;
    },
    update: async function (
        id,
        {script}
    ){
        await this.ready;

        const query = `
        UPDATE ${this.scriptTableName}
        SET
        script = ?
        WHERE
            id = ?;
    `;
        await this.__query(query,[
            script,
            id,
            ]);
        return true;
    },
    read: async function (id) {
        await this.ready;
        const query = `
      SELECT * FROM ${this.scriptTableName}
      WHERE id = ?;
    `;
        const rows = await this.__query(query, [id]);
        if (!Array.isArray(rows) || rows?.length !== 1) return undefined;
        return this.__addImageUrl(rows[0]);
    },

    delete: async function (id) {
        await this.ready;
        const query = `
      DELETE FROM ${this.scriptTableName}
      WHERE id = ?;
    `;
        await this.__query(query, [id]);
        return true;
    },

    handleScriptScan: async function (script) {

        await this.__increaseScanCount(script);
    },

    __hasScriptTable: async function () {
        const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
        const rows = await this.__query(query, [this.scriptTableName]);
        return rows.length === 1;
    },
    init: async function () {
        this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

        const hasScriptTable = await this.__hasScriptTable();

        if(hasScriptTable) {
            const query = `
            (CREATE TABLE ${this.scriptTableName}
            id INTEGER PRIMARY KEY NOT NULL,
            script VARCHAR(511) NOT NULL
            )
            `;
            this.ready = this.__query(query);
        }
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


}
