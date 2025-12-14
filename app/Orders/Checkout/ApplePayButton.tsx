"use client";
import { useEffect, useState } from "react";
import { useStripe, PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import type { PaymentRequest, PaymentRequestOptions } from "@stripe/stripe-js";

interface Props {
  amount: number; // in cents
}

export default function ApplePayButton({ amount }: Props) {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

  useEffect(() => {
    if (!stripe) return;

    const options: PaymentRequestOptions = {
      country: "US",
      currency: "usd",
      total: { label: "Total", amount },
      requestPayerName: true,
      requestPayerEmail: true,
    };

    const pr = stripe.paymentRequest(options);

    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr);
    });
  }, [stripe, amount]);

  if (!paymentRequest) {
    return <p>Apple Pay not available on this device/browser</p>;
  }

  return (
    <PaymentRequestButtonElement
      options={{
        paymentRequest,
        style: {
          paymentRequestButton: {
            type: "buy",
            theme: "dark",
            height: "48px",
          },
        },
      }}
    />
  );
}