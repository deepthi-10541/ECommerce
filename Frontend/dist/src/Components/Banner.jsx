import React from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../Styles/Banner.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Fresh from "../assets/images/Fresh.png";
import Clothes from '../assets/images/Clothes.png';
import Handbag from "../assets/images/Handbag.png";
import Beauty from "../assets/images/Beauty.png";
import bannerimage2 from "../assets/images/bannerimage2.png";
import image1 from "../assets/images/image1.png";
import image2 from "../assets/images/image2.png";


const PrevArrow = ({ onClick }) => (
  <div className="arrow prev" onClick={onClick}>
    <FaChevronLeft size={48} />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div className="arrow next" onClick={onClick}>
  <FaChevronRight size={48}/>
  </div>
);
function Banner() {
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  const carouselImages = [Handbag,image1,Beauty,bannerimage2,Clothes,image2];

  return (
    <div className="hero-container">
      <div className="left-card">
        <div className="left-card-text">
          <h1>
            We deliver <br/>
            grocery all over <br/>
            <span>India</span>
          </h1>
          <p>GET THEM ALL IN OUR STORE</p>
          <button>SHOP NOW</button>
        </div>
        <div className="left-card-img">
          <img src={Fresh} alt="Fresh Grocery" />
        </div>
      </div>
      <div className="right-card">
        <Slider {...sliderSettings}>
          {carouselImages.map((img, index) => (
            <div key={index} className="slide-container">
              <img src={img} alt={`Slide ${index}`} className="carousel-img" />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
export default Banner;
