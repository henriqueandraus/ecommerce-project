import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import ProductList from "../components/ProductList";

function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products.");
      }
    }

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ProductList products={products} />
    </div>
  );
}

export default Products;