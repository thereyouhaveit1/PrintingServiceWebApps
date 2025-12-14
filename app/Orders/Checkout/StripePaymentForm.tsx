"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function StripePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed");
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement className="payment-element" />

      <button
        disabled={loading || !stripe || !elements}
        className="pay-button"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {errorMessage && (
        <div className="error-message">⚠ {errorMessage}</div>
      )}
      {success && (
        <div className="success-message">✅ Payment successful!</div>
      )}

       <style jsx>{`
  

 

  .pay-button {
    background-color: #1a1a1aff; /* Green */
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    padding: 14px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pay-button:hover {
    background-color: #000000ff; 
    transform: scale(1.05); 
  }

  .pay-button:disabled {
    background-color: #dcdcdc;
    cursor: not-allowed;
  }

  .error-message {
    color: #e74c3c; /* Red */
    font-size: 1rem;
    text-align: center;
  }

  .success-message {
    color: #27ae60; /* Green */
    font-size: 1rem;
    text-align: center;
  }
`}</style>
    </form>
  );
}