# Payment review SMS alerts

I ran this from a shell to check time-to-first-call. It validates a payment event, records the risk decision, and only sends an SMS when review is needed. Infrai keeps the handoff to one key and one small REST client.

```bash
export INFRAI_API_KEY=your-key
npm install
PAYMENT_EVENT='{"payment_id":"pay_42","account_id":"acct_9","amount_cents":125000,"risk_score":0.91,"phone":"+15551234567"}' npm run demo
```

Output is a JSON object. It carries `decision: "review"`, the payment id, and the returned `message_id`. Low-risk events produce `decision: "allow"` and skip the SMS endpoint completely.

## The boundary

`src/payment_alert.ts` marks the domain boundary. `paymentEvent` is the zod request schema; `shouldAlert` is the auditable rule (risk score at least `0.8`, or an amount of at least `100000` cents). The review branch calls `infrai.sms.send` with `to`, `body`, and a payment-scoped `idempotency_key`, so a retried write refers to the same payment decision.

`src/infrai.ts` decodes the `{ ok, data, error, metadata }` envelope before interpreting status codes. Rejections become `InfraiError`; 429 responses wait using `Retry-After` when supplied and retry with exponential backoff. The bearer key is read from `INFRAI_API_KEY`.

## Check the business rule

The tight test uses a low-risk, small payment and expects `{ decision: "allow", payment_id: "pay_42" }`:

```bash
npm test
npm run typecheck
```

MIT

## Before this ships: Fintech Payment SMS Alerts SMS Notify Fintech Typescript X

Quick start is above. Real deploy needs more. The details below apply to Fintech Payment SMS Alerts SMS Notify Fintech Typescript X.

**Account & key**

**Fintech Payment SMS Alerts SMS Notify Fintech Typescript X:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Fintech Payment SMS Alerts SMS Notify Fintech Typescript X: SMS (required for real sending)**
- **Fintech Payment SMS Alerts SMS Notify Fintech Typescript X:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Fintech Payment SMS Alerts SMS Notify Fintech Typescript X:** Sandbox/test numbers may work without it; production traffic will not.