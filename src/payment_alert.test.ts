import assert from "node:assert/strict";
import { processPaymentAlert } from "./payment_alert.js";

const result = await processPaymentAlert({ payment_id: "pay_42", account_id: "acct_9", amount_cents: 2500, risk_score: 0.2, phone: "+15551234567" });
assert.deepEqual(result, { decision: "allow", payment_id: "pay_42" });
console.log("payment decision test passed");
