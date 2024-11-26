import React from "react";
import { useState, useEffect } from "react";
import { Range } from "react-range";
import "../assets/css/filters.css";

const Filters = ({ onFilterChange }) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Appeler la fonction parent à chaque changement de filtre
  useEffect(() => {
    onFilterChange({
      search,
      sort,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    });
  }, [search, sort, priceRange, onFilterChange]);

  return (
    <div className="filters-container">
      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Recherche des articles"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      {/* Boutons de tri */}
      <div className="sort-section">
        <span>Trier par prix :</span>
        <button
          className={`sort-button ${sort === "price-asc" ? "active" : ""}`}
          onClick={() => setSort("price-asc")}
        >
          ↑
        </button>
        <button
          className={`sort-button ${sort === "price-desc" ? "active" : ""}`}
          onClick={() => setSort("price-desc")}
        >
          ↓
        </button>
      </div>

      {/* Slider de prix */}
      <div className="price-section">
        <span>Prix entre :</span>
        <div className="price-slider">
          <span>{priceRange[0]}€</span>
          <Range
            step={1}
            min={0}
            max={1000}
            values={priceRange}
            onChange={(values) => setPriceRange(values)}
            renderTrack={({ props, children }) => (
              <div className="slider-track" style={props.style} ref={props.ref}>
                {/* Ajout d'une clé unique aux enfants */}
                {React.Children.map(children, (child, index) =>
                  React.cloneElement(child, { key: index })
                )}
              </div>
            )}
            renderThumb={({ props, index }) => (
              <div
                className="slider-thumb"
                style={props.style}
                ref={props.ref}
                tabIndex={props.tabIndex}
                role={props.role}
                aria-valuemax={props["aria-valuemax"]}
                aria-valuemin={props["aria-valuemin"]}
                aria-valuenow={props["aria-valuenow"]}
                key={index} // Ajout de clé ici aussi
              />
            )}
          />

          <span>{priceRange[1]}€</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
