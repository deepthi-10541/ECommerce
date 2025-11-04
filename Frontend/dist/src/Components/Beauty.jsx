import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Beauty.css"; 

function Beauty() {
  const [items, setItems] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const colors = ["white"];

  useEffect(() => {
    axios
      .get("https://dummyjson.com/products/category/beauty")
      .then((response) => setItems(response.data.products))
      .catch((error) => console.error("Error fetching beauty products:", error));
  }, []);

  const cardWidth = 180;
  const viewportWidth = window.innerWidth - 40;
  const cardsInRow = Math.floor(viewportWidth / (cardWidth + 20));
  const initialCards = items.slice(0, cardsInRow);
  const remainingCards = items.slice(cardsInRow);

  return (
    <div className="beauty-section">
      <div className="beauty-header">
        <h2>Beauty Products</h2>
        {items.length > initialCards.length && (
          <button
            className="beauty-see-all-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "See All"}
          </button>
        )} 
      </div>

      <div className="beauty-row">
        {initialCards.map((item, index) => (
          <div
            className="beauty-card"
            key={item.id}
            style={{ backgroundColor: colors[index % colors.length] }}
          >
            <img src={item.thumbnail} alt={item.title} />
            <h4>{item.title}</h4>
            <div className="beauty-price-cart">
              <span>${item.price}</span>
              <button className="beauty-add-btn">+</button>
            </div>
          </div>
        ))}
      </div>

      {showAll && remainingCards.length > 0 && (
        <div className="beauty-grid">
          {remainingCards.map((item, index) => (
            <div
              className="beauty-card"
              key={item.id}
              style={{
                backgroundColor:
                colors[(index + initialCards.length) % colors.length],
              }}
            >
              <img src={item.thumbnail} alt={item.title} />
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <div className="beauty-price-cart">
              <span>${item.price}</span>
              <button className="beauty-add-btn">+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Beauty;
