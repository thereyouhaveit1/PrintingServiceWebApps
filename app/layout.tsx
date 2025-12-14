"use client"; 
import { ToastContainer,toast } from 'react-toastify';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";   
import "@aws-amplify/ui-react/styles.css"; 
import "./app.css"; 
import { PricingProvider } from "./PricingContext";  
import Chatbot from "./ChatBot/Chatbot"; 
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();  
  const [showAuth, setShowAuth] = useState(false);
  const [dropdownOpenProd, setDropdownOpenProd] = useState(false);
  const [dropdownOpenInvites, setDropdownOpenInvites] = useState(false);
  const [dropdownOpenBSCards, setDropdownOpenBSCards] = useState(false);
  const [dropdownOpenCustomDesign, setDropdownOpenCustomDesign] = useState(false);
  const createAccount = useRef<HTMLDivElement>(null);
  const buttonCreateAccount = useRef<HTMLButtonElement>(null);
  const dropdownRefProd = useRef<HTMLDivElement>(null);
  const dropdownRefInvites = useRef<HTMLDivElement>(null);
  const dropdownRefBSCards = useRef<HTMLDivElement>(null);
  const dropdownRefCustomDesign = useRef<HTMLDivElement>(null);
  const buttonRefProd = useRef<HTMLButtonElement>(null);
  const buttonRefInvites = useRef<HTMLButtonElement>(null);
  const buttonRefBSCards = useRef<HTMLButtonElement>(null);
  const buttonRefCustomDesign = useRef<HTMLButtonElement>(null); 
  const buttonContactUs = useRef<HTMLButtonElement>(null); 
        const [chatOpen, setChatOpen] = useState(false);  
     const [sideBarBttn, setSideBarBttnVisble] = useState(false); 

  // Authentication modal visibility state  
  const closeAuthModal = () => setShowAuth(false);
const [isSmallScreen, setIsSmallScreen] = useState(false); 
  const closeDropdowns = () => {
    setDropdownOpenProd(false);
    setDropdownOpenInvites(false);
    setDropdownOpenBSCards(false);
    setDropdownOpenCustomDesign(false);
    setSideBarBttnVisble(false);
  };

const handleItemClick = (product: string) => {
  closeDropdowns();
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


const handleItemClick1 = (path: string) => {
  closeDropdowns();
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
 
     window.location.href = path ;
};

  
 
  const handleMouseEnter = (dropdownSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    dropdownSetter(true);
  };

  const handleMouseLeave = (dropdownSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    dropdownSetter(false);
  };
 
  //this is to handle the clicks 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {

      if (
        (createAccount.current &&
          !createAccount.current.contains(event.target as Node) &&
          !buttonCreateAccount.current?.contains(event.target as Node)) ||
          

        (dropdownRefProd.current &&
          !dropdownRefProd.current.contains(event.target as Node) &&
          !buttonRefProd.current?.contains(event.target as Node)) ||
        (dropdownRefInvites.current &&
          !dropdownRefInvites.current.contains(event.target as Node) &&
          !buttonRefInvites.current?.contains(event.target as Node)) ||
        (dropdownRefBSCards.current &&
          !dropdownRefBSCards.current.contains(event.target as Node) &&
          !buttonRefBSCards.current?.contains(event.target as Node)) ||
        (dropdownRefCustomDesign.current &&
          !dropdownRefCustomDesign.current.contains(event.target as Node) &&
          !buttonRefCustomDesign.current?.contains(event.target as Node))
      ) {
        setShowAuth(false)
        setDropdownOpenProd(false);
        setDropdownOpenInvites(false);
        setDropdownOpenBSCards(false);
        setDropdownOpenCustomDesign(false);
        setSideBarBttnVisble(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAuth]);

 
  const closeChat = () => {
  setChatOpen(false);
};

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);  
    };

    window.addEventListener('resize', handleResize);
    handleResize();  

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSideBarBttn = () => {
    setSideBarBttnVisble(!sideBarBttn);
  };
 
  const toggleChat = () => {
    setChatOpen((prev) => !prev);
  };
const containerRef = useRef<HTMLDivElement>(null);
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const handleScroll = () => {
    setScrolled(container.scrollTop > 50);
  };

  container.addEventListener("scroll", handleScroll);
  handleScroll(); // Trigger once on mount

  return () => {
    container.removeEventListener("scroll", handleScroll);
  };
}, []);


 

  return (
    <html lang="en">
       <body> 
  
       

 <PricingProvider>  
 
        <div ref={containerRef} className="app-container">
        <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
            
       

           <button onClick={toggleSideBarBttn} className="sideBarBttn"> &#9776;</button>   
         
 
    {(isSmallScreen ? sideBarBttn : true) && ( <div    className={`SubheaderBttnCont ${scrolled ? "SubheaderBttnCont-scrolled" : ""}`}>
      
            <img
  src={isSmallScreen  ? "/logoinv.png" : "/logo.png"}
  alt="Logo"
  className="logo"
   onClick={() => handleItemClick1('/')}
  onError={(e) => {
    (e.target as HTMLImageElement).src = "/logo.png";
  }}
/>

           <button 
           className={`homePagebttn ${scrolled ? "homePagebttn-scrolled" : ""}`}
           onClick={() => handleItemClick1('/')}
        >
          Home
        </button>
        <button
          ref={buttonRefProd}
           className={`buttonAllBusiness ${scrolled ? "buttonAllBusiness-scrolled" : ""}`}
          onClick={() => setDropdownOpenProd((prev) => !prev)}  
           onMouseLeave={() => handleMouseLeave(setDropdownOpenProd)} 
          
        >
          All Services 	&#11167;

          {dropdownOpenProd && (

        <div  ref={dropdownRefProd} className="dropdown-menu">

 
<div className="dropdown-item"  onClick={() => handleItemClick('Booklets')}>Booklets</div>
<div className="dropdown-item" onClick={() => handleItemClick('Business Cards')}>Business Cards</div>
<div className="dropdown-item" onClick={() => handleItemClick('Envelopes')}>Envelopes</div>
<div className="dropdown-item" onClick={() => handleItemClick('Flyers')}>Flyers</div>
<div className="dropdown-item" onClick={() => handleItemClick('Invitations')}>Invitations</div>
<div className="dropdown-item" onClick={() => handleItemClick('Invoices')}>Invoices</div>
<div className="dropdown-item" onClick={() => handleItemClick('Stickers')}>Labels</div>
<div className="dropdown-item" onClick={() => handleItemClick('Letterheads')}>Letterheads</div>
<div className="dropdown-item" onClick={() => handleItemClick('Menus')}>Menus</div>
<div className="dropdown-item" onClick={() => handleItemClick('NCR')}>NCR Forms</div>
<div className="dropdown-item" onClick={() => handleItemClick('Postcards')}>Postcards</div>
<div className="dropdown-item" onClick={() => handleItemClick1('./Orders/Custom-Quote')}>Get a Custom Quote</div>
<div className="dropdown-item"onClick={() => handleItemClick1('./Orders/Canvas-Editor')}>Custom Design</div>
</div>
      )}
 

        </button>
   <button
          ref={buttonRefInvites}
         className={`buttonAllProd ${scrolled ? "buttonAllProd-scrolled" : ""}`}
          onClick={() => setDropdownOpenInvites((prev) => !prev)} 
           onMouseLeave={() => handleMouseLeave(setDropdownOpenInvites)} 
        >
          Invitations 	&#11167;

          
      {dropdownOpenInvites && (
        <div ref={dropdownRefInvites} className="dropdown-menu">
           <div className="dropdown-item"onClick={() => handleItemClick('Invitations')}>Party Invitations</div>
          <div className="dropdown-item"onClick={() => handleItemClick('Invitations')}>Wedding invitations</div>
         <div className="dropdown-item"onClick={() => handleItemClick1('./Orders/Canvas-Editor')}>Custom Design</div>
        </div>
      )}

        </button>
        <button
          ref={buttonRefBSCards}
           className={`buttonAllProd ${scrolled ? "buttonAllProd-scrolled" : ""}`}
          onClick={() => setDropdownOpenBSCards((prev) => !prev)} 
          onMouseLeave={() => handleMouseLeave(setDropdownOpenBSCards)} 
        >
          Business Cards 	&#11167;
          
      {dropdownOpenBSCards && (
        <div ref={dropdownRefBSCards} className="dropdown-menu">
          <div className="dropdown-item" onClick={() => handleItemClick('Business Cards')} >Business Cards</div>
           <div className="dropdown-item"onClick={() => handleItemClick1('/Orders/Canvas-Editor')}>Custom Design</div>
            </div>
      )}


        </button>
        <button
          ref={buttonRefCustomDesign}
          className={`buttonAllProd ${scrolled ? "buttonAllProd-scrolled" : ""}`}
          onClick={() => setDropdownOpenCustomDesign((prev) => !prev)} 
           onMouseLeave={() => handleMouseLeave(setDropdownOpenCustomDesign)} 
        >
          Get A Quote 	&#11167;

          

      {dropdownOpenCustomDesign && (
        <div ref={dropdownRefCustomDesign} className="dropdown-menu">
          <div className="dropdown-item"onClick={() => handleItemClick1('/Orders/Canvas-Editor')}>Create your own Design</div>
        
          <div className="dropdown-item"  onClick={() => handleItemClick1('/Orders/Custom-Quote')}>Get A Quote </div>
        </div>
      )} 
        </button>
         <button 
      ref={buttonContactUs}
    className="btnHPSmall2"
    onClick={() => handleItemClick1('/Orders/Contact-Us')}
  >
   Contact Us
  </button>   
              
             
      </div>
   )}
           
        
  
      
    


           
  </header> 

   <main  >{children}</main>
          <footer className="footer">
            &copy; 2025 . All Rights Reserved. 
            
            {chatOpen  && (
        <Chatbot   /> 
      )} 
    <button
  id="myButton"
  onClick={toggleChat}
  className="chat-toggle-button"
>
  

  <ul>
    <li>
      <span className="icon">💬</span>
      <span className="title">Chat Assistant</span>
    </li>
  </ul>
</button>    
          </footer>
        </div>     </PricingProvider>  
      </body> 
      
 
    </html>
  );
}

function dropdownSetter(arg0: boolean): import("react").Dispatch<import("react").SetStateAction<boolean>> {
  throw new Error('Function not implemented.');
}
