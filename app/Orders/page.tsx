//fixed mobile mode 

/************** What to do next **************/


//build has an error. Fix it.



"use client";
import React, { useState, useEffect, useRef } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";  
import "../app.css";   
import { useRouter, usePathname, useSearchParams  } from 'next/navigation' 
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';    
import 'swiper/swiper-bundle.css'; 
import '@splidejs/splide/dist/css/splide.min.css'; 
import { usePricing } from '../PricingContext'; 
Amplify.configure(outputs); 
 
 interface ProductOptions {
  paperOptions: string[];
  sizeOptions: string[];
  quantityOptions: string[];
  productName: string;
}

interface Props {
  userResponse: string;
  botResponse: {
    purpose: string;
    message: string;
    options?: string[];
    sender: string;
  };
  sendUserResponse: string;
  optionClick: (ev: React.MouseEvent<HTMLElement>) => void;
}

interface MessagesInfo {
  purpose?: string;
  message: string;
  options?: string[];
  sender: string;
}
interface ProductLayoutProps {
  productName: string;
  paperOptions: string[];
  sizeOptions: string[];
  quantityOptions: string[];
  onSubmit: (orderData: any) => void;  
}

const ProductLayout: React.FC<ProductLayoutProps> = ({
 
  paperOptions, 
  quantityOptions,
  onSubmit,
}) => {

  //initialize err thing here 
const searchParams = useSearchParams();
   
  const productName = searchParams.get('page');


  // console.log(productName); 
  // Selected options for each section
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedProduct, setProduct] = useState<string | null>(null);
  const [selectedPaper, setSelectedPaper] = useState('Select Paper');
  const [selectedQuantity, setSelectedQuantity] = useState('500');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedCoating, setSelectedCoating] = useState<string | null>(null);
  const [selectedRCorner, setSelectedRCorner] = useState<string | null>(null);
  const [selectedTurnaround, setSelectedTurnaround] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
const dropdownRefPaper = useRef<HTMLDivElement>(null);
  const buttonRefPaper = useRef<HTMLButtonElement>(null);
  const dropdownRefQuant= useRef<HTMLDivElement>(null);
  const buttonRefQuant = useRef<HTMLButtonElement>(null);
 const [orderData, setOrderData] = useState<any>(null); 
  const [isFrontOnly, setIsFrontOnly] = useState(false);
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [approvalType, setApprovalType] = useState<'electronic' | 'preapproved'>('electronic');
  const [orderName, setOrderName] = useState('');
    const [orderEmail, setOrderEmail] = useState('');
const [frontFile, setFrontFile] = useState<string | null>(null);
const [backFile, setBackFile] = useState<string | null>(null);
const [isSmallScreen, setIsSmallScreen] = useState(false);
const [customSizeText, setCustomSizeText] = useState(''); 
 const [subtotal, setSubtotal] = useState<number>(0);  
   const { pricing, calculateSubtotal } = usePricing();
 


const handleItemClick = (product: string) => {
 
  toast.loading("Loading..please wait", {
    position: "bottom-left",
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    theme: "dark",
    style: {
      zIndex: 9999,
    },
  });
 
  router.push(`/Orders?page=${product}`);
};

  const handleMouseLeave = (setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) => (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsOpen(false);
  };

const convertInchesToPixels = (size: string): { height: number ;width: number} => {
  const [lengthInches, widthInches] = size
    .split("x")
    .map((value) => parseFloat(value.trim()));

  return {
    height: lengthInches * 40 ,
    width: widthInches * 40
  };
};
 
const getUploadContainerStyle = (side: 'front' | 'back'): React.CSSProperties => {
  let sizeString = "";

  // Determine the size string
  if (selectedSize === "Custom" && customSizeText.includes("x")) {
    sizeString = customSizeText;
  } else if (selectedSize && selectedSize.includes("x")) {
    sizeString = selectedSize;
  }

  const { height, width } = convertInchesToPixels(sizeString);

  const backgroundImageUrl = side === 'front' ? frontFile : backFile;

  // Conditionally apply rounded corners
  const shouldHaveRoundedCorners =
    selectedRCorner === "1/8th Round Corner" || selectedRCorner === "1/3th Round Corner";

  return {
    width: `${width}px`,
    height: `${height}px`,
    border: "1px dashed #ccc",
    borderRadius: shouldHaveRoundedCorners ? "12px" : "0px",  
    backgroundColor: "#fafafa",
    backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "20px",
  };
};
const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
  const file = event.target.files?.[0];
  if (file) {
    const previewUrl = URL.createObjectURL(file); // Generate URL for preview
    if (side === 'front') {
      setFrontFile(previewUrl);
    } else {
      setBackFile(previewUrl);
    }
  }
};
  const [isDesignContainerVisible, setDesignContainerVisible] = useState(false);


  const handleProceedToDesign = () => {
    if (isSelectionMissing()) {
      toast.error("One or more required options have not been selected.", {
        position: "bottom-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark", 
         style: {
    zIndex: 9999,   
  },
      });
      setDesignContainerVisible(false);
    } else {
      setDesignContainerVisible(true);
    }
  };
  
 
  const handleCloseDesignContainer = (e: React.FormEvent) => {
    setDesignContainerVisible(false);  
 
    
  };

  const tabRequirements = {
    'Size & Paper': [selectedSize, selectedPaper, selectedQuantity],
    'Color & Coating': [selectedColor, selectedCoating],
    'Round Corner': [selectedRCorner],
    'Quantity': [selectedQuantity],
    'Printing Turnaround': [selectedTurnaround],
  };

  // Type for tabName to restrict it to valid keys of tabRequirements
  type TabName = keyof typeof tabRequirements;
  const isTabIncomplete = (tabName: TabName): boolean => {
    const requiredSelections = tabRequirements[tabName];
    if (!requiredSelections) {
      console.error(`No required selections for tab: ${tabName}`);
      return false; // Or return true if you want to assume it’s incomplete
    }
    return requiredSelections.some((selection) => !selection);
  };
const isSelectionMissing = () => {
  return !selectedTurnaround || 
         !selectedRCorner ||   
         !selectedSize || 
         !selectedPaper || 
         !selectedQuantity;
};
  // Handle form submit
 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
    if (!orderName || !frontFile) {
       toast.error("Please provide the required details (Name and Front file).", {
  position: "bottom-left",
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark", 
}); 
      return;
    }
    else {
    toast.success("Loading checkout..please wait", {
  position: "bottom-left",
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark", 
});
  const orderSelections = { 
    size: selectedSize,
    paper: selectedPaper,
    quantity: selectedQuantity,
    color: selectedColor,
    coating: selectedCoating,
    rCorner: selectedRCorner,
    turnaround: selectedTurnaround,
    orderName,
    orderEmail,
    productName ,
    approvalType, 
    frontFile,
    backFile,
    customSize: selectedSize === 'Custom' ? customSizeText : null,
  };

  localStorage.setItem('orderData', JSON.stringify(orderSelections)); // Save to localStorage
  router.push('../Orders/Checkout'); // Redirect to checkout page
}
};
 


 
const handleCreateDesign = (e: React.FormEvent) => {
  e.preventDefault();
    if (!orderName) {
       toast.error("Please provide the required details (Name and Approval Type).", {
  position: "bottom-left",
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark", 
}); 
      return;
    }
    else {
    toast.success("Loading checkout..please wait", {
  position: "bottom-left",
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark", 
});
  const orderSelections = { 
    size: selectedSize,
    paper: selectedPaper,
    quantity: selectedQuantity,
    color: selectedColor,
    coating: selectedCoating,
    rCorner: selectedRCorner,
    turnaround: selectedTurnaround,
    orderName,
    productName ,
    orderEmail, 
    approvalType, 
    frontFile,
    backFile,
    customSize: selectedSize === 'Custom' ? customSizeText : null,
  };

  localStorage.setItem('orderData', JSON.stringify(orderSelections)); // Save to localStorage
  router.push('../Orders/Canvas-Editor'); // Redirect to checkout page
}
};
 
 


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

 
  const optionClass = (selectedValue: string | null, currentValue: string) =>
    selectedValue === currentValue ? 'option selected' : 'option';

  const optionColorClass = (selectedValue: string | null, currentValue: string) =>
    selectedValue === currentValue ? 'optionColor selected' : 'optionColor';

  
  const optionRCornerClass = (selectedValue: string | null, currentValue: string) =>
    selectedValue === currentValue ? 'optionRCorner selected' : 'optionRCorner'; 

  const optionTurnaroundClass = (selectedValue: string | null, currentValue: string) =>
    selectedValue === currentValue ? 'optionTurnaround selected' : 'optionTurnaround'; 

 
  const router = useRouter()
 

//this is for the dropdown paper menu
  const [isOpen, setIsOpen] = useState(false);
 
 
  const [activeTab, setActiveTab] = useState('Size & Paper');  
 
  
  //choose a card effect
       useEffect(() => {
    const options = document.querySelectorAll('.option');
      document.querySelectorAll('.option').forEach(function(option) {
  option.addEventListener('click', function() {
  
    document.querySelectorAll('.option').forEach(function(option) {
      option.classList.remove('selected');
    });
    option.classList.add('selected');
  });
});
 
  
  }, []); 

   //choose a paper effect
 
   useEffect(() => {
   

  if (isOpen) {
    const options = document.querySelectorAll('.optionPaper');
    
    options.forEach(option => {
      option.addEventListener('click', function() {
        option.classList.add('selected'); 
       
      });
    });
 
    return () => {
      options.forEach(option => {
        option.removeEventListener('click', () => {});
      });
    };
  }
}, [isOpen]);
       

      //choose a color effect
       useEffect(() => {
    const options = document.querySelectorAll('.optionColor');
      document.querySelectorAll('.optionColor').forEach(function(option) {
  option.addEventListener('click', function() {
  
    document.querySelectorAll('.optionColor').forEach(function(option) {
      option.classList.remove('selected');
    });
    option.classList.add('selected');
  });
});
 
  
  }, []); 


      //choose a coating effect
       useEffect(() => {
    const options = document.querySelectorAll('.optionCoating');
      document.querySelectorAll('.optionCoating').forEach(function(option) {
  option.addEventListener('click', function() {
  
    document.querySelectorAll('.optionCoating').forEach(function(option) {
      option.classList.remove('selected');
    });
    option.classList.add('selected');
  });
});
 
  
  }, []); 

  //choose a Round corner effect
       useEffect(() => {
    const options = document.querySelectorAll('.optionRCorner');
      document.querySelectorAll('.optionRCorner').forEach(function(option) {
  option.addEventListener('click', function() {
  
    document.querySelectorAll('.optionRCorner').forEach(function(option) {
      option.classList.remove('selected');
    });
    option.classList.add('selected');
  });
});
 
  
  }, []); 

    //choose a Turnaround effect
       useEffect(() => {
    const options = document.querySelectorAll('.optionTurnaround');
      document.querySelectorAll('.optionTurnaround').forEach(function(option) {
  option.addEventListener('click', function() {
  
    document.querySelectorAll('.optionTurnaround').forEach(function(option) {
      option.classList.remove('selected');
    });
    option.classList.add('selected');
  });
});
 
  
  }, []); 

 


//closing dropdown menus 
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => { 
    const isClickOutsidePaper =
      dropdownRefPaper.current && !dropdownRefPaper.current.contains(event.target as Node) &&
      !buttonRefPaper.current?.contains(event.target as Node);
      
    const isClickOutsideQuantity =
      dropdownRefQuant.current && !dropdownRefQuant.current.contains(event.target as Node) &&
      !buttonRefQuant.current?.contains(event.target as Node);
 
    if (isClickOutsidePaper) {
      setIsPaperOpen(false);
    }
 
    if (isClickOutsideQuantity) {
      setIsQuantityOpen(false);
    }
  };
 
  document.addEventListener("mousedown", handleClickOutside);

 
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [setIsPaperOpen, setIsQuantityOpen]);

const dynamicOrderData = {
  size: selectedSize,
  customSize: selectedSize === 'Custom' ? customSizeText : null,
  paper: selectedPaper,
  quantity: Number(selectedQuantity),
  color: selectedColor,
  coating: selectedCoating,
  rCorner: selectedRCorner,
  turnaround: selectedTurnaround,
  orderName,
  orderEmail,
  orientation,
  productName,
  approvalType,
  frontFile,
  backFile
};


useEffect(() => {
  if (selectedSize && selectedPaper && selectedQuantity) {
    const newSubtotal = calculateSubtotal(dynamicOrderData);
    setSubtotal(newSubtotal);
  } else {
    setSubtotal(0);
  }
}, [
  selectedSize,
  customSizeText,
  selectedPaper,
  selectedQuantity,
  selectedColor,
  selectedCoating,
  selectedRCorner,
  selectedTurnaround,
  frontFile,
  backFile,
  productName,
  orderName,
  orderEmail,
  calculateSubtotal
]);
 
  

 
//getting product name, qpaper and sizes 

const productOptions: { [key: string]: ProductOptions } = {
    'Booklets': {
      productName:"Booklets",
    paperOptions: ["100 lbs Glossy Paper",
  "120 lbs Matte Paper",
  "110 lbs Royal Sundance Paper",
  "100 lbs Silk Paper",
  "100 lbs Textured Paper",
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond Paper"],
    sizeOptions: [ 'Custom','8.5 x 11', '7 x 5','8 x 10','8 x 5','10 x 8'],
    quantityOptions: ['50', '100', '250', '500', '1000', '1500', '2000', '2500', '3000'],
  },
    'Brochures': {
       productName:"Brochures",
    paperOptions:["100 lbs Glossy Paper",
  "120 lbs Matte Paper",
  "110 lbs Royal Sundance Paper",
  "100 lbs Silk Paper",
  "100 lbs Textured Paper",
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond Paper"],
    sizeOptions: [ 'Custom','8.5 x 11', '7 x 5','8 x 10','8 x 5','10 x 8'],
    quantityOptions: ['50', '100', '250', '500', '1000', '1500', '2000', '2500', '3000'],
  },
  'Business Cards': {
     productName:"Business Cards",
    paperOptions: ['14pt Cover Semi Gloss', '14pt Matte Paper', '16pt Semi Gloss Paper','16pt Matte Paper'],
    sizeOptions: [ 'Custom','2 x 3', '3 x 3','1.5 x 1.5','1.5 x 3.5','3.5 x 2.5'],
    quantityOptions: ['50', '100', '250', '500', '1000', '1500', '2000', '2500', '3000'],
  },
    'Envelopes': {
       productName:"Envelopes",
    paperOptions: [
        "24lb Standard white matte", "32lb Premium White", "24lb Pastel Green"
      ],
    sizeOptions: [ 'Custom','A4', 'A5','A10','#10','#9'],
    quantityOptions: ['50', '100', '250', '500', '1000', '1500', '2000', '2500', '3000'],
  },
  'Flyers': {
     productName:"Flyers",
    paperOptions: [
      "100 lbs Semi Gloss",
  "120 lbs Matte Paper", 
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "120 lbs Standard Bond Paper"
      ],
    sizeOptions: [ 'Custom','3 x 3', '5 x 7','5 x 5','7 x 5','3 x 4'],
    quantityOptions:['50', '100', '250', '500', '1000', '1500', '2000', '2500', '3000'],
  },
    'Invitations': {
       productName:"Invitations",
    paperOptions: ['14pt Cover Semi Gloss', '14pt Matte Paper', '16pt Semi Gloss Paper', '16pt Matte Paper'],
    sizeOptions: ['Custom', '2 x 3', '3 x 3', '1.5 x 1.5', '1.5 x 3.5', '3.5 x 2.5'],
    quantityOptions: ['50', '100', '250', '500', '1000', '1500', '2000', '2500', '3000'],
  },
    'Invoices': {
       productName:"Invoices",
    paperOptions: ["100 lbs Semi Gloss ",
  "120 lbs Matte Paper", 
  "120 lbs Semi Gloss Paper",
  "80 lbs Semi Gloss",
  "120 lbs Standard Bond Paper"   ],
    sizeOptions: [ 'Custom','8.5 x 11', '11 x 8.5','10 x 9','5 x 5','5 x 7' ],
    quantityOptions: ['50', '100', '250', '500', '1000', '1500', '2000', '2500', '3000'],
  },
    'Letterheads': {
       productName:"Letterheads",
    paperOptions: [ "110lb Standard Uncoated Paper",
  "120 lbs Matte Paper",
  "110 lbs Royal Sundance Paper",
  "100 lbs Silk Paper",
  "100 lbs Textured Paper",
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond Paper" ],
    sizeOptions: [ 'Custom','8.5 x 11', '11 x 8.5'  ],
    quantityOptions: ['50', '100', '250', '500', '1000', '1500', '2000', '2500', '3000'],
  },
    'Menus': {
       productName:"Menus",
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
    sizeOptions: [ 'Custom','8.5 x 11', '11 x 8.5','10 x 8'   ,'7 x 11','7 x 8.5'],
    quantityOptions: ['50', '100', '250', '500', '1000', '1500', '2000', '2500', '3000'],
  },
    'NCR': {
       productName:"NCR",
    paperOptions:[ "100 lbs Semi Gloss",
  "120 lbs Matte Paper",
  "110 lbs Royal Sundance Paper",
  "100 lbs Silk Paper",
  "100 lbs Textured Paper",
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond Paper" ],
    sizeOptions: [ 'Custom','8.5 x 11', '11 x 8.5','10 x 8'  ,'7 x 11','7 x 8.5'],
    quantityOptions: ['50', '100', '250', '500', '1000', '1500', '2000', '2500', '3000'],
  },
    'Postcards': {
       productName:"Postcards",
    paperOptions:[ "100 lbs Semi Gloss",
  "120 lbs Matte Paper",
  "110 lbs Royal Sundance Paper",
  "100 lbs Silk Paper",
  "100 lbs Textured Paper",
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond Paper" ],
    sizeOptions: [ 'Custom','6 x 6', '6 x 4','5 x 7' ,'7 x 5' ,'5 x 5' ],
    quantityOptions: ['50', '100', '250', '500', '1000', '1500', '2000', '2500', '3000'],
  },
    'Stickers': {
       productName:"Stickers",
    paperOptions:[ '90lb Semi Gloss',  '100lb Semi Gloss',"100 lbs Semi Gloss",
  "120 lbs Matte Paper",
  "110 lbs Royal Sundance Paper",
  "100 lbs Silk Paper",
  "100 lbs Textured Paper",
  "120 lbs linen Paper",
  "80 lbs Semi Gloss",
  "300 lbs Standard Bond Paper" ],
    sizeOptions: [ 'Custom','3 x 3', '1.5 x 1.5','3 x 2','2 x 2' ,'4 x 4'],
    quantityOptions: ['50', '100', '250', '500', '1000', '1500', '2000', '2500', '3000'],
  },
 
};

const productData = productOptions[productName || 'Flyers'];  
const sizeOptions = productData?.sizeOptions || [];




  // Function to get the correct class for the size box
  const getBoxClass = (size: string) => {
    switch (size) {
      case "Custom":
        return "optionCustom";
      case "2 x 3":
        return "optionMedRectangleHrzntl";
      case "3 x 3":
        return "optionMedSquare";
      case "1.5 x 1.5":
        return "optionSmallSquare";
         case "3 x 3":
        return "optionBigSquare";
      case "4 x 4":
        return "optionMedSquare";
         case "2 x 2":
        return "optionSmallSquare"; 
           case "3 x 2":
        return "optionSmallSquare"; 
           case "6 x 6":
        return "optionBigSquare"; 
           case "6 x 4":
        return "optionSmallRectangleVert"; 

      case "1.5 x 3.5":
        return "optionSmallRectangleHrzntl";
      case "3.5 x 2.5":
        return "optionSmallRectangleVert";
 
      case "8.5 x 11":
        return "optionBigRectangleVert";
        case "11 x 8.5":
        return "optionBigRectangleVert";
        case "10 x 9":
        return "optionBigRectangleVert";
      case "7 x 5":
        return "optionMedRectangleVert";
      case "8 x 5":
        return "optionMedRectangleVert";
          case "5 x 8.5":
        return "optionBigRectangleVert";
      case "7 x 11":
        return "optionMedRectangleVert";
      case "7 x 8.5":
        return "optionMedRectangleVert";

      case "10 x 8":
        return "optionSmallRectangleVert";
      case "8 x 10":
        return "optionBigRectangleHrzntl";
       
       case "A4":
        return "optionBigRectangleHrzntl";
      case "A5":
        return "optionBigRectangleHrzntl";
      case "A10":
        return "optionBigRectangleHrzntl";
      case "#10":
        return "optionBigRectangleHrzntl";
      case "#9":
        return "optionBigRectangleHrzntl";
       
        case "5 x 7":
        return "optionSmallRectangleHrzntl";
      case "5 x 5":
        return "optionMedSquare";
      case "3 x 4":
  return "optionSmallRectangleVert";
      default:
        return "";
    }
  };
const firstColumnSizes = Array.isArray(sizeOptions) ? sizeOptions.slice(0, 3) : [];
const secondColumnSizes = Array.isArray(sizeOptions) ? sizeOptions.slice(3) : [];

// console.log(firstColumnSizes);
// console.log(secondColumnSizes);
  //UI goes here
  return (
        
 
    
   

  <div className="errThingInbetween"  > 
   
 <div className="OrderBuilderTitle" 
 content="Build your Business Card">Build your {productName} 
</div>
 
  
      <div className="chooseBusCardOptionsCont"> 
   
 
        <div className="FooterForBSCOption"  
     > 
      <button
                className="proceed-to-design-button"
                onClick={handleProceedToDesign}
              >
                Proceed to Design
              </button>
        <button
                className="proceed-to-quote-button"
                  onClick={() => handleItemClick('/Custom-Quote')}
              >
                Get a Quote
              </button>
            
            
               </div>
   <div className="chooseBusCardOptionsContWrap"> 
 
       

      <div className="chooseBusCardOptionsContRight"> 
 
     

  <div className="customSizeInputWrapper">
     
  
       
          <p className="optionsPaperTitle">Color Options</p>

         
          <div className="chooseBusCardRCornerOptions">
           
              <div
                className={optionColorClass(selectedColor, 'Front Only')}
                onClick={() => setSelectedColor('Front Only')}
              >
              Front Only 
             
            </div> 
              <div
                className={optionColorClass(selectedColor, 'Front and Back')}
                onClick={() => setSelectedColor('Front and Back')}
              >
               Front and Back 
              </div>
         
            
          </div>
         </div>
 
        <div className="customSizeInputWrapper">
             <div className="optionsRCDescriptions">Round Corner Options</div>
          <div className="chooseBusCardRCornerOptions">
          
              <div
                className={optionRCornerClass(selectedRCorner, '1/8th Round Corner')}
                onClick={() => setSelectedRCorner('1/8th Round Corner')}
              >
             1/8th Round Corner 
              </div>
              <div
                className={optionRCornerClass(selectedRCorner, '1/3th Round Corner')}
                onClick={() => setSelectedRCorner('1/3th Round Corner')}
              >
               1/3th Round Corner 
              </div>
           
              <div
                className={optionRCornerClass(selectedRCorner, 'No Round Corner')}
                onClick={() => setSelectedRCorner('No Round Corner')}
              >
                No Round Corner 
              </div>
          



            
          </div>
 </div>
                
                <div className="customSizeInputWrapper">
                   <p className="optionsPaperTitle">Printing Turnaround</p>
          <div className="chooseBusCardRCornerOptions">
        <div className="rightColorCol">
              <div
                className={optionTurnaroundClass(selectedTurnaround, 'Same Day')}
                onClick={() => setSelectedTurnaround('Same Day')}
              >
               Same Day 
              </div>
              <div
                className={optionTurnaroundClass(selectedTurnaround, 'Next Business Day')}
                onClick={() => setSelectedTurnaround('Next Business Day')}
              >
            Next Business Day 
              </div>
            </div>
            <div className="LeftColorCol">
              <div
                className={optionTurnaroundClass(selectedTurnaround, '2-4 Business Days')}
                onClick={() => setSelectedTurnaround('2-4 Business Days')}
              >
       2-4 Business Days 
              </div>
                  <div
                className={optionTurnaroundClass(selectedTurnaround, '5-7 Business Days')}
                onClick={() => setSelectedTurnaround('5-7 Business Days')}
              >
         5-7 Business Days 
              </div>
            </div>
          </div>
  </div>

    
 
 </div>
          <div className="chooseBusCardOptionsContLeft"> 
<div className="customSizeInputWrapper">
  <div className="paperQuantityWrap">
    <div className="optionsPaperTitle">Choose a type of Paper</div>
    <div className="optionsPaperTitle">Quantity</div>
  </div>
  <div className="paperQuantityDropdownWrap">
  
    <div className="chooseBusCardRCornerOptions">
      <div className="rightQCol">
 <select
  style={{
    background: "#ffffff",
    borderRadius: "5px",
    border: "solid 1px #004f68",
    color: "#000000ff",
  }}
  id="quantity"
  value={selectedQuantity}
  onChange={(e) => setSelectedQuantity(e.target.value as keyof ProductOptions)}
>
  {productName &&
    productOptions[productName]?.quantityOptions
      ?.filter((quantity) => quantity != null) 
      .map((quantity, index) => (
        <option key={index} value={quantity}>
          {quantity}
        </option>
      ))}
</select>
      </div>
    </div>
 
    <div className="chooseBusCardRCornerOptions">
      <div className="rightQCol">
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
     {productName &&
    productOptions[productName]?.paperOptions?.map
    ((paper: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | null | undefined, index: React.Key | null | undefined) => (
    <option key={index} >
          {paper}
        </option>
    ))}
  </select>
      </div>
    </div>
  </div>
</div>  <div className="customSizeInputWrapper">
             <div className="PaperCols">
 
      <div className="rightCol">
        {firstColumnSizes.map((size) => (
          <div
            key={size}
            className={optionClass(selectedSize, size)}
            onClick={() => setSelectedSize(size)}
          >
            <div className={getBoxClass(size)} />
          </div>
        ))}
      </div>
 
      <div className="optionText">
        {firstColumnSizes.map((size) => (
          <p key={size}>{size === "Custom" ? "Custom" : size}</p>
        ))}
      </div>
 
      <div className="rightCol">
        {secondColumnSizes.map((size) => (
          <div
            key={size}
            className={optionClass(selectedSize, size)}
            onClick={() => setSelectedSize(size)}
          >
            <div className={getBoxClass(size)} />
          </div>
        ))}
      </div>
 
      <div className="optionText">
        {secondColumnSizes.map((size) => (
          <p key={size}>{size}</p>
        ))}
      </div> 
      {selectedSize === "Custom" && (
        <div>
          <label htmlFor="customSizeInput">Enter custom size in inches ("s):</label>
          <input
            type="text"
            id="customSizeInput"
            placeholder="e.g. 2.75 x 4.25 (L x W)"
            value={customSizeText}
            onChange={(e) => setCustomSizeText(e.target.value)}
            className="customSizeInput"
          />
        </div>
      )}
    </div>
               </div>

   
       </div>
    </div>
     
      </div>
 
     <div className="OrderBuilderTitle" 
 > 
</div>
        {isDesignContainerVisible && (
          <div className="design-container-overlay">
            <div className="design-container"  style={{ zIndex: "8050"}} >
              <button
                className="close-design-container-button"
                onClick={handleCloseDesignContainer}
              >
                &#10006;
              </button>

              <div className="containerUD">
                <h2>Upload Your Design</h2>

                <div className="form-group">
                  <label htmlFor="orderName">Order Name</label>
                  <input
                    type="text"
                    id="name"
                    value={orderName}
                    onChange={(e) => setOrderName(e.target.value)}
                    placeholder="Enter your order name"
                  />

                  
                </div>
 
                <div className="form-group">
                  <label htmlFor="orderEmail">Order Email</label>
                  <input
                    type="text"
                    id="email"
                    value={orderEmail}
                    onChange={(e) => setOrderEmail(e.target.value)}
                    placeholder="Example@outlook.com"
                  />

                  
                </div>
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
          ⚠️ <strong>Important:</strong> By selecting "Sample before print", you're agreeing to receive an physical sample of your design before printing. Please note that your approval is required before printing, which may lead to a slightly longer turnaround times.
        </p>
      )}

      {approvalType === 'preapproved' && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          ⚠️ <strong>Warning:</strong> By selecting "Pre-Approve Print", you are confirming that the design is ready to print without further review for errors. Please double-check your file to avoid any issues.
        </p>
      )}
    </div>
                </div>
 
<div className="Imagecolumns">
  {/* Front Upload */}
  <div   className={`columnForUpload ${orientation === 'landscape' ? 'full-width' : 'half-width'}`}>
    <div className="file-upload" style={getUploadContainerStyle('front')}>
      <label>Front</label>
      <input
        type="file"
        accept=".png, .jpg, .jpeg, .psd, .ai, .eps, .tif"
        onChange={(e) => handleFileChange(e, 'front')}
      />
    </div>
  </div> 
  {/* Back Upload - Only if needed */}
  {selectedColor === 'Front and Back' && (
    <div className={`columnForUpload ${orientation === 'landscape' ? 'full-width' : 'half-width'}`}>
      <div className="file-upload" style={getUploadContainerStyle('back')}>
        <label>Back</label>
        <input
       
          type="file"
          accept=".png, .jpg, .jpeg, .psd, .ai, .eps, .tif"
          onChange={(e) => handleFileChange(e, 'back')}
        />
      </div>
    </div>
  )}
</div>
 <div className="submitDesign" >
                 <button
            type="submit"
            className="submit-button"
            onClick={handleSubmit} 
          >
            Checkout
          </button>
             <button
                className="submit-button"
                  onClick={handleCreateDesign}
              >
                Create custom Design
              </button>
              </div>
            </div>
  </div>
            <div className="backdropUploadDesign" onClick={handleCloseDesignContainer}></div>
          </div>
        )}   
 

 
  
    


     

<ToastContainer    style={{ zIndex:250}}  >
               </ToastContainer> 

 
</div>
  );
};export default ProductLayout;