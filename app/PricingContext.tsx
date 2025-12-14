import React, { createContext, useState, useContext, useEffect } from "react";
 
export interface OrderData {
  size: keyof typeof pricing.size;
  customSize?: string;
  paper: keyof typeof pricing.paper;
  quantity: keyof typeof pricing.quantity; 
  rCorner?: "Yes" | "No";
  turnaround: keyof typeof pricing.turnaround;
  orderName: string; 
  approvalType: string;
  isFrontOnly: string;
  color: string;
}

const pricing = {
  size: {
    "2 x 3": 0.4,
    "3 x 3": 0.4,
    "1.5 x 1.5": 0.4,
    "1.5 x 3.5": 0.4,
    "2.5 x 3.5": 0.4,
    Custom: 0.50,
  },
  paper: {
    "14pt Cover Semi Gloss": 0.12,
    "16pt Cover Matte": 0.13,
   "16pt Cover Semi Gloss": 0.131,
  },
  quantity: {
    50: 1,
    100: 0.9, // apply 10% discount
    150: 0.2, // apply 20% discount
    200: 0.75, // apply 25% discount
    250: 0.7,  // apply 30% discount
    500: 0.65, // apply 35% discount
  },
 
  rCorner: 0.05,
  turnaround: {
    Standard: 0.4,
    Expedited: 5,
    "Next Business Day": 10,
    SameDay: 5,
  },
};

export const calculateSubtotal = (order: any) => {
  const quantity = Number(order.quantity) || 0;
  const basePricePerUnit = 1;  

  // Multipliers
  const colorMultiplier = 
    order.color === "Front Only" ? 0.9 :
    order.color === "Front & Back" ? 0.8 : 1;

  const turnaroundMultiplier = 
    order.turnaround === "Same Day" ? 1.5 :
    order.turnaround === "Next Business Day" ? 1.3 :
    order.turnaround === "2-4 Business Days" ? 1.1 :
    order.turnaround === "5-7 Business Days" ? 1.05 :
    1;

  const paperMultiplier = 
    order.paper === "14pt Cover Semi Gloss" ? 1.1 :
    order.paper === "16pt Cover Matte" ? 1.15 :
    order.paper === "16pt Cover Semi Gloss" ? 1.2 :
    1;
 

  const rCornerMultiplier =   
    order.rCorner === "1/8th Round Corner" ? 1.05 :
    order.rCorner === "1/3th Round Corner" ? 1.1 :
    order.rCorner === "No Round Corner" ? 1 : 1;

 
  const subtotal = quantity * basePricePerUnit *
                   colorMultiplier *
                   paperMultiplier * 
                   turnaroundMultiplier *
                   rCornerMultiplier;

  return parseFloat(subtotal.toFixed(2));
};
const PricingContext = createContext<any>(null);


export const PricingProvider = ({ children }: { children: React.ReactNode }) => {
  const [pricingData, setPricingData] = useState(pricing);

  useEffect(() => {
    localStorage.setItem("pricing", JSON.stringify(pricing));
  }, []);

  return (
    <PricingContext.Provider value={{ pricing, calculateSubtotal }}>
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error("usePricing must be used within a PricingProvider");
  }
  return context;
};