import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = useCallback(
    (values: { name: string; price: string; category: string }) => {
      const { name, price, category } = values;

      if (!name || !price || !category) {
        notification.error({
          message: "Validation Error",
          description: "All fields are required!",
        });
        return;
      }

      if (parseFloat(price) <= 0) {
        notification.error({
          message: "Invalid Price",
          description: "Price must be a positive number.",
        });
        return;
      }

      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const newProduct = {
        id: Date.now(),
        name,
        price,
        category,
      };

      localStorage.setItem("products", JSON.stringify([...products, newProduct]));

      notification.success({
        message: "Product Added",
        description: `"${name}" has been successfully added.`,
        placement: "topRight",
      });

      setTimeout(() => navigate("/products"), 1000); // Redirect after 1s
    },
    [navigate]
  );

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <Card
        style={{ width: "90%", maxWidth: "600px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
        bordered={false}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
          <PlusOutlined /> Add New Product
        </Title>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Please enter a product name" }]}
          >
            <Input placeholder="Enter product name" size="large" />
          </Form.Item>

          <Form.Item
            label="Product Price"
            name="price"
            rules={[
              { required: true, message: "Please enter a product price" },
              { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "Enter a valid price" },
            ]}
          >
            <Input type="number" placeholder="Enter product price" size="large" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please enter a category" }]}
          >
            <Input placeholder="Enter product category" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProduct;
