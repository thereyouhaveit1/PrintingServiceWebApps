"use client";
import React, { useState, useEffect, useRef } from "react";
import "../../app.css";  

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, 
    });
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch('https://www.renegraphics.net/api/send-email', {   // Use your API Gateway URL here
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setFormSubmitted(true);
      console.log('Form submitted:', formData);
    } else {
      const errorData = await response.json();
      console.error('Failed to send email:', errorData.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

  

 const aText: string[] = [ 
    "Or give us a call! At (555) 555-5555" 
  ];

  const iSpeed: number = 100; 
  let iIndex: number = 0;  
  let iArrLength: number = aText[iIndex].length;  
  const iScrollAt: number = 50; 

  let iTextPos: number = 0;  
  let sContents: string = ''; 
  let iRow: number;  
useEffect(() => {
  let iIndex = 0;
  let iTextPos = 0;
  let iArrLength = aText[iIndex].length;
  let sContents = '';
  let iRow = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  const typewriter = () => {
    const destination = document.getElementById("typedtext") as HTMLElement;
    if (!destination) return;

    if (iIndex >= aText.length) return;

    sContents = '';
    iRow = Math.max(0, iIndex - iScrollAt);

    while (iRow < iIndex) {
      sContents += aText[iRow++] + "<br />";
    }

    const currentText = aText[iIndex] || "";
    destination.innerHTML =
      sContents +
      currentText.substring(0, iTextPos) +
      "<span class='blink'>&#10074;</span>";

    if (iTextPos++ === iArrLength) {
      iTextPos = 0;
      iIndex++;
      if (iIndex < aText.length) {
        iArrLength = aText[iIndex].length;
        timeoutId = setTimeout(typewriter, 500);
      }
    } else {
      timeoutId = setTimeout(typewriter, iSpeed);
    }
  };

  const startAnimation = () => {
    iIndex = 0;
    iTextPos = 0;
    iArrLength = aText[iIndex].length;
    sContents = '';
    iRow = 0;
    typewriter();
  };

  startAnimation();
  const intervalId = setInterval(() => {
    if (timeoutId) clearTimeout(timeoutId);
    startAnimation();
  }, 20000); 

  return () => {
    clearInterval(intervalId);
    if (timeoutId) clearTimeout(timeoutId);
  };
}, []);



//submit button is the email button. add when you get a domian
  return (
     <div className="errThingInbetweenEditor" >    
        <div className="InnWrap">
    
    <div className="contact-us-container">
      <h1>Contact Us</h1>
      {formSubmitted ? (
        <div className="thank-you-message">
          <h2>Thank you for reaching out!</h2>
          <p>We will get back to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Enter subject"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Enter your message"
            ></textarea>
          </div>
          
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      )}
</div>
      
    </div>
  
             
    </div>
  );
};

export default ContactUs;