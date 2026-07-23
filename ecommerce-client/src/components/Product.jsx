import { Link } from "react-router-dom";

function Product({ product }) {
  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{ border: "1px solid #ccc", padding: "1rem", margin: "0.5rem" }}>
        <img src={product.image_url} alt={product.name} width="150" />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>${product.price}</p>
      </div>
    </Link>
  );
}

export default Product;