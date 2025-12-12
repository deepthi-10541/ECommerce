import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSubcategory, goBack } from "../redux/categoriesSlice";
import "../Styles/pages/homepage.css";

function HomePage() {
  const dispatch = useDispatch();

  const {
    list: categories,
    selectedCategory,
    subcategories,
    selectedSubcategory,
    products,
  } = useSelector((state) => state.categories);

  return (
    <div className="homepage-container">

      {/* -------------------- CASE 3: SHOW PRODUCTS -------------------- */}
      {selectedSubcategory && (
        <>
          {/* BACK BUTTON */}
          <button
            className="back-btn"
            onClick={() => dispatch(goBack())}
          >
            ← Back
          </button>

          <h2>{selectedSubcategory.name} Products</h2>

          <div className="product-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card">
                <h3>{p.name}</h3>
                <p>₹{p.discount_price}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* -------------------- CASE 1 & CASE 2: SHOW SUBCATEGORIES -------------------- */}
      {!selectedSubcategory && selectedCategory && (
        <>
          <h2>{selectedCategory.name}</h2>

          {/* CASE 1: ALL categories */}
          {selectedCategory.id === 0 ? (
            <>
              {categories
                .filter((c) => c.id !== 0)
                .map((cat) => (
                  <div key={cat.id} className="category-section">
                    <h3>{cat.name}</h3>

                    <div className="subcategory-grid">
                      {cat.subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="subcategory-card"
                          onClick={() => dispatch(selectSubcategory(sub.id))}
                        >
                          <img
                            src={sub.image || "/default.png"}
                            alt={sub.name}
                            className="subcategory-img"
                          />
                          <p>{sub.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </>
          ) : (
            /* CASE 2: SPECIFIC CATEGORY */
            <div className="subcategory-grid">
              {subcategories.map((sub) => (
                <div
                  key={sub.id}
                  className="subcategory-card"
                  onClick={() => dispatch(selectSubcategory(sub.id))}
                >
                  <img
                    src={sub.image || "/default.png"}
                    alt={sub.name}
                    className="subcategory-img"
                  />
                  <p>{sub.name}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
