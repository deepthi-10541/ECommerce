import React from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../Styles/HeroCards.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Clothes from "../assets/images/Clothes.png";
import Handbag from "../assets/images/Handbag.png";
import Beauty from "../assets/images/Beauty.png";
import bannerimage2 from "../assets/images/bannerimage2.png";
import image1 from "../assets/images/image1.png";
import image2 from "../assets/images/image2.png";

// Custom Arrows
const PrevArrow = ({ onClick }) => (
  <div className="arrow prev" onClick={onClick}>
    <FaChevronLeft size={32} />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div className="arrow next" onClick={onClick}>
    <FaChevronRight size={32} />
  </div>
);


const cardData = [
  
  {
    title: "Fashion for Everyone",
    span: "Trendy Styles",
    text: "Stay stylish with our latest collection",
    button: "EXPLORE",
    img: Clothes,
    bgColor: "rgb(220, 240, 255)",
  },
  {
    title: "Exclusive Handbags",
    span: "On Sale",
    text: "Grab the perfect handbag at best prices",
    button: "SHOP BAGS",
    img: Handbag,
    bgColor: "rgb(255, 245, 230)",
  },
  {
    title: "Beauty Essentials",
    span: "Natural Glow",
    text: "Find your perfect skincare and cosmetics",
    button: "SHOP BEAUTY",
    img: Beauty,
    bgColor: "rgba(239, 224, 250, 1)",
  },
  {
    title: "Cool Beverages",
    span: "Refreshing Deals",
    text: "Enjoy special discounts on your favorite drinks",
    button: "ORDER NOW",
    img: bannerimage2,
    bgColor: "rgb(235, 255, 240)",
  },
  {
    title: "Tech Gadgets",
    span: "Smart Choices",
    text: "Upgrade your life with latest tech gear",
    button: "BUY NOW",
    img: image1,
    bgColor: "rgb(245, 245, 255)",
  },
  {
    title: "Exclusive Offers",
    span: "Don’t Miss Out",
    text: "Limited-time deals on best products",
    button: "VIEW OFFERS",
    img: image2,
    bgColor: "rgb(250, 240, 220)",
  },
];

function HeroCards() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 700,
    slidesToShow: 3, 
    slidesToScroll: 1,
    arrows: true,
    swipeToSlide: true,
    cssEase: "ease-in-out",
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
        slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <div className="banner-slider">
      <Slider {...settings}>
        {cardData.map((card, index) => (
          <div key={index} className="slide-card">
            <div
              className="card"
              style={{ backgroundColor: card.bgColor }}
            >
              <div className="card-text">
                <h1>
                  {card.title} <br/>
                  <span>{card.span}</span>
                </h1>
                <p>{card.text}</p>
                <button>{card.button}</button>
              </div>
              <div className="card-img">
                <img src={card.img} alt={card.title} />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HeroCards;
