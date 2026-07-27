import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const { cartId, refreshCartCount } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product.");
      }
    }

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!cartId) {
      navigate("/login");
      return;
    }

    try {
      await addToCart(cartId, product.id, 1);
      await refreshCartCount(cartId);
    } catch (err) {
      setError("Failed to add item to cart.");
    }
  };

  if (error) return <p className="product-details-status">{error}</p>;
  if (!product) return <p className="product-details-status">Loading...</p>;

  return (
    <div className="product-details">
      <div className="product-details-media">
        <img src={product.image_url} alt={product.name} loading="lazy" />
      </div>
      <div className="product-details-info">
        <div className="product-details-info-inner">
          <h1 className="product-details-name">{product.name}</h1>

          <div className="product-details-price-block">
            <span className="product-details-price">${product.price}</span>
            <span className="product-details-stock">In stock: {product.stock_quantity}</span>
          </div>

          <button className="product-details-cta" onClick={handleAddToCart}>
            <ShoppingCart size={18} strokeWidth={2} />
            Add to Cart
          </button>

          <div className="product-details-description">
            <span className="eyebrow">Description</span>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
