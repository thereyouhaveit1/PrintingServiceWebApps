import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./../app.css";  
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide:1  
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 1,
    slidesToSlide: 1 
  },
mobile: {
  breakpoint: { max: 767, min: 464 },
  items: 1,
  slidesToSlide: 1
}
};

const sliderImageUrl = [
  { url: "/bscard.png" },
  { url: "/stickers.png" },
  { url: "/brochure.png" },
  { url: "/menus.png" },
  { url: "/BSCRCEx.png" },
  { url: "/mockSevicesBanner.png" },
  { url: "/bscGlossVsMatteEx.png" },
  { url: "/needDesign.png" },
  { url: "/FlyerPaperSizeEx.png" },
];
const Slider1 = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImageUrl.length);
    }, 60000); // Change image every 60 seconds (60000ms)

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
 
      <Carousel
      responsive={responsive}
      autoPlay={true}  
      autoPlaySpeed={90000} 
      swipeable={false} 
      draggable={false}  
      showDots={false} 
      infinite={false}  
      pauseOnHover={true}  
 
      >
    {sliderImageUrl.map((imageUrl, index) => (
        <div className="slider1" key={index}>
          <img src={imageUrl.url} alt={`slide-${index}`} />
        </div>
      ))}
    </Carousel> 
   
  );
};
export default Slider1;
