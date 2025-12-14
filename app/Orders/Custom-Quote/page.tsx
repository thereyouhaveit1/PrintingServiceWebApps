 "use client"
import React, { useState, useEffect } from "react";
import { usePricing } from '../../PricingContext';
import "../../app.css";     

export default function CustomQuotePage() { 
  const [orderData, setOrderData] = useState<any>(null);
  const [description, setDescription] = useState("");
 const [orderName, setOrderName] = useState("");
  const [customPaper, setCustomPaper] = useState("");
  const [size, setSize] = useState("");
const [color, setColor] = useState("");
 const [orientation, setOrientation] = useState("");
  const [quantity, setQuantity] = useState("");
const [customCoating, setCustomCoating] = useState(""); 
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const { pricing, calculateSubtotal } = usePricing();
  const [subtotal, setSubtotal] = useState<number>(0);  
  const [isMobile, setIsMobile] = useState<boolean>(false); 


   useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);  
    };

    window.addEventListener("resize", handleResize);
    handleResize();  

    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const convertInchesToPixels = (size: string) => {
    const [widthInches, heightInches] = size.split(" x ").map(parseFloat);
    return { width: widthInches * 72, height: heightInches * 72 }; // 1 inch = 72 pixels
  };

  const imageSize = orderData?.size && orderData?.size !== "Custom"
    ? convertInchesToPixels(orderData.size)
    : { width: 144, height: 216 };

  useEffect(() => {
    const savedOrderData = localStorage.getItem("orderData");
    if (savedOrderData) {
      const data = JSON.parse(savedOrderData);
      setOrderData(data);
      setSubtotal(calculateSubtotal(data));
    }
  }, []);
 const aText: string[] = [
    "Every design we create is handcrafted and completely original!",
    "Ensuring a unique and professional finish",
    "Tailored to your needs!"
  ];

    const iSpeed: number = 100; 
  let iIndex: number = 0;  
  let iArrLength: number = aText[iIndex].length;  
  const iScrollAt: number = 50; 

  let iTextPos: number = 0;  
  let sContents: string = ''; 
  let iRow: number;  

useEffect(() => {
  const typewriter = () => {
    if (iIndex >= aText.length) return;  

    sContents = ' ';
    iRow = Math.max(0, iIndex - iScrollAt);
    const destination = document.getElementById("typedtext") as HTMLElement;

    if (!destination) return;

    while (iRow < iIndex) {
      sContents += aText[iRow++] + '<br />';
    }

    const currentText = aText[iIndex] || "";  
    destination.innerHTML =
      sContents + currentText.substring(0, iTextPos) + "<span class='blink'>&#10074;</span>";

    if (iTextPos++ === iArrLength) {
      iTextPos = 0;
      iIndex++;
      if (iIndex < aText.length) {
        iArrLength = aText[iIndex].length;
        setTimeout(typewriter, 500);
      }
    } else {
      setTimeout(typewriter, iSpeed);
    }
  };

  typewriter();
}, []);

   const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

 return (
     <div className="errThingInbetweenEditor" >    
        <div className="InnWrap">
        <div className="quote-content">
         {formSubmitted ? (
        <div className="thank-you-message">
          <h2>Thank you for reaching out!</h2>
          <p>We will get back to you shortly.</p>
        </div>
      ) : (    
          <div className="centerQuote">

            
            <h3>Custom Quote Request Form</h3>

            
            <div className="QuoteDes">If you have a specific design in mind, please provide 
              a brief description below. Our team will review your request and
               contact you promptly. You may include details such as embossing, 
               debossing, edge painting, gold foil, or whether you’re looking for
                a logo, flyer, or business card design.</div>

            <label className="quoteInputs">
              Description / Notes:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your design, including embossing, debossing, edge painting, gold foil, logo, flyer, or business card design."
                rows={6}
              />
            </label>

            <label className="quoteInputs">
              Paper:
              <input
                type="text"
                value={customPaper}
                onChange={(e) => setCustomPaper(e.target.value)}
                placeholder="Specify paper type"
              />
            </label>

          <label className="quoteInputs">
              Coating:
              <input
                type="text"
                value={customCoating}
                onChange={(e) => setCustomCoating(e.target.value)}
                placeholder="Specify coating"
              />
            </label>

             <label className="quoteInputs">
              Phone:
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
              />
            </label>

             <label className="quoteInputs">
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
              />
            </label>

          </div>
             )}  
          <button type="submit" className="submit-btn">
            Submit
          </button>    
    
 
        <style jsx>{`
        .submitQuoteReqBttn{ 
  padding: 10px 16px;
  background: #007aff;
  color: white;
  width:50%;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  font-size: 14px;
        }
  .quoteInputs{
   width:80%;
  }
       
          .quote-content {
            display: flex;
            gap: 30px;
            background: #fff;
            padding: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
            border-radius: 12px;
            width: 60%;    
            justify-content: center;  
            align-items: center;  
            flex-direction: column; 

          }

          
          .centerQuote {
            display: flex;  
            flex-direction: column; 
            align-items: center;
          }
          label {
            display: block;
            margin-bottom: 1rem;
            font-weight: 500;
          }
          input, textarea {
            width: 100%;
            padding: 8px;
            margin-top: 4px;
            border: 1px solid #ccc;
            border-radius: 6px;
          }
      
 .QuoteDes{
 padding:25px
 }
          @media screen and (max-width: 1000px) {
         
          
            .quote-content {   
              width: 100%;
            height: 93%; 
            top:35px;
            border-radius: 0px;
               display: flex;  
            flex-direction: column; 
            align-items: center;
            padding:10px;
            overflow:hidden;
            }
             .centerQuote {
             width: 100%;
            height: 100%; 
            overflow-y:scroll;
          }

         @media screen and (orientation: landscape) {
 
.quote-content {      width: 80%;
height:90%; top:2px; position:absolute;
 overflow-y:scroll;   border-radius:3px; 
            }
        } 

      
        `}</style>
    </div>
         </div>
     </div>
  );
}