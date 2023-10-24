import {BillingInterval} from "@shopify/shopify-api";

export const billingConfig = {
  /**
   * monthly configs
   */
  starterMonthly: {
    amount: 7.90,
    currencyCode: "EUR",
    interval: BillingInterval.Every30Days,
    usageTerms: "Monthly based Subscription",
  },

  businessMonthlyTierOne: {
    amount: 16.90,
    currencyCode: "EUR",
    interval: BillingInterval.Every30Days,
    usageTerms: "5 Domains / 100.000 Impressions. Monthly based Subscription",
  },
  businessMonthlyTierTwo: {
    amount: 34.90,
    currencyCode: "EUR",
    interval: BillingInterval.Every30Days,
    usageTerms: "10 Domains / 250.000 Impressions. Monthly based Subscription",
  },
  businessMonthlyTierThree: {
    amount: 79.90,
    currencyCode: "EUR",
    interval: BillingInterval.Every30Days,
    usageTerms: "20 Domains / 1.000.000 Impressions. Monthly based Subscription",
  },
  businessMonthlyTierFour: {
    amount: 149.90,
    currencyCode: "EUR",
    interval: BillingInterval.Every30Days,
    usageTerms: "50 domains / 2.500.000 impressions. Monthly Based",
  },
  businessMonthlyTierFive: {
    amount: 259.90,
    currencyCode: "EUR",
    interval: BillingInterval.Every30Days,
    usageTerms: "100 domains / 5.000.00 impressions. Monthly Based.",
  },
  /**
   * yearly configs
   */
  starterYearly: {
    amount: 82.80,
    currencyCode: "EUR",
    interval: BillingInterval.Annual,
    usageTerms: "Yearly based Subscription",
  },

  businessYearlyTierOne: {
    amount: 202.80,
    currencyCode: "EUR",
    interval: BillingInterval.Annual,
    usageTerms: "Yearly based Subscription",
  },
  businessYearlyTierTwo: {
    amount: 418.80,
    currencyCode: "EUR",
    interval: BillingInterval.Annual,
    usageTerms: "Yearly based Subscription",
  },
  businessYearlyTierThree: {
    amount: 958.80,
    currencyCode: "EUR",
    interval: BillingInterval.Annual,
    usageTerms: "Yearly based Subscription",
  },
  businessYearlyTierFour: {
    amount: 1798.80,
    currencyCode: "EUR",
    interval: BillingInterval.Annual,
    usageTerms: "50 domains / 2.500.000 impressions. Yearly Based",
  },
  businessYearlyTierFive: {
    amount: 3118.80,
    currencyCode: "EUR",
    interval: BillingInterval.Annual,
    usageTerms: "100 domains / 5.000.00 impressions. Monthly Based.",
  },
};
