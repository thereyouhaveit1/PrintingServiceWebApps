
"use client";

import React, { useRef, useEffect, useState  } from "react";
import "../../app.css"; 
import { useRouter } from "next/navigation";
import type { OutputData } from "@editorjs/editorjs";
import html2canvas from "html2canvas";
import { ToastContainer,toast } from 'react-toastify'; 
import ColorPicker from "editorjs-color-picker";   
 

type ProductOption = {
  paperOptions: string[];
    productName: string[];
        quantityOptions: string[];
};

type ProductOptions = {
  "Business Card": ProductOption;
  "Flyers": ProductOption;
  "Invitations": ProductOption;
  "Booklets": ProductOption;
  "Brochures": ProductOption;
  "Envelopes": ProductOption;
  "Invoices": ProductOption;
  "Letterheads": ProductOption;
  "Menus": ProductOption;
  "NCR": ProductOption;
  "Postcards": ProductOption;
  "Stickers": ProductOption;
};


interface EditorProps {
  initialData?: any;   paperOptions: string[];      productName: string[];  quantityOptions: string[];
   onSave?: (data: any) => void;  onSubmit: (orderData: any) => void;  
}

 
const Editor: React.FC<EditorProps> = ({ initialData, onSave, paperOptions, productName, onSubmit ,quantityOptions}) => {
 
const dropdownRefPaper = useRef<HTMLDivElement>(null);
  const buttonRefPaper = useRef<HTMLButtonElement>(null);
  const dropdownRefQuant= useRef<HTMLDivElement>(null);
  const buttonRefQuant = useRef<HTMLButtonElement>(null);
  const editorRef = useRef<any>(null);
const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const applyAlignment = (alignment: "left" | "center" | "right") => {
  const editor = editorRef.current;
  
  if (!editor) return;

  const currentBlockIndex = editor.blocks.getCurrentBlockIndex();
  const currentBlock = editor.blocks.getBlockByIndex(currentBlockIndex);

  if (currentBlock && currentBlock.tunes) {
    currentBlock.tunes.set("textAlignment", alignment);
  }
};



useEffect(() => {
  const savedOrder = localStorage.getItem("orderData");
  if (savedOrder) {
    const parsedOrder = JSON.parse(savedOrder); 
const sizeLabel = parsedOrder.size;
    // Hydrate global order state
    setOrderState(parsedOrder);
    console.log("Saved from prev page:", parsedOrder);
if (parsedOrder.size) {
  setSelectedSize(parsedOrder.size);
}if (parsedOrder.size && parsedOrder.productName) {
  const sizes = productSizes[parsedOrder.productName];
  const matchedSize = sizes?.find(
    (s) =>
    
      `${s.heightInches}x${s.widthInches}` === parsedOrder.size
  );

  if (matchedSize) {
    setSize(matchedSize); setSelectedSize(sizeLabel);
  }
}
    // Hydrate individual states
    setSelectedProduct(parsedOrder.productName?? null);
    setSelectedSize(parsedOrder.size ?? null);
    setSelectedPaper(parsedOrder.paper ?? 'Select Paper');
    setSelectedQuantity(parsedOrder.quantity?? null);
    setSelectedColor(parsedOrder.color ?? 'Front and Back');
    setSelectedCoating(parsedOrder.coating ?? null);
    setSelectedRCorner(parsedOrder.rCorner ?? 'no round corner');
    setSelectedTurnaround(parsedOrder.turnaround ?? null);
    setOrderName(parsedOrder.orderName ?? ''); 
      setOrderEmail(parsedOrder.orderEmail ?? ''); 
    setApprovalType(parsedOrder.approvalType ?? 'electronic');
    setFrontFile(parsedOrder.frontFile ?? null);
    setBackFile(parsedOrder.backFile ?? null);
    setFrontEditorData(parsedOrder.frontEditorData ?? null);
    setBackEditorData(parsedOrder.backEditorData ?? null);
    setCustomSizeText(parsedOrder.customSize ?? ''); 

  }
}, []);


  const [isPaperOpen, setIsPaperOpen] = useState(false);
   const [isQuantityOpen, setIsQuantityOpen] = useState(false);

 const toggleQuantityMenu = (e: React.MouseEvent) => {
    e.stopPropagation();  
    setIsQuantityOpen(!isQuantityOpen);
  };

  const togglePaperMenu = (e: React.MouseEvent) => {
    e.stopPropagation();  
    setIsPaperOpen(!isPaperOpen);
  };
  const handleMouseLeave = (setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) => (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsOpen(false);
  };


type Product = keyof ProductOptions; 
const productOptions: ProductOptions = {
  "Business Card": {
    paperOptions:['14pt Cover Semi Gloss', '14pt Matte Paper', '16pt Semi Gloss Paper','16pt Matte Paper'],  
  productName:["Business Card"],
 quantityOptions:['50', '100', '250', '500', '1000','1500','2000','2500','3000']
},
  "Flyers": {
    paperOptions: [
      "100 lbs Semi Gloss",
  "120 lbs Matte Paper", 
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "120 lbs Standard Bond Paper"
      ],
      productName:["Flyers"],
 quantityOptions:['50', '100', '250', '500', '1000','1500','2000','2500','3000']
  },
  "Invitations": {
    paperOptions: [
 '14pt Cover Semi Gloss', '16pt Cover Matte', '16pt Cover Semi Gloss'
      ],
      productName:["Invitations"],
 quantityOptions:['50', '100', '250', '500', '1000','1500','2000','2500','3000']
},
   "Booklets": {
    paperOptions: ["100 lbs Glossy Paper",
  "120 lbs Matte Paper",
  "110 lbs Royal Sundance Paper",
  "100 lbs Silk Paper",
  "100 lbs Textured Paper",
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond Paper"],  
  productName:["Booklets"],
 quantityOptions:['50', '100', '250', '500', '1000','1500','2000','2500','3000']
  },
  "Brochures": {
    paperOptions: ["100 lbs Glossy Paper",
  "120 lbs Matte Paper",
  "110 lbs Royal Sundance Paper",
  "100 lbs Silk Paper",
  "100 lbs Textured Paper",
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond Paper"],
  productName:["Brochures"],
 quantityOptions:['50', '100', '250', '500', '1000','1500','2000','2500','3000']
  },
  "Envelopes": {
    paperOptions: [
        "24lb Standard white matte", "32lb Premium White", "24lb Pastel Green"
      ],
      productName:["Envelopes"],
 quantityOptions:['50', '100', '250', '500', '1000','1500','2000','2500','3000']
  
  },
   "Invoices": {
    paperOptions: ["100 lbs Semi Gloss ",
  "120 lbs Matte Paper", 
  "120 lbs Semi Gloss Paper",
  "80 lbs Semi Gloss",
  "120 lbs Standard Bond Paper"   ],  
  productName:["Invoices"],
 quantityOptions:['50', '100', '250', '500', '1000','1500','2000','2500','3000']
  },
  "Letterheads": {
    paperOptions: [ "110lb Standard Uncoated Paper",
  "120 lbs Matte Paper",
  "110 lbs Royal Sundance Paper",
  "100 lbs Silk Paper",
  "100 lbs Textured Paper",
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond Paper" ],
  productName:["Letterheads"],
 quantityOptions:['50', '100', '250', '500', '1000','1500','2000','2500','3000']
  },
  "Menus": {
    paperOptions: [ "14pt Cover Semi Gloss", "100 lbs Semi Gloss,", 
        "110 lbs Semi Gloss","16pt Cover Matte", "16pt Cover Semi Gloss",
       "100 lbs Semi Gloss",
  "120 lbs Matte Paper",
  "110 lbs Royal Sundance Paper",
  "100 lbs Silk Paper",
  "100 lbs Textured Paper",
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond Paper" ],
  
  productName:["Menus"],
 quantityOptions:['50', '100', '250', '500', '1000','1500','2000','2500','3000']
  
  },
   "NCR": {
    paperOptions: [ "100 lbs Semi Gloss",
  "120 lbs Matte Paper",
  "110 lbs Royal Sundance Paper",
  "100 lbs Silk Paper",
  "100 lbs Textured Paper",
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond Paper" ],  
  productName:["NCR"],
 quantityOptions:['50', '100', '250', '500', '1000','1500','2000','2500','3000']
  },
  "Postcards": {
    paperOptions: [ "100 lbs Semi Gloss",
  "120 lbs Matte Paper",
  "110 lbs Royal Sundance Paper",
  "100 lbs Silk Paper",
  "100 lbs Textured Paper",
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond Paper" ],
  productName:["Postcards"],
 quantityOptions:['50', '100', '250', '500', '1000','1500','2000','2500','3000']
  },
  "Stickers": {
    paperOptions: [ '90lb Semi Gloss',  '100lb Semi Gloss',"100 lbs Semi Gloss",
  "120 lbs Matte Paper",
  "110 lbs Royal Sundance Paper",
  "100 lbs Silk Paper",
  "100 lbs Textured Paper",
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond Paper" ],
  productName:["Stickers"],
 quantityOptions:['50', '100', '250', '500', '1000','1500','2000','2500','3000']
  
  
  },
  
};

 const [selectedProduct, setSelectedProduct] = useState<Product>("Business Card");
const productSizes: Record<string, { heightInches : number;  widthInches: number }[]> = {
  "Booklets": [
    { heightInches: 11, widthInches:8.5},
    { heightInches: 8.5, widthInches: 11 },
    { heightInches: 10, widthInches: 8 },
    { heightInches: 8, widthInches: 10 },
    { heightInches: 7, widthInches: 5 },
     { heightInches: 8, widthInches:5 }
  ],
  "Business Cards": [
    { heightInches: 2, widthInches: 3 },
    { heightInches: 3, widthInches: 3 },
    { heightInches: 1.5, widthInches: 1.5 }, 
    { heightInches: 3, widthInches: 2 },
     { heightInches: 1.5, widthInches: 3.5 },
      { heightInches: 3.5, widthInches: 2.5 },  
  ], 
  "Brochures": [
  { heightInches: 11, widthInches:8.5},
    { heightInches: 8.5, widthInches: 11 },
    { heightInches: 8, widthInches:10 },
    { heightInches: 8, widthInches: 5 },
    { heightInches: 10, widthInches: 8 }
  ],
  "Envelopes": [
    { heightInches: 8.27 ,widthInches: 11.69 },
    { heightInches:5.83, widthInches: 8.27 },
    { heightInches: 1.02, widthInches: 1.46 },
     { heightInches: 4.12, widthInches:9.5 },
      { heightInches: 3.88, widthInches: 8.875 }
  ],
  "Flyers": [
    { heightInches: 3, widthInches: 3 },
    { heightInches: 5, widthInches: 7 },
    { heightInches: 5, widthInches: 5 },
    { heightInches: 7, widthInches: 5 },
    { heightInches: 3, widthInches: 4 }
  ],
  "Invitations": [
    { heightInches: 3, widthInches: 3 },
    { heightInches: 5, widthInches:7 },
    { heightInches: 5, widthInches: 5 },
    { heightInches: 7, widthInches: 5 },
    { heightInches: 3, widthInches: 4 }
  ],
  "Invoices": [
    { heightInches: 8.5, widthInches: 11 },
    { heightInches: 11, widthInches: 8.5 },
    { heightInches: 10, widthInches: 9 },
    { heightInches: 5, widthInches:5 },
     { heightInches:5, widthInches:7} ,
  ],
  "Stickers": [
    { heightInches: 3, widthInches: 3 },
    { heightInches: 1.5, widthInches: 1.5 },
    { heightInches: 3, widthInches: 2 },
    { heightInches: 2, widthInches: 2 },
    { heightInches: 4, widthInches: 4 }
  ],
  "Letterheads": [
    { heightInches: 11, widthInches:8.5 },
      { heightInches: 8.5, widthInches:11 }
  ],
  "Menus": [
     { heightInches: 8.5, widthInches:11 },
     { heightInches: 11, widthInches:8.5 },
    { heightInches: 7, widthInches: 11 },
    { heightInches: 7, widthInches: 8.5 }, 
  ],
  "NCR": [
      { heightInches: 8.5, widthInches:11 },
     { heightInches: 11, widthInches:8.5 },
    { heightInches: 7, widthInches: 11 },
    { heightInches: 7, widthInches: 8.5 }, 
  ],
  "Postcards": [
    { heightInches:6, widthInches: 6 },
    { heightInches: 6, widthInches: 4 },
    { heightInches: 5, widthInches: 7 },
    { heightInches: 7, widthInches: 5 },
    { heightInches: 5, widthInches: 5 }
  ]
};
 

const editorRefFront = useRef<any>(null);
const editorRefBack = useRef<any>(null);


const frontHistory = useRef<any[]>([]); 
const frontIndex = useRef<number>(0);  
  useEffect(() => {
    const initEditors = async () => { 

      // New tool import
      
    const AlignmentTuneTool = (await import("editorjs-text-alignment-blocktune")).default;
  const EditorJS = (await import("@editorjs/editorjs")).default;
const TextColorPlugin = (await import("editorjs-text-color-plugin")).default;
const TextStyle = (await import("@skchawala/editorjs-text-style")).default;
const ColorPlugin = (await import("editorjs-color-picker")).default;    const commonTools = {
        paragraph: {
          class: (await import("@editorjs/paragraph")).default as any,
          inlineToolbar: ["Color", "Marker", "textStyle", "bold", "italic"],
          tunes: ["textAlignment"],
        },
    
        textAlignment: {
          class: AlignmentTuneTool,
          config: {
            default: "left",
            blocks: {
              header: "left",
              paragraph: "left",
            },
          },
        },
        textStyle: {
          class: TextStyle,
          config: {
            styles: {
              fontSize: ["12px", "16px", "20px", "24px", "32px"],
              fontFamily: ["Arial", "Georgia", "Times New Roman"],
            },
          },
        }, 
        Color: {
          class: ColorPicker,
          config: {
            defaultColor: "#FF0000", 
            colorCollections: ["#FF0000", "#00FF00", "#0000FF"],  
          },
        } as any,  
      Marker: {
          class: TextColorPlugin,
          config: {
            defaultColor: "#FFFF00", 
            color: ["#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF"],  
            type: "marker", 
          },
        } as any, // 
      };
 
      editorRefFront.current?.destroy();
      editorRefBack.current?.destroy();
 
      editorRefFront.current = new EditorJS({
        holder: "editorjs-front", 
        autofocus: true,
        data: frontEditorData ?? { blocks: [], version: "2.28.2" },
        tools: commonTools,
      
      });

      editorRefBack.current = new EditorJS({
        holder: "editorjs-back", 
        autofocus: false,
        data: backEditorData ?? { blocks: [], version: "2.28.2" },
        tools: commonTools,
     
        onChange: async () => {
          const data = await editorRefFront.current.save();
          frontHistory.current.push(data);
          frontIndex.current = frontHistory.current.length - 1;
        },
      });
    };

    initEditors();

    return () => {
      editorRefFront.current?.destroy();
      editorRefBack.current?.destroy();
    };
  }, []);

const getInitialSize = (): { heightInches: number; widthInches: number;  } => {
  // Check if we are in a browser environment
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    const savedOrder = localStorage.getItem("orderData");
    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder);
      const sizeLabel = parsedOrder.size;

      if (sizeLabel) {
        const [h,w] = sizeLabel.split("x").map(Number);
        if (!isNaN(h) && !isNaN(w)) {
          return {heightInches: h , widthInches: w};
        }
      }
    }
  }
  // Default size if no valid data found
  return { heightInches: 2, widthInches: 3};
};
const initialSize = getInitialSize();
const [size, setSize] = useState(getInitialSize);
  const router = useRouter();
 const [selectedSize, setSelectedSize] = useState(`${initialSize.widthInches}x${initialSize.heightInches}`);
  const [selectedPaper, setSelectedPaper] = useState('Select Paper');
  const [selectedQuantity, setSelectedQuantity] = useState('');
const [selectedColor, setSelectedColor] = useState<string>("Front and Back");  const [selectedCoating, setSelectedCoating] = useState<string | null>(null);
  const [selectedRCorner, setSelectedRCorner] = useState<string>("No Round Corner");
  const [selectedTurnaround, setSelectedTurnaround] = useState<string>("Same Day");
  const [isFrontOnly, setIsFrontOnly] = useState(false); 
  const [approvalType, setApprovalType] = useState<'electronic' | 'preapproved'>('electronic');
  const [orderName, setOrderName] = useState('');
    const [orderEmail, setOrderEmail] = useState(''); 
const [frontFile, setFrontFile] = useState<string | null>(null);
const [backFile, setBackFile] = useState<string | null>(null);
const [isSmallScreen, setIsSmallScreen] = useState(false);
const [customSizeText, setCustomSizeText] = useState(''); 
const [frontEditorData, setFrontEditorData] = useState<OutputData | null>(null);
const [backEditorData, setBackEditorData] = useState<OutputData | null>(null);
  const [orderData, setOrderState] = useState<Record<string, any>>({
  size: selectedSize,
    paper: selectedPaper,
    quantity: selectedQuantity,
    color: selectedColor,
    coating: selectedCoating,
    rCorner: selectedRCorner,
    turnaround: selectedTurnaround,
    orderName, 
    orderEmail,  productName:selectedProduct,
    approvalType, 
    frontFile,
    backFile,
     frontEditorData: null,
  backEditorData: null,
    customSize: selectedSize === 'Custom' ? customSizeText : null,
  });
 

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1054);  
    };

    window.addEventListener('resize', handleResize);
    handleResize();  

    return () => window.removeEventListener('resize', handleResize);
  }, []);


const pixelRatio = window.devicePixelRatio || 1;
const widthPx = (size?.widthInches ?? 5) * 96 * pixelRatio;
const heightPx = (size?.heightInches ?? 5) * 96 * pixelRatio;
const [activeTab, setActiveTab] = useState<"front" | "back">("front");

const activeEditorData = activeTab === "front" ? frontEditorData : backEditorData; 
const handleSizeChange = (
  width?: number,
  height?: number,
  sizeLabel?: string,
  product?: string,
  isSelected?: boolean
) => {
  if (sizeLabel && product) {
    const sizes = productSizes[product];
    const matchedSize = sizes?.find(
      (s) =>
        `${s.heightInches}x${s.widthInches}` === sizeLabel ||
        `${s.widthInches}x${s.heightInches}` === sizeLabel
    );

    if (matchedSize) {
      setSize(matchedSize);
      setSelectedSize(
        `${matchedSize.heightInches}x${matchedSize.widthInches}`
      );
      return;
    }
  }

  if (height && width) {
    setSize({ heightInches: height, widthInches: width });
    setSelectedSize(`${height}x${width}`);
  }
};
useEffect(() => {
  if (size?.heightInches && size?.widthInches) {
    setSelectedSize(`${size.heightInches }x${size.widthInches}`);
  }
}, []);
  const switchTab = async (tab: "front" | "back") => {
  if (editorRef.current) {
    const outputData = await editorRef.current.save();
    if (activeTab === "front") {
      setFrontEditorData(outputData);
    } else {
      setBackEditorData(outputData);
    }
  }
  setActiveTab(tab);
};


useEffect(() => {
  setBackgroundImage(activeTab === "front" ? frontFile : backFile);
}, [activeTab, frontFile, backFile]);

const exportEditorAsImage = async (tab: "front" | "back"): Promise<string | null> => {
  const containerId = tab === "front" ? "editor-safe-zone-front" : "editor-safe-zone-back";
  
  const container = document.getElementById(containerId);
  if (!container) return null;

  await new Promise((resolve) => setTimeout(resolve, 100));

  const canvas = await html2canvas(container, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
  });

  const imageData = canvas.toDataURL("image/png");

  if (tab === "front") {
    setFrontFile(imageData);
    setOrderState((prev) => ({ ...prev, frontFile: imageData }));
  } else {
    setBackFile(imageData);
    setOrderState((prev) => ({ ...prev, backFile: imageData }));
  }

  return imageData;
};

const handleSave = async () => {
  let frontImageData: string | null = null;
  let backImageData: string | null = null;

  if (editorRefFront.current) {
    const frontData = await editorRefFront.current.save();
    setFrontEditorData(frontData);
    setActiveTab("front");
    await new Promise((r) => setTimeout(r, 100));
    frontImageData = await exportEditorAsImage("front");
  }

  if (editorRefBack.current) {
    const backData = await editorRefBack.current.save();
    setBackEditorData(backData);
    setActiveTab("back");
    await new Promise((r) => setTimeout(r, 100));
    backImageData = await exportEditorAsImage("back");
  }

  const finalOrder = {
    ...orderData,
    frontFile: frontImageData,
    backFile: backImageData,
    frontEditorData,
    backEditorData,
  };

  localStorage.setItem("orderData", JSON.stringify(finalOrder));
  console.log("Saved from editor:", finalOrder);

  if (frontImageData) {
    const link = document.createElement("a");
    link.href = frontImageData;
    link.download = "front-design.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (backImageData) {
    const link = document.createElement("a");
    link.href = backImageData;
    link.download = "back-design.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
 
const handleCheckout = async(e: React.FormEvent) => {
  e.preventDefault();
   let frontImageData: string | null = null;
  let backImageData: string | null = null;

  if (editorRefFront.current) {
    const frontData = await editorRefFront.current.save();
    setFrontEditorData(frontData);
    setActiveTab("front");
    await new Promise((r) => setTimeout(r, 100));
    frontImageData = await exportEditorAsImage("front");
  }

  if (editorRefBack.current) {
    const backData = await editorRefBack.current.save();
    setBackEditorData(backData);
    setActiveTab("back");
    await new Promise((r) => setTimeout(r, 100));
    backImageData = await exportEditorAsImage("back");
  }

  const finalOrder = {
    ...orderData,
    frontFile: frontImageData,
    backFile: backImageData,
    frontEditorData,
    backEditorData, 
    product:selectedProduct,
    size: selectedSize,
    paper: selectedPaper,
    quantity: selectedQuantity,
    color: selectedColor,
    coating: selectedCoating,
    rCorner: selectedRCorner,
    turnaround: selectedTurnaround,
    orderEmail,   
    productName,  
    orderName,  
    approvalType,  
  };

  localStorage.setItem("orderData", JSON.stringify(finalOrder));
  console.log("Saved from editor:", finalOrder);

  router.push('../Orders/Checkout'); // Redirect to checkout page
 
    toast.success("Loading checkout..please wait", {
  position: "bottom-left",
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark", 
});
 

};  


 //console.log("Current orderData on checkout:", orderData);



  return ( 
  
  <div className="errThingInbetweenEditor"  > 

   <div className="OrderBuilderTitle1" 
 content="Build your Business Card">Customize Your Order
</div>


  <div className="editor-panel"> 



         <div className="EditorHeader"> 
          <div className="form-groupWrap">
              <div className="form-group">
                    <div>Order Name</div>
                  <input
                    type="text"
                    id="name"className="form-name"
                    value={orderName}
                    onChange={(e) => setOrderName(e.target.value)}
                    placeholder="Enter your order name"
                  />

                  
                </div>
 
                <div className="form-group">
                  <div  >Order Email</div>
                  <input
                    type="text"
                    id="orderEmail"className="form-email"
                    value={orderEmail}
                    onChange={(e) => setOrderEmail(e.target.value)}
                    placeholder="Example@outlook.com"
                  />

                  
                </div>

                 <button
      
     className="deleteLayout" 
      onClick={() => {
  if (activeTab === "front") {
    setFrontFile(null);
    setBackgroundImage(null); 
    setOrderState((prev) => ({ ...prev, frontFile: null }));
  } else {
    setBackFile(null);
    setBackgroundImage(null);  
    setOrderState((prev) => ({ ...prev, backFile: null }));
  }
}}>&#x1F5D1; </button>


<div className="background-controls">
  <label htmlFor="background-upload" className="upload-button">
    📁 Choose Background
  </label>
  <input
    id="background-upload"
    type="file"
    accept=".png, .jpg, .jpeg, .psd, .ai, .eps, .tif"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          if (activeTab === "front") {
            setFrontFile(base64);
            setBackgroundImage(base64);
            setOrderState((prev) => ({ ...prev, frontFile: base64 }));
          } else {
            setBackFile(base64);
            setBackgroundImage(base64);
            setOrderState((prev) => ({ ...prev, backFile: base64 }));
          }
        };
        reader.readAsDataURL(file);
      }
    }}
    style={{ display: "none" }}
  />
</div>

       <button className="save-button" onClick={handleSave}>download</button>
  <button className="save-button" onClick={handleCheckout}>Checkout</button>
  </div>

     


     </div>

     <div className="wrap-edCont"> 
  <div className="Left-SidePanel">
    <div className="product-selector">

        
                      <div className="approval-group">
                  <label >Approval Type</label>
                <div>
                      <div className="approvalTBttn">
      <button
        type="button"
        className={`approval-button ${approvalType === 'electronic' ? 'active' : ''}`}
        onClick={() => setApprovalType('electronic')}
      >
       Sample before print
      </button>
      <button
        type="button"
        className={`approval-button ${approvalType === 'preapproved' ? 'active' : ''}`}
        onClick={() => setApprovalType('preapproved')}
      >
        Pre-Approve Print
      </button>
  </div>
      {approvalType === 'electronic' && (
        <p style={{ color: '#FF9800', fontWeight: 'normal', fontSize: '14px' }}>
          ⚠️ <strong>Important:</strong> By selecting "Sample before print", you're agreeing to receive an physical sample of your design before printing. Please note that your approval is required before printing, which will lead to a slightly longer turnaround times.
        </p>
      )}

      {approvalType === 'preapproved' && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          ⚠️ <strong>Warning:</strong> By selecting "Pre-Approve Print", you are confirming that the design is ready to print without further review for errors. Please double-check your file to avoid any issues.
        </p>
      )}
    </div>
                </div>


                
 <div className="WrapForCols">
              
 <div  
  >Select Product:</div>
  <select   style={{
   background: "#ffffff",
 borderRadius: "5px",
  border: " solid 1px #004f68",
  color:"#000000ff",
      }}
  id="dropdownQuantity"  
  value={selectedProduct}
  onChange={(e) => setSelectedProduct(e.target.value as keyof ProductOptions)}  
>
  {Object.keys(productSizes).map((product) => (
    <option key={product} value={product}>
      {product}
    </option>
  ))}
</select>
       
            
              <div className="optionsPaperTitle">Select Color</div>
              <select style={{
   background: "#ffffff",
 borderRadius: "5px",
  border: " solid 1px #004f68",
  color:"#000000ff",
      }}
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="colorDropdown"
              >
                <option value="Front Only">Front Only</option>
                <option value="Front and Back">Front and Back</option>
              </select>
         
 
             
             
              <div className="optionsRCDescriptions">Select Round Corner</div>
              <select style={{
   background: "#ffffff",
 borderRadius: "5px",
  border: " solid 1px #004f68",
  color:"#000000ff",
      }}
                value={selectedRCorner}
                onChange={(e) => setSelectedRCorner(e.target.value)}
                className="rCornerDropdown"
              >
                <option value="1/8th Round Corner">1/8th Round Corner</option>
                <option value="1/3th Round Corner">1/3th Round Corner</option>
                <option value="No Round Corner">No Round Corner</option>
              </select>
           

            
              <div className="optionsPaperTitle">Select Printing Turnaround</div>
              <select style={{
   background: "#ffffff",
 borderRadius: "5px",
  border: " solid 1px #004f68",
  color:"#000000ff",
      }}
                value={selectedTurnaround}
                onChange={(e) => setSelectedTurnaround(e.target.value)}
                className="turnaroundDropdown"
              >
                <option value="Same Day">Same Day</option>
                <option value="Next Business Day">Next Business Day</option>
                <option value="2-4 Business Days">2-4 Business Days</option>
                <option value="5-7 Business Days">5-7 Business Days</option>
              </select>
          
       
</div> 
           
              <div className="paperQuantityWrap">
                 <div className="optionsPaperTitle">Quantity</div>
                <div className="optionsPaperTitle">Choose a type of Paper</div>
               
              </div>
  <div className="paperQuantityWrap">
      <select
      style={{
        background: "#ffffff",
        borderRadius: "5px",
        border: "solid 1px #004f68",
        color: "#000000ff",
      }}
      id="quantity"
      value={selectedQuantity}
      onChange={(e) => setSelectedQuantity(e.target.value)}  
    >
      {productOptions[selectedProduct]?.quantityOptions?.map((quantity, index) => (
        <option key={index} value={quantity}>
          {quantity}
        </option>
      ))}
    </select>
 
          
   <div 
className="dropdown">  
<select style={{
   background: "#ffffff",
 borderRadius: "5px",
  border: " solid 1px #004f68",
  color:"#000000ff",
      }}

    id="paper"
    value={ selectedPaper}
    onChange={(e) => setSelectedPaper(e.target.value as keyof ProductOptions)} 
  >
    {productOptions[selectedProduct]?.paperOptions?.map((paper, index) => (
      <option key={index} value={paper}>
        {paper}
      </option>
    ))}
  </select></div>
   
    </div>

 <div className="optionsPaperTitle">Choose a card size</div>

<div className="size-buttons">
  
 
{productSizes[selectedProduct]?.map((sizeOption, index) => {
  const sizeLabel = `${sizeOption.heightInches }x${sizeOption.widthInches}`;
  const isSelected = selectedSize === sizeLabel;
  return (
    <button key={index}
    onClick={() => {
          handleSizeChange(   sizeOption.widthInches,
            sizeOption.heightInches,);
      
        }} 
    className={isSelected ? "selected-size-button" : "size-button"}>
      {sizeLabel ||  selectedSize} "
    </button>
  );
})}


</div>
 </div>
 

  
 </div>
 
  <div className="Right-SidePanel">
   <div >

  <div className="ruler-horizontal" />
  <div className="ruler-vertical" /></div>

       <div
  id="editor-container"
  className="editor-container"
  style={{        height: `${isSmallScreen ? heightPx / 2 : heightPx}px`,
     width: `${isSmallScreen ? widthPx / 2 : widthPx}px`, position: "relative",
   borderRadius: `${selectedRCorner !== "No Round Corner" ? "3%" : "0px"}`,}}
>
 

  <div
  id="editor-safe-zone-front"
  className="editor-safe-zone"
  style={{
    position: "relative",    
    display: activeTab === "front" ? "block" : "none",
    overflow: "visible",
  }}
>

  
  {frontFile && (
    <img
      src={frontFile}
      alt="Front Background"
      style={{
        position: "relative",
        top: 0,

        left: 0,
        width: "100%",
        height: "100%", 
          zIndex: 0,
      }}
    />
  )}
  <div
    id="editorjs-front"
    style={{
      position: "relative", 
      padding: "10px", 
    }}
  />
</div>

<div
  id="editor-safe-zone-back"
  className="editor-safe-zone"
  style={{
    position: "relative",
     
    display: activeTab === "back" ? "block" : "none",
    overflow: "visible",
  }}
>
  {backFile && (
    <img
      src={backFile}
      alt="Back Background"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  )}
  <div
    id="editorjs-back"
    style={{
      position: "relative", 
      padding: "10px", 
    }}
  />
</div>

  <div className="editor-bleed-line" />
</div>
 
 


 
 <div className="tab-thumbnails">
  <div
    className={`thumbnail ${activeTab === "front" ? "active" : ""}`}
    onClick={() => switchTab("front")}
  >
    <img src={frontFile || "/plcHldr.png"} alt="Front Design" />
    <span>Front Design</span>
  </div>

  <div 
    className={`thumbnail ${activeTab === "back" ? "active" : ""}`}
    onClick={() => switchTab("back")}
    style={{ opacity:  selectedColor !== "Front and Back" ? 0.5 : 1, pointerEvents: orderData.color !== "Front and Back" ? "none" : "auto" }}
  >
    <img src={backFile || "/plcHldr.png"} alt="Back Design" />
    <span>Back Design</span>
  </div>
</div>

 </div> 
</div>

 
</div>
   
  <style jsx>{`
.Img, .backImg{
 
width: 100%;
 top: 0px;
   display: flex; 
  justify-content: center;   
  
  align-items: center;

}
   
.form-group{ 
     width:auto;
     height:100%;
     display:flex;    padding:10px;  
     flex-direction:row;
 } .form-email, .form-name{  
     width:100%;border: 2px solid rgba(255, 0, 0, 1); 
     height:100%;
     display:flex;    padding:10px;  
     flex-direction:row;
 }
    
  .form-groupWrap{
   display: flex;
   padding:0px;  
  justify-content: row;   
  width: 100%;  height: 100%;   
     gap:20px;
  align-items: center;
margin-top:0px; 
  }
  .WrapForCols{
   display:table;   width: 100%; 
  flex-direction:grid;   
  align-items: center; 
  gap:20px;
  padding:5px;
  }
 


.EditorHeader{  
  color: rgb(25, 25, 25);
  width: 100%;
  top: 0%;
  display: flex; 
  align-items: center;  
  height: 60px;  
}
.Left-SidePanel{ 
  width:40%;
  height:auto;
    display:flex; 
    gap:15px;     
    padding:10px;
  flex-direction:column; 
       position: relative; 
  align-items: center; 
  
  z-index: 99;
  overflow:scroll;
  }
  .deleteLayout{
  color: black;  
  font-size:25px;
  } 
  .wrap-edCont{ 
    width:100%;   
    display:flex;  
  height:100%; 
  }
  .wrap-ed{   
    display:flex; 
  width:100%;  
  margin-top:0px;
  height:100%; 
  flex-direction:row;  
  align-items: center;
  padding-bottom:15px;
  }
  .Right-SidePanel{
 
   background-image: linear-gradient(180deg, rgba(155, 155, 155, 0.87), rgba(122, 122, 122, 1));
  width:100%;
  height:auto;
    display:flex; 
    gap:15px;     
    padding:10px;
  flex-direction:column; 
       position: relative; 
  align-items: center;  
  z-index:99;
  overflow:scroll;
  }
  .tab-buttons {
  display: flex;
  gap: 10px;
   flex-wrap: wrap;
  margin-bottom: 20px;  
}
 
.tab-buttons button {
  padding: 10px 20px;
  border: none;
  background: #444;
  color: white; flex-wrap: wrap;
  border-radius: 6px;
  cursor: pointer;
}

.tab-buttons button.active {
  background-color: rgba(0, 123, 255, 0.8);  
  border-color: rgba(0, 123, 255, 1);
}

.tab-buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
  .optionsPaperTitle{
   
  }
 .product-selector {
  display: flex;
  height:100%;
    flex-direction:column; 
  align-items: center;    
  gap: 20px;
  padding:10px;
  margin-bottom: 10px;
}

.product-selector label {
  color: #000000ff;
  font-weight: bold;
}
.selected-size-button {
  background-color: rgba(0, 123, 255, 0.8);  
  border-color: rgba(0, 123, 255, 1);
}
.product-selector select {
  padding: 8px;
  border-radius: 6px;
  background: #444;
  color: #fff;
  border: none;
}
 
    .editor-panel {
    display:flex;  
      flex-direction: column;  
      padding:10px; 
      background: #ffffffff;  
      border-radius: 12px; 
 border : solid 1px #c0c0c079;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
     width: auto;  
     height:100vh;    
     z-index:99;
     overflow:scroll;
    }

    h2 {
      font-size: 1.5rem;
      color: #ffffff;
    }

    .size-buttons {
      display: flex;
      gap: 10px; 
      padding:10px;
      margin-top:0%;
      flex-wrap: wrap;
    flex-direction:row;
    }

    .size-buttons button {
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      background: #444;
      color: #fff;
      cursor: pointer;
      transition: background 0.2s ease;
    }
.size-buttons button.selected-size-button {
  background-color: rgba(0, 123, 255, 0.8) !important;
  border: 2px solid rgba(0, 123, 255, 1) !important;
  color: white !important;
}
    .size-buttons button:hover {
      background: #666;
    }

    .background-controls {
      display: flex;
      gap: 10px;
            color: #000000ff;
      align-items: center;  
    }
 .background-controls:hover  { 
      color: #fff;
         background: #666;
          cursor: pointer;
    }
    .background-controls input {
      color: #fff;
    }

    .background-controls button {
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
    background: #444;
      color: #fff;
      cursor: pointer;
    }

    .editor-container { 
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center; 
  width: 100%; 
  height: 100%;    
  overflow: hidden;   
  background-color: #fff;
    }
.editor-container img { 
  width: 100%;     
  height: 100%;    
  display: flex;
  z-index: 0;  
}

 
    .editor-safe-zone { 
   position: absolute;
  display: flex;  
  width: 100%;
  height: 100%; 
  overflow: hidden;   
   left: 0%;
  margin-top:0%; 
       
    }

    .editor-bleed-line {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 2%;
      box-sizing: border-box;
      border: 2px dashed red;
      pointer-events: none;
      z-index: 3;
    }

    .save-button {
      align-self: flex-end;
      padding: 10px 20px;
      background: #0078d4;
      color: white;
      border: none; 
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s ease;
    }
.ruler-horizontal {
  position: absolute;
  top: 0%;
  left: 20px;
  right: 0;
  height: 20px;
  background: repeating-linear-gradient(to right, #ffffffff 0px, #ffffffff 1px, transparent 1px, transparent 10px);
  z-index: 5;
}

.ruler-vertical {
  position: absolute;
  top: 20px;
  left: 0;
  bottom: 0;
  width: 20px;
  background: repeating-linear-gradient(to bottom, #ffffffff 0px, #ffffffff 1px, transparent 1px, transparent 10px);
  z-index: 5;
}
  .tab-thumbnails {
  display: flex;
  gap: 20px;
  margin-top: 5%;
    flex-direction:row;
   justify-content: center;  
  align-items: center;
  
  width:100%;
}

.thumbnail {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 3px;
  transition: border 0.2s ease;
}

.thumbnail img {
  width: 100%;
  height: 60px;
  object-fit: contain;
  border-radius: 4px;
  background-color: #222;
}

.thumbnail.active {
  border-color: #061b53ff;
}

.thumbnail span {
  margin-top: 6px;
  color: white;
  font-size: 0.9rem;
}
    .save-button:hover {
      background: #061b53ff;
    }












    
 
  @media screen and (max-width: 1054px) {
 
  .form-groupWrap{
    
  display: grid;
grid-template-columns: repeat(2, 2fr);   
  }
      .editor-panel { 
      display:flex;
         width: 100%; 
     height:auto;  
     border-radius:0px;  
 max-height:100vh;
      box-shadow: 0 0px 0px rgba(0, 0, 0, 0.3);
  overflow-y:scroll;  
  
    }
 .wrap-edCont{    
 display:flex; 
 height:100%;
 width:100%;  
    position:relative;
      flex-direction: column;     
  }
 .Left-SidePanel{ 
  width:100%;  
  flex-direction:column;  
  padding:10px; height:auto;
 
  }

      .editor-container {   
  width: 100%;
  max-width: 90vw;
  height: 100%;  
  left: 0px;
    }

 
  .Right-SidePanel{
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  width:100%; 
  display:flex;  overflow-y:scroll;
   justify-content: center;  
  align-items: center;

  }
        .EditorHeader{   
  width: 100%; 
  padding: 9px;  
  height: auto; 
  flex-direction: column; 
}  
   .save-button {
   font-size:.6rem;
    }
 
 
  }

  `}</style>
      

<ToastContainer    style={{ zIndex:250}}  >
               </ToastContainer> 
</div>   
  );
};

export default Editor;

function setSize(arg0: { widthInches: number; heightInches: number; }) {
    throw new Error("Function not implemented.");
}
