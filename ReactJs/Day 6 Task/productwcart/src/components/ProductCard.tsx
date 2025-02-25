import React, { useContext, useState } from "react";
import { Card, Button, Space, message, Spin } from "antd";
import { Product } from "../product/ProductTypes";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../cart/CartContext";
import { ProductContext } from "../product/ProductContext";

const { Meta } = Card;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product ,setloadingforparent1}) => {
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);
  const productContext = useContext(ProductContext);
  const [loading, setLoading] = useState(false);

  if (!cartContext || !productContext) {
    return null;
  }

  const { addToCart, state } = cartContext;
  const { deleteProduct } = productContext;
  const { cart } = state;

  // 🔹 Handle Add to Cart
  const handleAddToCart = () => {
    console.log("Current Cart:", cart);

    const isProductInCart = cart.some((item) => item.id === product.id);

    if (isProductInCart) {
      message.warning("Product already added!");
    } else {
      addToCart(product);
      message.success("Product added to cart!");
    }

    setTimeout(() => {
      console.log("Updated Cart after add:", cart);
    }, 500);
  };

  
  const handleDelete = () => {
    setLoading(true);
  
    setTimeout(() => {
      deleteProduct(product.id); 
      message.success("Product deleted successfully!"); 
      setLoading(false); 
    }, 1000); 
  };
  

  return (
    <Card
      hoverable
      cover={
        <img
          alt={product.name}
          src={`/assets/${product.image}`}
          style={{
            padding: "10px",
            height: 220,
            objectFit: "contain",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        />
      }
      style={{
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease-in-out",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Meta
        title={product.name}
        description={<span style={{ fontWeight: "bold", color: "#1677ff" }}>₹{product.price}</span>}
      />

      <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <Space style={{ display: "flex", justifyContent: "space-between" }}>
          <Button type="link" onClick={() => navigate(`/products/${product.id}`)}>
            View
          </Button>
          <Button type="dashed" onClick={() => navigate(`/products/edit/${product.id}`)}>
            Edit
          </Button>
        </Space>

        <Button type="primary" block onClick={handleAddToCart} style={{ marginTop: "8px" }}>
          Add to Cart
        </Button>

        
          <Button type="primary" danger block onClick={handleDelete} style={{ marginTop: "8px" }}>
            {setloadingforparent1(loading)}
            Delete
          </Button>
       
      </div>
    </Card>
  );
};

export default ProductCard;
