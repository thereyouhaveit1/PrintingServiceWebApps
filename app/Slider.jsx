import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./app.css";
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 7,
    slidesToSlide: 9  
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 3  
  },
mobile: {
  breakpoint: { max: 767, min: 464 },
  items: 1,
  slidesToSlide: 1
}
};
const sliderImageUrl = [
 
  {
    url:
      "/bscard.png"
  },
  {
    url:
      "/stickers.png"
  }, 
  {
    url:
      "/brochure.png"
  }, 
  {
    url:
      "/Menus1.png"
  },
 

  {
    url:
      "/FlyerPaperCoatingEx.png"
  },
   {
    url:
      "/bsCardSample1.png"
  }
  ,
   {
    url:
      "/bsCardSample2.png"
  }
  ,
   {
    url:
      "/flyers.png"
  } 
  ,
   {
    url:
      "/FlyerPaperSizeEx.png"
  } 
];
const Slider = () => {
  return (
    <div className="parent">
      <Carousel
        responsive={responsive}
        autoPlay={true}
        swipeable={true}
        draggable={true}
        showDots={false}
        infinite={true}
        partialVisible={false} 
      >
        {sliderImageUrl.map((imageUrl, index) => {
          return (
            <div className="slider" key={index}>
              <img src={imageUrl.url} alt="movie" />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};
export default Slider;
