import React, { useState, useEffect } from "react";
import "../Styles/Navbar.css";
import Fresh from "../assets/images/Fresh.png";
import { Search, ShoppingCart, MapPin, Package, User } from "react-feather";
import * as Icons from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

import { fetchCategories, selectCategory } from "../redux/categoriesSlice";
import { openSidebar } from "../redux/profileSlice";

import { useNavigate } from "react-router-dom";

const iconList = [
  "FaAppleAlt",
  "FaCarrot",
  "FaStore",
  "FaBreadSlice",
  "FaGlassWhiskey",
  "FaSpa",
  "FaHeartbeat",
  "FaLaptop",
  "FaSun",
  "FaThLarge",
];

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get categories from Redux store
  const { list: categories, loading, error } = useSelector(
    (state) => state.categories
  );

  const { user } = useSelector((state) => state.auth);

  // Fetch categories on load
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Open profile sidebar or navigate to login
  const handleUserClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(openSidebar()); // open profile sidebar
    }
  };

  return (
    <nav className="navbar">
      {/* ---------------- TOP NAVBAR ---------------- */}
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

          {/* Search Bar */}
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

          {/* User Account Section */}
          <div className="account" style={{ position: "relative" }}>
            <div className="user-block" onClick={handleUserClick}>
              <div className="user-icon">
                <User />
              </div>
              <span className="username">{user ? user : "Log in"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- CATEGORY NAVBAR ---------------- */}
      <div className="category-bar">
        {loading && (
          <p className="loading-text" style={{ marginLeft: "20px" }}>
            Loading categories...
          </p>
        )}

        {error && (
          <p style={{ color: "red", marginLeft: "20px" }}>
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          categories.map((cat, index) => (
            <button
              key={cat.id}
              className="category-btn"
              onClick={() => dispatch(selectCategory(cat.id))}
            >
              <span className="category-icon">
                {React.createElement(Icons[iconList[index % iconList.length]])}
              </span>
              {cat.name}
            </button>
          ))}
      </div>
    </nav>
  );
}

export default Navbar;
