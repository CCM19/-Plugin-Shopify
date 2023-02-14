import express from "express";
import { ScriptDb } from "../ccm19-script-db.js";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 5000;

export default function applyScriptApiEndpoints(app) {
    app.use(express.json());
    app.use(bodyParser.json());

    app.post('/api/script/save', async (req, res) => {
        try {
            const { value } = req.body;
            const existingScript = await ScriptDb.read(1);
            let scriptId;
            if (existingScript) {
                await ScriptDb.update(1, { script: value });
                scriptId = existingScript.id;
            } else {
                scriptId = await ScriptDb.create({ script: value });
            }
            res.send({ status: 'success', scriptId });
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message });
        }
    });

    app.get('/api/script/load', async (req, res) => {
        try {
            const script = await ScriptDb.read(1);
            return res.send(script.script);
        } catch (error) {
            return res.status(404).send({ status: 'error', message: error.message });
        }
    });

    app.get('/api/get/db/status', async (req,res)=>{
        try{
            await ScriptDb.init();
            const isConnected = ScriptDb.isConnected();
            res.send({status:'success',isConnected});
        }catch (error) {
            res.status(500).send({status:'error',message:error.message});
        }
    })
}
