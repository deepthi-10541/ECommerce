import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/MensCollection.css";

function MensCollection() {
  const [items, setItems] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const colors = ["white"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shirts, shoes, watches] = await Promise.all([
          axios.get("https://dummyjson.com/products/category/mens-shirts"),
          axios.get("https://dummyjson.com/products/category/mens-shoes"),
          axios.get("https://dummyjson.com/products/category/mens-watches"),
        ]);

        // Combine all 3 category products into one array
        const combinedData = [
          ...shirts.data.products,
          ...shoes.data.products,
          ...watches.data.products,
        ];

        setItems(combinedData);
      } catch (error) {
        console.error("Error fetching men's products:", error);
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
    <div className="mens-section">
      <div className="mens-header">
        <h2>Men’s Collection</h2>
        {items.length > initialCards.length && (
          <button
            className="mens-see-all-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "See All"}
          </button>
        )}
      </div>

      {/* Row that fills the viewport width */}
      <div className="mens-row">
        {initialCards.map((item, index) => (
          <div
            className="mens-card"
            key={item.id}
            style={{ backgroundColor: colors[index % colors.length] }}
          >
            <img src={item.thumbnail} alt={item.title} />
            <h4>{item.title}</h4>
            <div className="mens-price-cart">
              <span>${item.price}</span>
              <button className="mens-add-btn">+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Remaining cards shown when “See All” is clicked */}
      {showAll && remainingCards.length > 0 && (
        <div className="mens-grid">
          {remainingCards.map((item, index) => (
            <div
              className="mens-card"
              key={item.id}
              style={{
                backgroundColor:
                  colors[(index + initialCards.length) % colors.length],
              }}
            >
              <img src={item.thumbnail} alt={item.title} />
              <h4>{item.title}</h4>
              <div className="mens-price-cart">
                <span>${item.price}</span>
                <button className="mens-add-btn">+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MensCollection;
