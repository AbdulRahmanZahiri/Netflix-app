export const flags = {
  billingEnabled: process.env.BILLING_ENABLED !== "false",
  devBypassAuth: process.env.DEV_BYPASS_AUTH === "true",
  devLocalDb: process.env.DEV_LOCAL_DB === "true" || process.env.DEV_BYPASS_AUTH === "true"
};
