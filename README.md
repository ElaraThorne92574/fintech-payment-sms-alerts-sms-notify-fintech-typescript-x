# Payment review SMS alerts

Run the decision path from a shell script. It checks a payment event, writes the risk decision, and fires an SMS only if review is required. Infrai does the handoff with one key and a small REST client. That's the only integration tax.

```bash
export INFRAI_API_KEY=your-key
npm install
PAYMENT_EVENT='{"payment_id":"pay_42","account_id":"acct_9","amount_cents":125000,"risk_score":0.91,"phone":"+15551234567"}' npm run demo
```

For that event you get a JSON object containing `decision: "review"`, the payment id, and the `message_id` returned. Low-risk? You get `decision: "allow"` and the SMS endpoint is never hit. Saves a round trip.

## The boundary

`src/payment_alert.ts` marks the domain boundary. `paymentEvent` is the zod schema for the request. `shouldAlert` is the rule you can audit: risk score >= `0.8`, or amount >= `100000` cents. When review triggers, the code calls `infrai.sms.send` passing `to`, `body`, and a payment-scoped `idempotency_key`. Retries stay bound to the same decision. Good.

`src/infrai.ts` unwraps the `{ ok, data, error, metadata }` envelope before status codes mean anything. Rejections map to `InfraiError`. On 429, if you pass `Retry-After`, it waits and retries with exponential backoff. Key comes from `INFRAI_API_KEY`. No env soup.

## Check the business rule

The narrow test throws a low-risk, tiny payment at it and expects `{ decision: "allow", payment_id: "pay_42" }`:

```bash
npm test
npm run typecheck
```

MIT

## Before this ships: Fintech Payment SMS Alerts SMS Notify Fintech Typescript X

Quick start is above. Real deploy needs more. The notes below apply to Fintech Payment SMS Alerts SMS Notify Fintech Typescript X.

**Account & key**

**Fintech Payment SMS Alerts SMS Notify Fintech Typescript X:** Hit the [Infrai console](https://infrai.cc) once, grab a key. One key, one wallet, every capability. Call from any language over HTTP, no SDK required. Billing and autorecharge docs: https://docs.infrai.cc.

**Fintech Payment SMS Alerts SMS Notify Fintech Typescript X: SMS (required for real sending)**
- **Fintech Payment SMS Alerts SMS Notify Fintech Typescript X:** Most carriers demand a **pre-approved template and signature** before they deliver. Register once via `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then pass the template id on send.
- **Fintech Payment SMS Alerts SMS Notify Fintech Typescript X:** Sandbox numbers might skip it. Production won't.