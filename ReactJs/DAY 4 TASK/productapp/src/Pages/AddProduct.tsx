import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography } from "antd";
import Swal from "sweetalert2";

const { Title } = Typography;

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = useCallback(
    (values: { name: string; price: string; category: string }) => {
      if (!values.name || !values.price || !values.category) {
        Swal.fire("Error!", "All fields are required!", "error");
        return;
      }

      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const newProduct = {
        id: Date.now(),
        name: values.name,
        price: values.price,
        category: values.category,
      };

      localStorage.setItem(
        "products",
        JSON.stringify([...products, newProduct])
      );

      Swal.fire("Success!", "Product added successfully!", "success").then(() =>
        navigate("/products")
      );
    },
    [navigate]
  );

  return (
    <div
      style={{
        maxWidth: "60vw",
        margin: "50px auto",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <Title
        level={3}
        style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
      >
        Add New Product
      </Title>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Please enter a product name" }]}
        >
          <Input
            placeholder="Enter product name"
            size="large"
            style={{ borderRadius: "6px", padding: "8px" }}
          />
        </Form.Item>

        <Form.Item
          label="Product Price"
          name="price"
          rules={[{ required: true, message: "Please enter a product price" }]}
        >
          <Input
            type="number"
            placeholder="Enter product price"
            size="large"
            style={{ borderRadius: "6px", padding: "8px" }}
          />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please enter a category" }]}
        >
          <Input
            placeholder="Enter product category"
            size="large"
            style={{ borderRadius: "6px", padding: "8px" }}
          />
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
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#40a9ff")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#1890ff")
            }
          >
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
