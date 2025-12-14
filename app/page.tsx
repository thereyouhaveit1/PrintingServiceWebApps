"use client";
import React, {  useState, useEffect, useRef } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";  
import "./app.css";   
import { useRouter, usePathname  } from 'next/navigation'
import styled from "@emotion/styled";  
 import Swiper from 'swiper/bundle';  
import 'swiper/swiper-bundle.css';
 import { motion } from "framer-motion";  
import '@splidejs/splide/dist/css/splide.min.css'; 
import Slider from "./Slider"; 
import "react-multi-carousel/lib/styles.css";  
import { ToastContainer,toast } from 'react-toastify';
Amplify.configure(outputs); 
 
 
const Dropdown = styled.select`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px #ddd;
  background: rgba(33, 37, 41, 1);
  color: #fff;
  cursor: pointer;
  display: flex;
  z-index: 5;
`;
 
 
 

export default function App(this: any ) { 

  //initialize err thing here
 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(true);
const [isClient, setIsClient] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
 
  useEffect(() => {
    const handleScroll = () => { 
      if (window.scrollY > 50) {
        setIsScrolled(true);
      }
    };

    const handleClick = () => { 
      setIsScrolled(true);
    };

    const handleMouseEnter = () => { 
      setIsScrolled(true);
    };

    const handleMouseLeave = () => { 
      if (window.scrollY <= 50) {
        setIsScrolled(false);
      }
    };

    const swipeMessageElement = document.querySelector(".swipeMessage");

    const scrollTimeout = setTimeout(() => {
      setIsScrolled(true);  
    }, 10000);
 
    if (swipeMessageElement) {
      swipeMessageElement.addEventListener("click", handleClick);
      swipeMessageElement.addEventListener("mouseenter", handleMouseEnter); 
    }

 
    window.addEventListener("scroll", handleScroll);

 
    return () => {
      clearTimeout(scrollTimeout);
      if (swipeMessageElement) {
        swipeMessageElement.removeEventListener("click", handleClick);
        swipeMessageElement.removeEventListener("mouseenter", handleMouseEnter); 
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

    const handleItemClick = (navigateTo: string) => {
  setTimeout(() => {
    if (navigateTo) { 
      toast.loading("Loading..please wait", {
        position: "bottom-left",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        style: {
          zIndex: 9999,
        },
      });
 
      window.location.href = navigateTo;
    }
  }, 100);
};



 useEffect(() => {
    setIsClient(true);  
  }, []);


 
    const [activeIndex, setActiveIndex] = useState(0);

   
    const [transitionDirection, setTransitionDirection] = useState("next");

 
    const handleNextMid = () => {
        setTransitionDirection("next");
        setActiveIndex((prevIndex) =>
            prevIndex === 2 ? prevIndex : prevIndex + 1
        );
    };

    
    const handlePrevious = () => {
        setTransitionDirection("previous");
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? prevIndex : prevIndex - 1
        );
    };

 
    const texts = [
        {
            title: "Next Day Business Cards Available!",
             button: "Contact Us",
            description:
                "We offer same day pick up for selected items, call today for more information.",
        },
        {
            title: "On demand support when you need it!",
             button: "Contact Us",
            description:
                "If you have an issue with an order, give us a call we will personally assist you.",
        },
        {
            title: "Need a custom Design?",
             button: "Custom Quote",
            description:
                "Our graphic design team will create original logos, menus, invitations and more!",
        },
    ];

    // defining text animation
    const textVariants = {
        hidden: {
            opacity: 0,
            x: transitionDirection === "next" ? 100 : -100,
            transition: { duration: 0.5, ease: "easeInOut" },
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: "easeInOut" },
        },
    };

    // defining stagger text effect
    const textContainerVariant = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.1 },
        },
    };
  



  useEffect(() => {
 
    const swiper = new Swiper(".mySwiper", {
      effect: "cards",
      grabCursor: false,
      centeredSlides: true,
      coverflowEffect: {
        rotate: 10, 
        depth: 50,
        modifier: 1,
        slideShadows: false,
      },
      loop: false,
    });

   
    return () => {
      if (swiper && swiper.destroy) {
        swiper.destroy();
      }
    };
  }, []);  

 
   


    const router = useRouter()
  //UI goes here
  return (
        
    
   
     <div className="errThingInbetweenHP" >

   
 <div className="carouselBackground">
  <div className="shiny-text">
  Order online or call for a walk in appointment!
</div>

  <div className="bannerBttns">
<button onClick={() => handleItemClick('../Orders/Canvas-Editor')}
className="btnHPSmall1">Create Custom Design</button>
<button onClick={() => handleItemClick('../Orders/Contact-Us')}
className="btnHP">Contact Us</button>
</div></div>
 
  <div className="threeDCar">
 
    <div className="leftColContent">
            <motion.div
                className="contentContainer "
                key={activeIndex}
                variants={textContainerVariant}
                initial="hidden"
                animate="visible"
            >
             
                <div className="titleContainer">
                    <motion.p  >
                        {texts[activeIndex].title}
                    </motion.p>
                </div>
                <div className="descriptionContainer">
                    <motion.p  >
                        {texts[activeIndex].description}
                        
                    </motion.p>
                  
                </div>
                 <div className="btnHP">
                    <motion.button  onClick={() => handleItemClick('../Orders/Custom-Quote')} >
                        {texts[activeIndex].button}
                        
                    </motion.button>
                  
                </div>
                  <div>
                   
                </div>
            </motion.div></div>
            
            <div className="imagesContainer">  
                 <div className="imagesContainerInner"> 
                <motion.div
                    className="firstContainer"
                    animate={{
                        opacity:
                            activeIndex === 0 ? 1 : activeIndex === 1 ? 0 : 0,
                        x:
                            activeIndex === 0
                                ? "0"
                                : activeIndex === 1
                                ? "96px"
                                : "96px",
                        scale:
                            activeIndex === 0
                                ? 1
                                : activeIndex === 1
                                ? 1.2
                                : 1.2,
                    }}
                    transition={{
                        duration: 0.5,  
                        delay: 0, 
                        ease: "easeInOut",  
                    }}
                >
                    <img
                        className="first" 
                         src="/Booklets1.png"
                    ></img>
                </motion.div>
                <motion.div
                    className="secondContainer"
                    animate={{
                        opacity:
                            activeIndex === 0
                                ? 0.66
                                : activeIndex === 1
                                ? 1
                                : 0,
                        x:
                            activeIndex === 0
                                ? "-96px"
                                : activeIndex === 1
                                ? "0"
                                : "96px",
                        scale:
                            activeIndex === 0
                                ? 0.8
                                : activeIndex === 1
                                ? 1
                                : 1.2,
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0,
                        ease: "easeInOut",
                    }}
                >
                    <img
                        className="second" 
                         src="/custSupport.png"
                    ></img>
                </motion.div>
                <motion.div
                    className="thirdContainer"
                    animate={{
                        opacity:
                            activeIndex === 0
                                ? 0.33
                                : activeIndex === 1
                                ? 0.66
                                : 1,
                        x:
                            activeIndex === 0
                                ? "-192px"
                                : activeIndex === 1
                                ? "-96px"
                                : "0",
                        scale:
                            activeIndex === 0
                                ? 0.6
                                : activeIndex === 1
                                ? 0.8
                                : 1,
                    }}
                    transition={{
                        duration: 0.5,  
                        delay: 0,  
                        ease: "easeInOut",  
                    }}
                >
                    <img
                        className="third" 
                         src="./tomatoe drawing.jpg"
                    ></img>
                </motion.div>    </div>
 <div className="controls">
                     <button
            className={`${activeIndex !== 0 ? "btn-prev" : "disabled"} previousContainer`}
            onClick={handlePrevious}
            disabled={activeIndex === 0}
        >
           Prev
        </button>

        <button
            className={`${activeIndex !== 2 ? "btn-next" : "disabled"} nextContainer`}
            onClick={handleNextMid}
            disabled={activeIndex === 2}
        >
             Next
        </button> 
                 
            </div>
     

 </div>





    </div>

 <div className="ThreeColumns"> 
    

        <div className="SlidesCol">
 
          <Slider />
        </div>
  
    
  </div>
 

  <div className="RightWideBanners">

 
<div className="rightColFooter">
     
  <div className="swiper-container mySwiper">
    <div className="swiper-wrapper">

         <div
    className={`swipeMessage ${isScrolled ? "hide" : ""}`}
  >
    <p>Swipe left to view photos</p>
 
  </div>

      <div className="swiper-slide">
        <img src="./Duke Ellington.jpg" />
      </div>
      <div className="swiper-slide">
        <img src="Mile Davis.jpg" />
      </div>
      <div className="swiper-slide">
        <img src="Peardrawing.jpg" />
      </div>
    </div>
  </div>
  

</div>

        <div className="LeftColFooter">
 
 
 
  
       <div className="LeftColFooterText"> Need a design?   </div> 
   <div className="LeftColFooterText1">    We design original Logos and more!  </div>    <div className="LeftColFooterText1"> Our graphic designers will create original designs for you, ask for a quote! 
  </div>   <button className="btnHP" onClick={() => handleItemClick('/Custom-Quote')}>Get a Custom Quote</button>
         
         
 </div>
   
      </div> 
      
        <div className="OrderBuilderTitle" 
 > 
</div>
      </div> 
 
 
     
  );
}