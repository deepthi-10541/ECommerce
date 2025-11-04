import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Fruits.css";

function Fruits() {
  const [items, setItems] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // const colors = ["#ddeffbff", "#c6ffb1ff", "#d3d3d3"]; // repeating colors
  const colors=['white'];

  useEffect(() => {
    axios
      .get("https://dummyjson.com/products/category/groceries")
      .then((response) => setItems(response.data.products))
      .catch((error) => console.error("Error fetching fruits:", error));
  }, []);

  
  const cardWidth = 180; 
  const viewportWidth = window.innerWidth - 40; 
  const cardsInRow = Math.floor(viewportWidth / (cardWidth + 20)); 
  const initialCards = items.slice(0, cardsInRow);
  const remainingCards = items.slice(cardsInRow);

  return (
    <div className="fruits-section">
      <div className="fruits-header">
        <h2>Popular Right Now</h2>
        {items.length > initialCards.length && (
          <button
            className="see-all-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "See All"}
          </button>
        )}
      </div>

      <div className="fruits-row">
        {initialCards.map((item, index) => (
          <div
            className="fruit-card"
            key={item.id}
            style={{ backgroundColor: colors[index % colors.length] }}
          >
            <img src={item.thumbnail} alt={item.title} />
            <h4>{item.title}</h4>
          
            <div className="price-cart">
              <span>${item.price}</span>
              <button className="add-btn">+</button>
            </div>
          </div>
        ))}
      </div>

   
      {showAll && remainingCards.length > 0 && (
        <div className="fruits-grid">
          {remainingCards.map((item, index) => (
            <div
              className="fruit-card"
              key={item.id}
              style={{ backgroundColor: colors[(index + initialCards.length) % colors.length] }}
            >
              <img src={item.thumbnail} alt={item.title} />
              <h4>{item.title}</h4>
              <p>{item.weight || "1 kg"}</p>
              <div className="price-cart">
                <span>${item.price}</span>
                <button className="add-btn">+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Fruits;

