import { Link } from "react-router-dom";
import "./Product.css";

function Product({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-media">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <span className="product-media-fallback">No image</span>
        )}
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-desc">{product.description}</p>
      <span className="product-price">${product.price}</span>
    </Link>
  );
}

export default Product;
