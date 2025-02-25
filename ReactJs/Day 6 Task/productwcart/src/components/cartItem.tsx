import React from "react";
import { Button, Typography, Modal, message } from "antd";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "../cart/CartTypes";

const { Text } = Typography;
const { confirm } = Modal;

interface CartItemProps {
  item: CartItemType;
  onIncrement: (productId: number) => void;
  onDecrement: (productId: number) => void;
  onRemove: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onIncrement, onDecrement, onRemove }) => {
  
  const handleDecrement = () => {
    if (item.quantity === 1) {
      confirm({
        title: "Remove Product?",
        content: "Do you want to remove this product from the cart?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          onRemove(item.id);
          message.success(`${item.name} has been removed from your cart.`);
        },
      });
    } else {
      onDecrement(item.id);
      message.success(`Quantity of ${item.name} has been decreased.`);
    }
  };

  const handleIncrement = () => {
    onIncrement(item.id);
    message.success(`Quantity of ${item.name} has been increased.`);
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        marginBottom: "10px",
      }}
    >
   
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <img
          src={"/assets/"+item.image}
          alt={item.name}
          style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "contain" }}
        />
        <div>
          <Text strong style={{ fontSize: "16px" }}>{item.name}</Text>
          <p style={{ margin: "3px 0", fontSize: "14px", color: "#555" }}>₹{item.price.toFixed(2)}</p>
        </div>
      </div>

   
      <div style={{display:"flex", gap:"50px"}}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Button shape="circle" icon={<Minus size={18} />} onClick={handleDecrement} />
        <Text style={{ fontSize: "16px", minWidth: "20px", textAlign: "center" }}>{item.quantity}</Text>
        <Button shape="circle" icon={<Plus size={18} />} onClick={handleIncrement} />
      </div>

      
      <Button 
        type="text" 
        danger 
        icon={<Trash2 size={18} />} 
        onClick={() => {
          onRemove(item.id);
          message.success(`${item.name} has been removed from your cart.`);
        }}
      />
      </div>
    </div>
  );
};

export default CartItem;
