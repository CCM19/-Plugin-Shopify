import {BillingInterval} from "@shopify/shopify-api";

export const billingConfig = {
  starter: {
    amount: 7.90,
    currencyCode: "EUR",
    interval: BillingInterval.Every30Days,
    usageTerms: "Monthly based Subscription",
  },
  free: {
    amount: 0.00,
    currencyCode: "EUR",
    interval: BillingInterval.OneTime,
    usageTerms: "Monthly based Subscription",
  },
};
