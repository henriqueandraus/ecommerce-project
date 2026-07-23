import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import API_URL from "../services/api";
import "./Home.css";

const heroBanner = `${API_URL}/images/hero-banner.jpeg`;

const FEATURED_COUNT = 6;

function Home() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data.slice(0, FEATURED_COUNT));
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <img className="hero-media" src={heroBanner} alt="" loading="eager" />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-content">
          <span className="eyebrow hero-eyebrow">Small runs, no restock</span>
          <h1 className="hero-title">Cut for the curb.</h1>
          <p className="hero-lede">
            Street-cut layers built for standing outside. Every drop lands once — when it's gone, it's gone.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn">
              Shop the drop
            </Link>
            <Link to="/products" className="btn-ghost">
              View full rack →
            </Link>
          </div>
        </div>
        <span className="hero-credit">Since the first crack in the pavement</span>
      </section>

      <section className="featured">
        <div className="featured-head">
          <span className="eyebrow">Current rack</span>
          <h2>What's out right now.</h2>
        </div>

        <div className="ticket-grid">
          {status === "loading" && <FeaturedSkeleton />}

          {status === "error" && (
            <div className="rack-message">
              <span className="eyebrow">Connection failed</span>
              <h3>Couldn't reach the shop floor.</h3>
              <p>The rack is having trouble loading. Refresh the page to try again.</p>
            </div>
          )}

          {status === "ready" && products.length === 0 && (
            <div className="rack-message">
              <span className="eyebrow">Nothing tagged yet</span>
              <h3>The rack's empty.</h3>
              <p>No stock has been added yet — new drops will show up here the moment they land.</p>
            </div>
          )}

          {status === "ready" &&
            products.map((product, index) => (
              <Link
                to={`/products/${product.id}`}
                className="ticket"
                key={product.id}
                style={{ "--delay": `${index * 0.06}s` }}
              >
                <span className="ticket-no">No. {String(index + 1).padStart(3, "0")}</span>
                <div className="ticket-media">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} loading="lazy" />
                  ) : (
                    <span className="ticket-media-fallback">No image</span>
                  )}
                </div>
                <h3>{product.name}</h3>
                <p className="ticket-desc">{product.description}</p>
                <div className="ticket-foot">
                  <span className="ticket-price">${product.price}</span>
                  <span className="ticket-tag">View item</span>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}

function FeaturedSkeleton() {
  return Array.from({ length: 3 }).map((_, i) => (
    <div className="ticket skeleton" key={i} aria-hidden="true">
      <span className="ticket-no skeleton-block" style={{ width: "48px", height: "12px" }} />
      <div className="ticket-media" />
      <div className="skeleton-block" style={{ height: "18px", width: "70%", margin: "4px 0" }} />
      <div className="skeleton-block" style={{ height: "14px", width: "90%", marginTop: "8px" }} />
    </div>
  ));
}

export default Home;
