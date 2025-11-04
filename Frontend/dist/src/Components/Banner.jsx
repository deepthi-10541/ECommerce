


// import React from "react";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
// import "../Styles/Banner.css";
// import { ChevronLeft, ChevronRight } from "react-feather";
// import Fresh from '../assets/images/Fresh.png';
// import Handbag from '../assets/images/Handbag.png';
// import Cooldrinks from '../assets/images/Cooldrinks.png';
// import Techimg from '../assets/images/Techimg.png';
// const bannerData = [
//   {
//     id: 1,
//     image:Handbag,
//     tag: "PRIME",
//     title: "Prime Member Deals",
//     text: "Exclusive discounts for Prime members",
//     button: "See Offers",
//     bgColor: " rgba(0, 0, 0, 0.3)",
//     color:"gray",
//   },
//   {
//     id: 2,
//     image:Fresh,
      
//     tag: "FRESH",
//     title: "Fresh Groceries",
//     text: "Farm-fresh fruits & vegetables delivered daily",
//     button: "Shop Now",
//     bgColor: "#1a6a34ff",
//   },
//   {
//     id: 3,
//       image: Cooldrinks,
//     tag: "DRINKS",
//     title: "Refreshing Beverages",
//     text: "Cool offers on your favorite drinks",
//     button: "Explore",
//     bgColor: "red",
//   },
//   {
//     id: 4,
//     image:Techimg,
//     tag: "TECH",
//     title: "Latest Tech Deals",
//     text: "Grab exclusive tech discounts today",
//     button: "Buy Now",
//     bgColor: "#434649ff",
//   },
// ];

// const NextArrow = ({ onClick }) => (
//   <div className="arrow next" onClick={onClick}>
//     <ChevronRight size={48} />
//   </div>
// );

// const PrevArrow = ({ onClick }) => (
//   <div className="arrow prev" onClick={onClick}>
//     <ChevronLeft size={48} />
//   </div>
// );

// function Banner() {
//   const settings = {
//     dots: true,
//     infinite: true,
//     autoplay: false,
//     autoplaySpeed: 5000,
//     speed: 800,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     pauseOnHover: true,
//     swipeToSlide: true,
//     cssEase: "ease-in-out",
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//   };
  

//   return (
//     <div className="banner-slider">
//       <Slider {...settings}>
//         {bannerData.map((b) => (
//           <div key={b.id} className="banner-slide">
//             <div
//               className="banner-overlay"
//               style={{
//                 backgroundImage: `url(${b.image})`,
//                 backgroundColor: b.bgColor,
//               }}
//             />
//             <div className="banner-content">
//               <span className="banner-tag">{b.tag}</span>
//               <h2>{b.title}</h2>
//               <p>{b.text}</p>
//               <button className="banner-btn">{b.button}</button>
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// }

// export default Banner;




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
