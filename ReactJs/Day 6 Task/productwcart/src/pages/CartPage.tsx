import React from "react";
import { useCart } from "../cart/CartContext";
import CartItemComponent from "../components/cartItem";
import { Button, Card, Typography, message } from "antd";
import { ShoppingCart, Trash2 } from "lucide-react";

const { Title } = Typography;

const CartPage: React.FC = () => {
  const { state, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = useCart();

  // Handle clear cart action and display success message
  const handleClearCart = () => {
    clearCart();  // Clear the cart from the context
    message.success("All items have been removed from your cart.");  // Show success message
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      
      <Title
        level={2}
        style={{
          textAlign: "center",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <ShoppingCart size={30} /> Shopping Cart
      </Title>

      {/* If cart is empty */}
      {state.cart.length === 0 ? (
        <Title level={4} style={{ textAlign: "center", color: "#888" }}>
          Your cart is empty
        </Title>
      ) : (
        <div>
          {/* Display cart items */}
          {state.cart.map((item) => (
            <CartItemComponent
              key={item.id}
              item={item}
              onRemove={removeFromCart}
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
            />
          ))}
        </div>
      )}

      {/* Show the Clear Cart button if cart is not empty */}
      {state.cart.length > 0 && (
        <Card
          style={{
            marginTop: "20px",
            textAlign: "center",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          }}
        >
          <Title level={3}>Total: ₹{state.totalAmount.toFixed(2)}</Title>
          <Button
            type="primary"
            danger
            icon={<Trash2 size={18} />}
            onClick={handleClearCart}  // Handle click event
            style={{ marginTop: "10px", borderRadius: "5px" }}
          >
            Clear Cart
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CartPage;
