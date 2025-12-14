
export interface ChatStep {
  id: string;
  message: string | ((state: any) => string);
  options?: string[];
  inputType?: "text" | "select" | "file";
  next?: string | ((response: any, state?: any) => string);
  handler?: (
    response: any,
    state: any,
    updateState?: (state: any) => void,
    goToNext?: (nextStep: string) => void
  ) => any;
  accept?: any;
} 
 


// FAQ helper
interface FAQ {
  question: RegExp;
  answer: string;
}

  
const saveToLocalStorage = (state: any) => {
  const orderData = {
    product:state.selectedProduct,
    size: state.selectedSize,
    customSize: state.customSize,
    paper: state.selectedPaper,
    quantity: state.selectedQuantity,
    rCorner: state.selectedRCorner,
    coating: state.selectedCoating,
    turnaround: state.selectedTurnaround,
    orderName: state.orderName,
    orientation: state.orientation,
    approvalType: state.approvalType,
    color: state.color, 
    frontFile: state.frontFile,
    backFile: state.backFile,
  };
  localStorage.setItem("orderData", JSON.stringify(orderData));
};
export const faqs: FAQ[] = [
  { question: /\bwh[ao]{0,2}t.*card.*sizes?\b|business.*card.*sizes?|\bsizes?\b|\bdimensions?\b/i,
    answer: "We offer a variety of sizes including: 2 x 3, 3 x 3, 1.5 x 1.5, 1.5 x 3.5, 2.5 x 3.5. But you can also customize your size." },
  { question: /\bhow.*long.*print.*cards?\b|card.*priting.*time?|card.*print.*times?|\bturnaround\b/i,
    answer: "Printing usually takes 2-4 business days, but same-day and next-day options are available." },
  { question: /\bpaper.*\b|\btypes.*of.*paper\b|\bmaterials?\b|card.*material\b/i,
    answer: "We offer 14pt Cover Semi Gloss, 16pt Cover Matte, and 16pt Cover Semi Gloss." },
  { question: /\bupload\b.*\bdesign\b.*\bfile\b|\bhow\b.*\bupload\b.*\bdesign\b|\bsubmit\b.*\bfile\b|\bdesign\b.*\bsubmission\b/i,
    answer: "You can upload your design file in various formats like .png, .jpg, .ai, .psd, and others." },
  { question: /\brush\b.*\bservices?\b|do.*you.*offer.*rush|rush.*delivery\b/i,
    answer: "Yes, we do offer rush services such as, same and next day pick up." },
  { question: /\bfuck\b.*|\bshit\b.*\b|do.*you|are.*you|i.*fucking|fuck.*off|hate.*you\b/i,
    answer: "That's not very nice of you. But I'll still help you..." },
  { question: /\bty\b.*|\bthank\b.*\b|thank.*you|t.*you\b/i,
    answer: "You're welcome, Lets start by getting a name for the order.." },
  { question: /\need\b.*|\cant\b.*\b|need.*to|get.*some\b/i,
    answer: "No problem, Lets start by getting a name for the order.." },
      { question: /\no\b.*|\questiion\b.*\b|I.*have|a.*question\b/i,
    answer: "No problem, ask away.." },
];

export const getFAQResponse = (userInput: string): string | null => {
  const normalizedInput = userInput.toLowerCase().replace(/[^\w\s]/g, "");
  for (let faq of faqs) {
    if (faq.question.test(normalizedInput)) return faq.answer;
  }
  return null;
};

// orientation
export const inferOrientation = (size: string): "landscape" | "portrait" => {
  if (!size.includes("x")) return "landscape";
  const [w, h] = size.split("x").map(v => parseFloat(v.trim()));
  return w >= h ? "landscape" : "portrait";
};
const loadFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem("orderData");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};
// Main chat flow
export const chatFlow: Record<string, ChatStep> = {
 
start: {
  id: "start",
  message: "Hi! What’s your name?",
  inputType: "text",
  handler: (response, state, updateState) => { 
let cleanedResponse = response.trim();

    // Case-insensitive match for "hi my name is"
    cleanedResponse = cleanedResponse.replace(/^hi\s*my\s*name\s*is\s*/i, "");

    const newState = { ...state, orderName: cleanedResponse };
    if (updateState) updateState(newState);
    saveToLocalStorage(newState);

    return newState;
  },
  next: "confirmStart",
},
confirmStart: {
  id: "confirmStart",
  message: (state) => {
    const persisted = loadFromLocalStorage();
    const name = state.orderName || persisted.orderName || "friend";
    return `Nice to meet you, ${name}! We'll go in order to keep things simple, is that okay?`;
  },
  inputType: "select",
  options: ["No, I have a general question", "Yes, please help me build my order"],
  next: (response) =>
    response === "Yes, please help me build my order"
      ? "selectProduct"
      : "faq",
},
 
selectProduct: {
  id: "selectProduct",
  message: "What type of product would you like to create?",
  inputType: "text",
  options: ["Business Card", "Invitations", "Flyers","Menus", "Invoices", "Labels",
    "Booklets","NCR Forms","Envelopes","Postcards","Letterheads","Get A Custom Quote"],
   handler: (response, state) => ({ ...state, selectedProduct: response }),
    next: (response) => {
    switch (response) {
      case "Business Card":
        return "businesscard";
      case "Invitations":
        return "invite";
      case "Flyers":
        return "flyer"
      case "Menus":
        return "menus";
      case "Invoices":
        return "invoices";
      case "Labels":
        return "labels";
        case "Booklets":
        return "booklets";
      case "NCR Forms":
        return "ncrforms";
      case "Envelopes":
        return "envelopes";
      case "Postcards":
        return "postcards";
      case "Letterheads":
        return "letterheads";
      case "Get A Custom Quote":
        return "get a custom quote";

      default:
        return "faq"; 
    }
  },
},
   

  businesscard: {
    id: "businesscard",
    message: "Great! Let's build your business card order. What size do you want?",
    inputType: "select",
    options: [  "2 x 3", "3 x 3", "1.5 x 1.5", "1.5 x 3.5", "2.5 x 3.5"],
    handler: (response, state) => ({
      ...state,
      selectedSize: response,
      orientation: inferOrientation(response),
    }),
    next: "paper",
  },
  paper: {
    id: "paper",
    message: "Next, select a type of paper for your card.",
    inputType: "select",
    options: ["14pt Cover Semi Gloss", "16pt Cover Matte", "16pt Cover Semi Gloss"],
    handler: (response, state) => ({ ...state, selectedPaper: response }),
    next: "color",
  },



  invite: {
    id: "invite",
    message: "Awesome! Let's build your invitations order. What size do you want?",
    inputType: "select",
    options: [  "5 x 7", "6 x 8", "4 x 6", "7 x 5", "5.5 x 7.5"],
    handler: (response, state) => ({ ...state, selectedSize: response }),
    next: "invitepaper",
  },
  invitepaper: {
    id: "invitepaper",
    message: "Next, select a type of paper for your card.",
    inputType: "select",
    options: [ "14pt Cover Semi Gloss", "16pt Cover Matte", "16pt Cover Semi Gloss"],
    handler: (response, state) => ({ ...state, selectedPaper: response }),
    next: "color",
  },
 
  
 
  flyer: {
    id: "flyer",
    message: "Perfect! Let's build your flyer order. What size do you want?",
    inputType: "select",
    options: [  "8 x 9", "7 x 9", "5 x 7", "6 x 7", "7 x 8"],
    handler: (response, state) => ({ ...state, selectedSize: response }),
    next: "flyerpaper",
  },
  flyerpaper: {
    id: "flyerpaper",
    message: "Next, select a type of paper for your card.",
    inputType: "select",
    options: [ "100 lbs Semi Gloss",
  "120 lbs Matte",
  "110 lbs Royal Sundance",
  "100 lbs Silk",
  "100 lbs Textured",
  "120 lbs linen",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond ", ],
    handler: (response, state) => ({ ...state, selectedPaper: response }),
    next: "color",
  },
 


 menus: {
    id: "menus",
    message: "Perfect! Let's build your menus order. What size do you want?",
    inputType: "select",
    options: [ "7 x 9", "5 x 7", "7 x 10", "7 x 8", "5 x 5"],
    handler: (response, state) => ({ ...state, selectedSize: response }),
    next: "menuspaper",
  },
  menuspaper: {
    id: "menuspaper",
    message: "Next, select a type of paper for your card.",
    inputType: "select",
    options: ["100 lbs Semi Gloss,", "110 lbs Semi Gloss","14pt Cover Semi Gloss", "16pt Cover Matte", "16pt Cover Semi Gloss"],
    handler: (response, state) => ({ ...state, selectedPaper: response }),
    next: "color",
  },
 


 invoices: {
    id: "invoices",
    message: "Perfect! Let's build your invoices order. What size do you want?",
    inputType: "select",
    options: [  "10 x 8.5", "7 x 10", "5 x 7", "7 x 8"],
    handler: (response, state) => ({ ...state, selectedSize: response }),
    next: "invoicespaper",
  },
  invoicespaper: {
    id: "invoicespaper",
    message: "Next, select a type of paper for your card.",
    inputType: "select",
    options: [ "100 lbs Glossy",
  "120 lbs Matte",
  "110 lbs Royal Sundance",
  "100 lbs Silk",
  "100 lbs Textured",
  "120 lbs linen",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond", ],
    handler: (response, state) => ({ ...state, selectedPaper: response }),
    next: "color",
  },
 



 labels: {
    id: "labels",
    message: "Perfect! Let's build your labels order. What size do you want?",
    inputType: "select",
    options: [ "3 x 3", "4 x 4", "2 x 2", "2.5 x 2.5", "3.5 x 4"],
    handler: (response, state) => ({ ...state, selectedSize: response }),
    next: "labelspaper",
  },
 labelspaper: {
    id: "paper",
    message: "Next, select a type of paper for your card.",
    inputType: "select",
    options: [ "100lbs Glossy", ],
    handler: (response, state) => ({ ...state, selectedPaper: response }),
    next: "color",
  },
 



   booklets: {
    id: "booklets",
    message: "Perfect! Let's build your booklets order What size do you want?",
    inputType: "select",
    options: [ "8.5 x 11", "7 x 5", "8 x 10", "8 x 5", "10 x 8"],
    handler: (response, state) => ({ ...state, selectedSize: response }),
    next: "bookletspaper",
  },
  bookletspaper: {
    id: "bookletspaper",
    message: "Next, select a type of paper for your card.",
    inputType: "select",
    options: [ "100 lbs Glossy",
  "120 lbs Matte",
  "110 lbs Royal Sundance",
  "100 lbs Silk",
  "100 lbs Textured",
  "120 lbs linen",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond", ],
    handler: (response, state) => ({ ...state, selectedPaper: response }),
    next: "color",
  },
 

   postcards: {
    id: "postcards",
    message: "Perfect! Let's build your postcards order. What size do you want?",
    inputType: "select",
    options: [ "4 x 6", "5 x 7", "3 x 7", "7 x 7", "6 x 6"],
    handler: (response, state) => ({ ...state, selectedSize: response }),
    next: "postcardspaper",
  },
  postcardspaper: {
    id: "postcardspaper",
    message: "Next, select a type of paper for your card.",
    inputType: "select",
    options: ["14pt Cover Semi Gloss", "16pt Cover Matte", "16pt Cover Semi Gloss"],
    handler: (response, state) => ({ ...state, selectedPaper: response }),
    next: "color",
  },
 

   envelopes: {
    id: "envelopes",
    message: "Perfect! Let's build your envelopes order. What size do you want?",
    inputType: "select",
    options: ["#10", "#9","#6"],
    handler: (response, state) => ({ ...state, selectedSize: response }),
    next: "envelopespaper",
  },
  envelopespaper: {
    id: "envelopespaper",
    message: "Next, select a type of paper for your card.",
    inputType: "select",
    options: ["24lb Standard white matte", "32lb Premium White", "24lb Pastel Green"],
    handler: (response, state) => ({ ...state, selectedPaper: response }),
    next: "color",
  },
 

   letterheads: {
    id: "letterheads",
    message: "Perfect! Let's build your letterheads order. What size do you want?",
    inputType: "select",
    options: [ "8.5 x 11", "11 x 8.5"],
    handler: (response, state) => ({ ...state, selectedSize: response }),
    next: "letterheadspaper",
  },
  letterheadspaper: {
    id: "letterheadspaper",
    message: "Next, select a type of paper for your card.",
    inputType: "select",
    options: [ "100 lbs Glossy",
  "120 lbs Matte",
  "110 lbs Royal Sundance",
  "100 lbs Silk",
  "100 lbs Textured",
  "120 lbs linen",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond", ],
    handler: (response, state) => ({ ...state, selectedPaper: response }),
    next: "color",
  },
 


  ncrforms: {
    id: "ncrforms",
    message: "Perfect! Let's build your letterheads order. What size do you want?",
    inputType: "select",
    options: [ "8.5 x 11", "11 x 8.5"],
    handler: (response, state) => ({ ...state, selectedSize: response }),
    next: "ncrformspaper",
  },
  ncrformspaper: {
    id: "ncrformspaper",
    message: "Next, select a type of paper for your card.",
    inputType: "select",
    options: [ "100 lbs Glossy",
  "120 lbs Matte",
  "110 lbs Royal Sundance",
  "100 lbs Silk",
  "100 lbs Textured",
  "120 lbs linen",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond", ],
    handler: (response, state) => ({ ...state, selectedPaper: response }),
    next: "color",
  },
 



//adjusted handler to use newState and
//  updated the variable used in the new state to match the saveToLocalStorage

color: {
  id: "color",
  message: "Do you want print on one side or both sides?",
  inputType: "select",
  options: ["Front Only", "Front and Back"],
  handler: (response, state, updateState) => {
    const newState = { ...state, color: response };  
    if (updateState) updateState(newState);
    saveToLocalStorage(newState);
    return newState;
  },
  next: "coating",
},
  coating: {
    id: "coating",
    message: "Select the type of coating for your card.",
    inputType: "select",
    options: ["Semi Gloss", "No Gloss"],
    handler: (response, state, updateState) => {
    const newState = { ...state, selectedCoating: response };  
    if (updateState) updateState(newState);
    saveToLocalStorage(newState);
    return newState;
  },
    next: "roundcorner",
  },
  roundcorner: {
    id: "roundcorner",
    message: "Do you want round corners?",
    inputType: "select",
    options: ["1/8th Round Corner", "1/3th Round Corner", "No Round Corner"],
    handler: (response, state) => ({ ...state, selectedRCorner: response }),
    next: "quantity",
  },
  quantity: {
    id: "quantity",
    message: "How many cards would you like to print?",
    inputType: "select",
    options: ["50", "150", "250", "500"],
    handler: (response, state) => ({ ...state, selectedQuantity: response }),
    next: "turnaround",
  },
  turnaround: {
    id: "turnaround",
    message: "What is your preferred printing turnaround?",
    inputType: "select",
    options: ["Same Day", "Next Business Day", "2-4 Business Days", "5-7 Business Days"],
   handler: (response, state, updateState) => {
    const newState = { ...state, selectedTurnaround: response };  
    if (updateState) updateState(newState);
    saveToLocalStorage(newState);
    return newState;
  },
    next: "approval",
  },
  approval: {
    id: "approval",
    message: "How would you like to approve your design?",
    inputType: "select",
    options: ["Pre-approved physical print", "Electronic sample"],
   handler: (response, state, updateState) => {
    const newState = { ...state, approvalType: response };  
    if (updateState) updateState(newState);
    saveToLocalStorage(newState);
    return newState;
  },
    next: "uploadOrQuote",
  },
  //removed handlers for the input files 
  uploadOrQuote: {
    id: "uploadOrQuote",
    message: "Would you like to upload your design or request a custom quote?",
    inputType: "select",
    options: ["Upload design", "Get a custom quote","Create custom design"],
    next: (response, _state) => (response === "Upload design"
    ? "uploadFileFront"
    : response === "Custom quote"
    ? "redirectCustomQuote"
    : "redirectCustomDesign"),
  },

uploadFileFront: {
  id: "uploadFileFront",
  message: (state) => {
    const persisted = loadFromLocalStorage();
    const color = state.color || persisted.color;
    return `You selected ${color}, so for now upload your Front file`;
  },
  inputType: "file",
  accept: ".png,.jpg,.jpeg,.psd,.ai,.eps,.tif",
  next: (state) => {
    const persisted = loadFromLocalStorage();
    const color = state.color || persisted.color;
    return color === "Front and Back" ? "uploadFileBack" : "confirmation";
  },
},
uploadFileBack: {
  id: "uploadFileBack",
  message: (state) => {
    const persisted = loadFromLocalStorage();
    const color = state.color || persisted.color || "Front Only";
    return `You selected ${color}, you've uploaded your front file, now upload your Back file`;
  },
  inputType: "file",
  accept: ".png,.jpg,.jpeg,.psd,.ai,.eps,.tif",
  
  next: "confirmation",
},

redirectCustomQuote: {
  id: "redirectCustomQuote",
  message: "You will now be redirected to complete your request.",
  inputType: "select",
  options: ["Yes", "No"],
  next: (response, state) => {
    if (response === "Yes") {  
      window.location.href = "../Orders/Custom-Quote";
    }
    return "loading";
  },
},
redirectCustomDesign: {
  id: "redirectCustomDesign",
  message: "You will now be redirected to build your custom design.",
  inputType: "select",
  options: ["Yes", "No"],
  next: (response, state) => {
    if (response === "Yes") {  
      window.location.href = "../Orders/Canvas-Editor";
    }
    return "loading";
  },
},

confirmation: {
  id: "confirmation",
  message: "All set! Do you want to submit your order?",
  inputType: "select",
  options: ["Yes", "No"],
  next: (response, state) => {
    if (response === "Yes") {
      
      window.location.href = "../Orders/Checkout";
    }
    return "loading";
  },
},

loading: {
  id: "loading",
  message: "Loading... please wait",
},

faq: {
  id: "faq",
  message: "I'm not sure I understood that. Can you rephrase?",
  inputType: "text",
  next: "start",
},



};