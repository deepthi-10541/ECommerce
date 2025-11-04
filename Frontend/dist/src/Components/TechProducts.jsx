import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/TechProducts.css";

function TechProducts() {
  const [items, setItems] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const colors = ["white"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [smartphones, laptops] = await Promise.all([
          axios.get("https://dummyjson.com/products/category/smartphones"),
          axios.get("https://dummyjson.com/products/category/laptops"),
        ]);

        // Combine both categories into one array
        const combinedData = [
          ...smartphones.data.products,
          ...laptops.data.products,
        ];

        setItems(combinedData);
      } catch (error) {
        console.error("Error fetching tech products:", error);
      }
    };

    fetchData();
  }, []);

  const cardWidth = 180;
  const viewportWidth = window.innerWidth - 40;
  const cardsInRow = Math.floor(viewportWidth / (cardWidth + 20));
  const initialCards = items.slice(0, cardsInRow);
  const remainingCards = items.slice(cardsInRow);

  return (
    <div className="tech-section">
      <div className="tech-header">
        <h2>Tech Products</h2>
        {items.length > initialCards.length && (
          <button
            className="tech-see-all-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "See All"}
          </button>
        )}
      </div>

      {/* Initial row */}
      <div className="tech-row">
        {initialCards.map((item, index) => (
          <div
            className="tech-card"
            key={item.id}
            style={{ backgroundColor: colors[index % colors.length] }}
          >
            <img src={item.thumbnail} alt={item.title} />
            <h4>{item.title}</h4>
            <div className="tech-price-cart">
              <span>${item.price}</span>
              <button className="tech-add-btn">+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Remaining cards */}
      {showAll && remainingCards.length > 0 && (
        <div className="tech-grid">
          {remainingCards.map((item, index) => (
            <div
              className="tech-card"
              key={item.id}
              style={{
                backgroundColor:
                  colors[(index + initialCards.length) % colors.length],
              }}
            >
              <img src={item.thumbnail} alt={item.title} />
              <h4>{item.title}</h4>
            
              <div className="tech-price-cart">
                <span>${item.price}</span>
                <button className="tech-add-btn">+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TechProducts;
