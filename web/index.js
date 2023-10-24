// @ts-check
import { join } from 'path';
import { readFileSync } from 'fs';
import express from 'express';
import serveStatic from 'serve-static';
import {billingConfig} from "./billing.js";
import shopify from './shopify.js';
import applyScriptApiEndpoints from './middleware/ccm19-script-api.js';
import webhookHandlers from './webhook-handlers.js'

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === 'production'
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// CSP handle
app.use((req, res, next) => {
  const shopUrl = req.query.shop;
  if (shopUrl) {
    const csp = `frame-ancestors ${shopUrl} admin.shopify.com`;
    res.setHeader('Content-Security-Policy', csp);
  }
  next();
});

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
    // Request payment if required
    async (req, res, next) => {
      const plans = Object.keys(billingConfig);
      const session = res.locals.shopify.session;
      const hasPayment = await shopify.api.billing.check({
        session,
        plans: plans,
        isTest: true,
      });
      if (hasPayment) {
        next();
      } else {
          const host = req.query.host;
          res.redirect(`/Billing?host=${host}&session=${encodeURIComponent(JSON.stringify(session))}`)

      }
    },
    shopify.redirectToShopifyOrAppRoot()
);


app.post( shopify.config.webhooks.path, shopify.processWebhooks({
  webhookHandlers
}) );


// All endpoints after this point will require an active session
app.use('/api/*', shopify.validateAuthenticatedSession());

app.use(express.json());

applyScriptApiEndpoints(app);

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use('/*', shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set('Content-Type', 'text/html')
    .send(readFileSync(join(STATIC_PATH, 'index.html')));
});

app.listen(PORT);
