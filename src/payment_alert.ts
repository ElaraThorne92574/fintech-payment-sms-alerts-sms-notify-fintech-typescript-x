import { z } from "zod";
import { infrai } from "./infrai.js";

export const paymentEvent = z.object({ payment_id: z.string().min(1), account_id: z.string().min(1), amount_cents: z.number().int().positive(), risk_score: z.number().min(0).max(1), phone: z.string().min(7) });
export type PaymentEvent = z.infer<typeof paymentEvent>;

export function shouldAlert(event: PaymentEvent): boolean { return event.risk_score >= 0.8 || event.amount_cents >= 100000; }

export async function processPaymentAlert(input: unknown) {
  const event = paymentEvent.parse(input);
  if (!shouldAlert(event)) return { decision: "allow", payment_id: event.payment_id } as const;
  const result = await infrai.sms.send({ to: event.phone, body: `Review payment ${event.payment_id} for account ${event.account_id}.`, idempotency_key: `payment-alert:${event.payment_id}` });
  return { decision: "review", payment_id: event.payment_id, message_id: result.message_id } as const;
}
