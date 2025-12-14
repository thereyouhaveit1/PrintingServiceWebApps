"use client"
import React, { useMemo ,useState, useEffect, useRef } from "react";
import { Amplify } from "aws-amplify";
import { useRouter } from 'next/navigation';  
import outputs from "@/amplify_outputs.json";  
import "../../app.css";     
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements ,PaymentRequestButtonElement } from "@stripe/react-stripe-js"; // Stripe Elements imports
 import type { PaymentRequest } from "@stripe/stripe-js";
 import StripePaymentForm from "./StripePaymentForm";
 import ApplePayButton from "./ApplePayButton";
 import { usePricing } from '../../PricingContext';
Amplify.configure(outputs); 



 const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
export default function App() { 
  const router = useRouter();
 
 
const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
 const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  //pulling saved data
  interface OrderData {
  size: keyof typeof pricing.size;
  customSize?: string;
  paper: keyof typeof pricing.paper;
  quantity: keyof typeof pricing.quantity; 
  rCorner?: "Yes" | "No";
  turnaround: keyof typeof pricing.turnaround;
  orderName: string;
  orderEmail : string;
  productName : string;  
  approvalType: string;
  isFrontOnly: string;
  color: string; 
  frontFile?: string | File | null;
  backFile?: string | File | null;
}
  // State Hooks
 
 const [selectedSize, setSelectedSize] = useState<string>("2 x 3"); 
   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);// default to card
const [clientSecret, setClientSecret] = useState<string | null>(null); 
  const [orderData, setOrderData] = useState<any>(null); 
 const [subtotal, setSubtotal] = useState<number>(0);  
   const { pricing, calculateSubtotal } = usePricing(); 
  



  useEffect(() => {
    const saved = localStorage.getItem("orderData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setOrderData(parsed);
      const total = calculateSubtotal(parsed);
      setSubtotal(total);

      fetch("/api/checkout_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtotal: total, orderData: parsed }),
      })
        .then((res) => res.json())
        .then((session) => {
          if (session.clientSecret) {
            setClientSecret(session.clientSecret);
          } else {
            console.error("No clientSecret returned");
          }
        });
    }
  }, []);

  const convertInchesToPixels = (size: string) => {
    const [h, w] = size.split(" x ").map(Number);
    return { height: h  * 75,width: w * 75 };
  };

  const imageSize =
    orderData?.size && orderData.size !== "Custom"
      ? convertInchesToPixels(orderData.size)
      : { height: 144, width: 216 };
   //console.log("Current orderData on checkout:", orderData);
  return (
    <div className="errThingInbetween"> 
             <div className="OrderBuilderTitle" 
 > 
</div>
      <div className="checkout-container">


        <div className="checkout-content">
          <div className="left-column">
            <h1 className="checkout-title">Checkout</h1>

 
            <div className="order-summary">
              <h3 className="section-title">Order Summary</h3>
              {orderData ? (
                <div className="order-details">
                    <p><strong>Product Name:</strong> {orderData.product}</p> 
                  <p><strong>Order Name:</strong> {orderData.orderName}</p> 
                  <p><strong>Approval Type:</strong> {orderData.approvalType}</p>
                  <p><strong>Paper:</strong> {orderData.paper}</p>
                  <p><strong>Size:</strong> {orderData.size === "Custom" ? orderData.customSize : orderData.size}</p>
                  <p><strong>Quantity:</strong> {orderData.quantity}</p>
                  <p><strong>Color:</strong> {orderData.color}</p> 
                  <p><strong>Rounded Corners:</strong> {orderData.rCorner}</p>
                  <p><strong>Turnaround:</strong> {orderData.turnaround}</p>
                  <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>

                 
<div>   <p>  An electronic sample will be sent to the provided email: <strong>{orderData.orderEmail || 'No email provided'}</strong></p>
              
</div>
        
                </div>
              ) : (
                <p>No order data available.</p>
              )}
            </div>
          </div>

          <div className="right-column">
            <div className="payment-methods">
              <h3 className="section-title">Select Payment Method</h3>
              <label>
                <input
                  type="radio"
                  name="payment-method"
                  value="card"
                  checked={selectedPaymentMethod === "card"}
                  onChange={() => setSelectedPaymentMethod("card")}
                />
                Credit/Debit Card
              </label>
              <label>
                <input
                  type="radio"
                  name="payment-method"
                  value="applepay"
                  checked={selectedPaymentMethod === "applepay"}
                  onChange={() => setSelectedPaymentMethod("applepay")}
                />
                Apple Pay
              </label>
            </div>

            <div className="payment-container">
              {clientSecret && selectedPaymentMethod === "card" && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripePaymentForm />
                </Elements>
              )}
              {selectedPaymentMethod === "applepay" && (
                <Elements stripe={stripePromise}>
                  <ApplePayButton amount={Math.round(subtotal * 100)} />
                </Elements>
              )}
            </div>
          </div>
        </div>
    
 
        <div className="checkout-contentRight"> 
            <div className="preview-section">
              <h3 className="section-title">Preview</h3>
              <div className="preview-images">
                {orderData?.frontFile ? (
                  <div> <p className="no-image-text">Front Image </p>
                  <img
                    src={orderData.frontFile}
                    alt="Front Preview"
                    className="preview-image"
                    style={{ height: imageSize.height, width: imageSize.width }}
                  />   </div>
                ) : (
                  <p className="no-image-text">No front image uploaded</p>
                )}
                {orderData?.backFile ? (
                   <div> <p className="no-image-text">Back Image </p>
                  <img
                    src={orderData.backFile}
                    alt="Back Preview"
                    className="preview-image"
                    style={{height: imageSize.height, width: imageSize.width }}
                  />  </div>
                ) : (
                  <p className="no-image-text">No back image uploaded</p>
                )}
              </div>       
                 </div>
            
      </div>
       </div>      

        <div className="OrderBuilderTitle" 
 > 
</div>
<style jsx>{`

 .preview-section{
 height: 5%; 
 }

  .checkout-container { 
gap: 10px;  
padding:3%;
display:flex;   
  justify-content: center; 
  border-radius: 8px;    
 
}

.checkout-content {
  display: flex;
  justify-content: space-between; 
   overflow: hidden;   
 
  background-color: #fff;     
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;   gap:30px;

  box-sizing: content-box;
}
 
.checkout-contentRight {
 display: flex;
  justify-content: space-between; 
  width: 50%;    
   height: 80%; 
  background-color: #fff;   
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;   gap:30px;
}
.left-column, .right-column {
  flex: 1; 
  margin-right: 2rem;
  margin-top:0%;
}

.checkout-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 1rem;
}

.preview-images {
  display: flex;  
     justify-content: center;  
      flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.preview-image { 
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); 
  transition: transform 0.3s ease-in-out;
  width: 150px;
 height:auto;
}

.preview-image:hover {
  transform: scale(1.05);
}

.order-summary {
  margin-top: 2rem;
  font-size: 1rem;
  color: #666;
}

.order-details p {
  margin-bottom: 0.5rem;
}

.no-image-text, .no-order-data {
  font-style: italic;
  color: #999;
}

.payment-methods {
  margin-bottom: 2rem;
}

.payment-option {
  display: block;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #333;
}

.payment-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-methods input {
  margin-right: 1rem;
}

.payment-option input {
  cursor: pointer;
}
 
 
  
`}

</style>
    </div> 
  );
}