 
import React, { useState, useEffect, useRef } from "react";
import { chatFlow, ChatStep } from "./HelperFunctions/chatFlow";
import { getNextStep, ChatState } from "./chatEngine";
import { useRouter } from "next/navigation";
import "../app.css";   
interface Message {
  sender: "user" | "bot";
  text: string;
  id?: string;
  options?: string[];
  inputType?: string;
  accept?: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<ChatState>({ stepId: "start" });
  const [input, setInput] = useState("");
  const dummyRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [selectedProduct, setProduct] =  useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedPaper, setSelectedPaper] = useState('14pt Cover Semi Gloss');
  const [selectedQuantity, setSelectedQuantity] = useState('50');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedCoating, setSelectedCoating] = useState<string | null>(null);
  const [selectedRCorner, setSelectedRCorner] = useState<string | null>(null);
  const [selectedTurnaround, setSelectedTurnaround] = useState<string | null>(null); 
  const [isFrontOnly, setIsFrontOnly] = useState(false);
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [approvalType, setApprovalType] = useState<'electronic' | 'preapproved'>('electronic');
  const [orderName, setOrderName] = useState('');
const [frontFile, setFrontFile] = useState<string | null>(null);
const [backFile, setBackFile] = useState<string | null>(null);
const [isSmallScreen, setIsSmallScreen] = useState(false);
const [customSizeText, setCustomSizeText] = useState(''); 


  const [orderData, setOrderState] = useState<Record<string, any>>({
    product:selectedProduct,
  size: selectedSize,
    paper: selectedPaper,
    quantity: selectedQuantity,
    color: selectedColor,
    coating: selectedCoating,
    rCorner: selectedRCorner,
    turnaround: selectedTurnaround,
    orderName,
    orientation,
    approvalType, 
    frontFile,
    backFile,
    customSize: selectedSize === 'Custom' ? customSizeText : null,
  });
 


  // Initial greeting
  useEffect(() => {
    const start = chatFlow.start;
    const startText =
      typeof start.message === "function" ? start.message(orderData) : start.message;
    setMessages([{ sender: "bot", text: startText, options: start.options, id: start.id }]);
  }, []);

 
//removed the useEffect that had the save to local storage instance 
//which was saving previous entries and not reloading on refresh
 
  useEffect(() => {
    dummyRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  //handles the file upload for the bot if selected
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, stepId: string) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const key: "frontFile" | "backFile" = stepId === "uploadFileFront" ? "frontFile" : "backFile";
  const previewUrl = URL.createObjectURL(file);

  //kept the base64 conversion 
  const reader = new FileReader();
  reader.onloadend = () => {
    const base64 = reader.result as string;

    const saved = localStorage.getItem("orderData");
    const currentData = saved ? JSON.parse(saved) : {};
    const updatedData = { ...currentData, [key]: base64, [`${key}Name`]: file.name };

    // Persist for checkout page
    localStorage.setItem("orderData", JSON.stringify(updatedData));

    // Update local chatbot state
    setOrderState(updatedData);
 
    if (key === "frontFile") setFrontFile(base64);
    if (key === "backFile") setBackFile(base64);

    // Determine next step
    const color = updatedData.color || "Front and Back";
    const nextStepId = key === "frontFile" && color === "Front and Back"
      ? "uploadFileBack"
      : "confirmation";

    const nextStep = chatFlow[nextStepId];
    if (!nextStep) return;

    const botText = typeof nextStep.message === "function"
      ? nextStep.message(updatedData)
      : nextStep.message;

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: botText,
        options: nextStep.options,
        inputType: nextStep.inputType,
        accept: nextStep.accept,
        id: nextStep.id,
      },
    ]);

    setState((prev) => ({ ...prev, stepId: nextStep.id }));
  };

  reader.readAsDataURL(file);
};
//removed several test localstorage saves which were useless

  // Handle user input 
const handleUserResponse = (response: string) => {
  setMessages((prev) => [...prev, { sender: "user", text: response }]);

  const { state: newState, botStep } = getNextStep(state, response);
  setState(newState);
  
    const updatedOrderData = { ...orderData, ...newState.data };
  setOrderState(updatedOrderData);

  if (botStep.id === "checkout") {

 
    router.push("../Orders/Checkout");
    return;
  }

  const botText =
    typeof botStep.message === "function"
      ? botStep.message(orderData)
      : botStep.message;

  setMessages((prev) => [
    ...prev,
    {
      sender: "bot",
      text: botText,
      options: (botStep as ChatStep).options ?? undefined,
      inputType: (botStep as ChatStep).inputType ?? undefined,
      accept: (botStep as ChatStep).accept ?? undefined,
      id: (botStep as ChatStep).id,
      
    },
  ]);

  setInput("");
};
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) handleUserResponse(input.trim());
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.sender}`}>
            <p>{m.text}</p>

            {m.options && (
              <div className="options">
                {m.options.map((opt) => (
                  <button key={opt} onClick={() => handleUserResponse(opt)}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

        {m.inputType === "file" && (
              <div className="file-upload">
                <input
                  type="file"
                  accept={m.accept}
                  onChange={(e) => handleFileUpload(e, m.id!)}
                />
              </div>
            )}

    
          </div>
          
        ))}
        <div ref={dummyRef} />
      </div>
       
      
      <form onSubmit={handleSubmit} className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question or response..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;