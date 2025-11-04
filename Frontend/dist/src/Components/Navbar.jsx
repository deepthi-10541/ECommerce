// import React from "react";
// import "../Styles/Navbar.css";
// import Fresh from "../assets/images/Fresh.png";
// import { Search, User, ShoppingCart, MapPin, Package } from "react-feather";
// import {
//   FaAppleAlt,
//   FaCarrot,
//   FaStore,
//   FaBreadSlice,
//   FaGlassWhiskey,
//   FaSpa,
//   FaHeartbeat,
//   FaSun,
//   FaThLarge,
//   FaLaptop,
// } from "react-icons/fa";

// function Navbar() {
//   const categories = [
//     { name: "All Categories", icon: <FaThLarge /> },
//     { name: "Fruits", icon: <FaAppleAlt /> },
//     { name: "Vegetables", icon: <FaCarrot /> },
//     { name: "Grocery", icon: <FaStore /> },
//     { name: "Bakery & Pastry", icon: <FaBreadSlice /> },
//     { name: "Beverages", icon: <FaGlassWhiskey /> },
//     { name: "Beauty", icon: <FaSpa /> },
//     { name: "Health and Wellness", icon: <FaHeartbeat /> },
//     { name: "Tech", icon: <FaLaptop /> },
//     { name: "Summer Deals", icon: <FaSun /> },
//   ];

//   return (
//     <nav className="navbar">
//       <div className="navbar-top">
        
//         <div className="navbar-left">
//           <img src={Fresh} alt="FreshiMart" className="logo" />
//           <h1 className="brand-name">
//             Freshi<span>Mart</span>
//           </h1>
//         </div>

//         <div className="navbar-center">
//           <div className="delivery-block">
//             <MapPin className="location-icon" />
//             <div>
//               <p className="delivery-title">Delivery</p>
//               <p className="delivery-address">Enter your address</p>
//             </div>
//           </div>
//           <div className="search-bar">
//             <Search className="search-icon" />
//             <input type="text" placeholder="Search for products..." />
//           </div>
//         </div>

//         <div className="navbar-right">
//           <div className="orders">
//             <Package className="icon" />
//             <p>Orders</p>
//           </div>
          
//           <div className="cart">
//             <ShoppingCart className="icon" />
//             <p>My Cart</p>
//           </div>
//           <div className="account">
//             <User className="icon" />
//             <p>
//               Account <br />
//               <span>Log in</span>
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="category-bar">
//         {categories.map((cat, i) => (
//           <button key={i} className="category-btn">
//             <span className="category-icon">{cat.icon}</span>
//             {cat.name}
//           </button>
//         ))}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React, { useState } from "react";
import "../Styles/Navbar.css";
import Fresh from "../assets/images/Fresh.png";
import { Search, ShoppingCart, MapPin, Package, User } from "react-feather";
import {
  FaAppleAlt,
  FaCarrot,
  FaStore,
  FaBreadSlice,
  FaGlassWhiskey,
  FaSpa,
  FaHeartbeat,
  FaSun,
  FaThLarge,
  FaLaptop,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const categories = [
    { name: "All Categories", icon: <FaThLarge /> },
    { name: "Fruits", icon: <FaAppleAlt /> },
    { name: "Vegetables", icon: <FaCarrot /> },
    { name: "Grocery", icon: <FaStore /> },
    { name: "Bakery & Pastry", icon: <FaBreadSlice /> },
    { name: "Beverages", icon: <FaGlassWhiskey /> },
    { name: "Beauty", icon: <FaSpa /> },
    { name: "Health and Wellness", icon: <FaHeartbeat /> },
    { name: "Tech", icon: <FaLaptop /> },
    { name: "Summer Deals", icon: <FaSun /> },
  ];

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleUserClick = () => {
    if (!user) return;
    setShowLogout(true);
    // Automatically hide logout after 3 seconds
    setTimeout(() => setShowLogout(false), 3000);
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="navbar-left">
          <img src={Fresh} alt="FreshiMart" className="logo" />
          <h1 className="brand-name">
            Freshi<span>Mart</span>
          </h1>
        </div>

        <div className="navbar-center">
          <div className="delivery-block">
            <MapPin className="location-icon" />
            <div>
              <p className="delivery-title">Delivery</p>
              <p className="delivery-address">Enter your address</p>
            </div>
          </div>
          <div className="search-bar">
            <Search className="search-icon" />
            <input type="text" placeholder="Search for products..." />
          </div>
        </div>

        <div className="navbar-right">
          <div className="orders">
            <Package className="icon" />
            <p>Orders</p>
          </div>

          <div className="cart">
            <ShoppingCart className="icon" />
            <p>My Cart</p>
          </div>

          <div className="account" style={{ position: "relative" }}>
            <div className="user-block" onClick={handleUserClick}>
              <div className="user-icon">
                <User />
              </div>
              <span className="username">{user ? user : "Log in"}</span>
            </div>

            {showLogout && user && (
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="category-bar">
        {categories.map((cat, i) => (
          <button key={i} className="category-btn">
            <span className="category-icon">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
