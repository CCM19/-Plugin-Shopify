import { BillingInterval } from "@shopify/shopify-api";

export const billingConfig = {
    "free":{
        amount: 0.0,
        currencyCode: "EUR",
        interval: BillingInterval.OneTime,
        usageTerms: "Free access"
    },
    "starter":{
        amount: 7.90,
        currencyCode: "EUR",
        interval: BillingInterval.Every30Days,
        usageTerms: "Monthly based Subscription",
    }
}