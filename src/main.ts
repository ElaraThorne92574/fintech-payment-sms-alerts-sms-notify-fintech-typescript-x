import { processPaymentAlert } from "./payment_alert.js";

const raw = process.env.PAYMENT_EVENT;
if (!raw) throw new Error("PAYMENT_EVENT must contain a JSON payment event");
const result = await processPaymentAlert(JSON.parse(raw));
console.log(JSON.stringify(result));
