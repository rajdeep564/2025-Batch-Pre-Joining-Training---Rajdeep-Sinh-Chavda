import React, { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Modal, Card } from "antd";
import { Product } from "../Products";

const { Title } = Typography;

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const product = products.find((p: Product) => p.id === Number(id));

  const showModal = (type: "success" | "error", message: string) => {
    Modal[type]({
      title: type === "success" ? "Success!" : "Error!",
      content: message,
      onOk: () => type === "success" && navigate("/products"),
    });
  };

  const handleSubmit = useCallback(
    (values: { name: string; price: string; category: string }) => {
      const { name, price, category } = values;

      if (!name || !price || !category) {
        showModal("error", "All fields are required!");
        return;
      }

      if (parseFloat(price) <= 0) {
        showModal("error", "Price must be a positive number.");
        return;
      }

      const updatedProducts = products.map((p: Product) =>
        p.id === Number(id) ? { ...p, name, price, category } : p
      );

      localStorage.setItem("products", JSON.stringify(updatedProducts));

      showModal("success", "Product updated successfully!");
    },
    [id, navigate, products]
  );

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <Card
        style={{
          width: "90%",
          maxWidth: "600px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          borderRadius: "10px",
          padding: "20px",
        }}
        bordered={false}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
          Edit Product
        </Title>
        <Form
          form={form}
          initialValues={{
            name: product?.name,
            price: product?.price?.toString(),
            category: product?.category,
          }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Please enter a product name" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Product Price"
            name="price"
            rules={[
              { required: true, message: "Please enter a product price" },
              { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "Enter a valid price" },
            ]}
          >
            <Input type="number" size="large" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please enter a category" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              style={{
                fontSize: "16px",
                borderRadius: "6px",
                padding: "10px",
                backgroundColor: "#1890ff",
                border: "none",
                transition: "0.3s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#40a9ff")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1890ff")}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditProduct;
