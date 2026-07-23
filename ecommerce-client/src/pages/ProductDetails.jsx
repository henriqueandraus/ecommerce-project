import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const { cartId } = useCart();
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
    } catch (err) {
      setError("Failed to add item to cart.");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <img src={product.image_url} alt={product.name} width="300" />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <p>In stock: {product.stock_quantity}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductDetails;