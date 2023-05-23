import {  LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import {join} from "path"
import {restResources} from "@shopify/shopify-api/rest/admin/2023-04";

const dbFile = join(process.cwd(), "database.sqlite");
const sessionDb = new SQLiteSessionStorage(dbFile);

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = ["read_themes", "write_themes"];

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    shopifyApiKey: apiKey,
    shopifyApiSecretKey: apiSecret,
    scopes: scopes,
    restResources,
    billing: undefined,
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  sessionStorage: sessionDb,
});
export default shopify;
