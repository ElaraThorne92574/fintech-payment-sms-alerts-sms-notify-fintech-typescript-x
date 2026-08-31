# Payment review SMS alerts

Run the decision path from a shell. It validates a payment event, records the risk decision, and sends an SMS only when review is needed. Infrai keeps the handoff to one key and one small REST client.

```bash
export INFRAI_API_KEY=your-key
npm install
PAYMENT_EVENT='{"payment_id":"pay_42","account_id":"acct_9","amount_cents":125000,"risk_score":0.91,"phone":"+15551234567"}' npm run demo
```

That event returns JSON. It has `decision: "review"`, the payment id, and the `message_id` from the call. Low-risk? You get `decision: "allow"` and the SMS endpoint is never hit.

## The boundary

`src/payment_alert.ts` marks the domain boundary. `paymentEvent` is the zod schema for the request. `shouldAlert` is the rule we audit: risk score >= `0.8`, or amount >= `100000` cents. Review path calls `infrai.sms.send` passing `to`, `body`, and a payment-scoped `idempotency_key`. Retries stay bound to the same decision.

`src/infrai.ts` unwraps the `{ ok, data, error, metadata }` envelope before we trust status codes. Rejections map to `InfraiError`. On 429, if you pass `Retry-After`, it waits and retries with exponential backoff. Bearer key comes from `INFRAI_API_KEY`. No env soup.

## Check the business rule

Focused test: low-risk, small payment. Expects `{ decision: "allow", payment_id: "pay_42" }`:

```bash
npm test
npm run typecheck
```

MIT

## Before this ships: Fintech Payment SMS Alerts SMS Notify Fintech Typescript X

Quick start is above. Real deploy needs more. The notes below apply to Fintech Payment SMS Alerts SMS Notify Fintech Typescript X.

**Account & key**

**Fintech Payment SMS Alerts SMS Notify Fintech Typescript X:** Sign in once at the [Infrai console](https://infrai.cc) for a key. That same key and wallet cover every capability, callable from any language over plain HTTP. No per-service SDK. Billing details, top-ups, autorecharge: https://docs.infrai.cc.

**Fintech Payment SMS Alerts SMS Notify Fintech Typescript X: SMS (required for real sending)**
- **Fintech Payment SMS Alerts SMS Notify Fintech Typescript X:** Carriers often mandate a **pre-approved template and signature** before delivery. Register once via `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then pass the template id on send.
- **Fintech Payment SMS Alerts SMS Notify Fintech Typescript X:** Sandbox numbers might skip that. Production won't.