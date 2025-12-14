"use client";

import React, { useState, useEffect } from "react";
import { usePricing } from "../../PricingContext";
import "../../app.css";

export default function ConfirmOrder() {
  const [orderData, setOrderData] = useState<any>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const { calculateSubtotal } = usePricing();

  useEffect(() => {
    const savedOrderData = localStorage.getItem("orderData");
    if (savedOrderData) {
      const data = JSON.parse(savedOrderData);
      setOrderData(data);
      setSubtotal(calculateSubtotal(data));
    }
  }, [calculateSubtotal]);

  return (
    
  <div className="errThingInbetween"  > 
    <div className="thank-you-container">
      <h1>Thank You for Your Order!</h1>
      <p>Your order has been successfully placed. Below are the details:</p>
      <div className="order-details">
        <h2>Order Summary</h2>
        <ul>
          {orderData ? (
            <>
              <li><strong>Order Name:</strong> {orderData.orderName}</li>
              <li><strong>Size:</strong> {orderData.size}</li>
              <li><strong>Paper:</strong> {orderData.paper}</li>
              <li><strong>Quantity:</strong> {orderData.quantity}</li>
              <li><strong>Color:</strong> {orderData.color || "N/A"}</li>
              <li><strong>Coating:</strong> {orderData.coating || "N/A"}</li>
              <li><strong>Turnaround Time:</strong> {orderData.turnaround || "N/A"}</li>
              <li><strong>Order Total:</strong> ${subtotal.toFixed(2)}</li>
              {orderData.frontFile && (
                <li>
                  <strong>Front File:</strong> <img src={orderData.frontFile} alt="Front File" style={{ width: "100px", height: "auto", marginTop: "10px" }} />
                </li>
              )}
              {orderData.backFile && (
                <li>
                  <strong>Back File:</strong> <img src={orderData.backFile} alt="Back File" style={{ width: "100px", height: "auto", marginTop: "10px" }} />
                </li>
              )}
            </>
          ) : (
            <li>No order data available.</li>
          )}
        </ul>
      </div>

      <div className="thank-you-note">
        <p>We appreciate your business. You will receive an email confirmation shortly.</p>
      </div>

      <div className="action-buttons">
        <button onClick={() => window.location.href = "/"} className="continue-shopping-btn">Continue Shopping</button>
        <button onClick={() => window.location.href = "/Checkout"} className="view-order-btn">View Your Order</button>
      </div>
    </div>
      </div>
  );
}