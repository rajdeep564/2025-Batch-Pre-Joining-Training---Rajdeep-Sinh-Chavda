import React, { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography } from "antd";
import Swal from "sweetalert2"; // Import SweetAlert
import { Product } from "./Products";

const { Title } = Typography;

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const product = products.find((p: Product) => p.id === Number(id));

  const handleSubmit = useCallback(
    (values: { name: string; price: string; category: string }) => {
      if (!values.name || !values.price || !values.category) {
        Swal.fire("Error!", "All fields are required!", "error"); // Show error alert
        return;
      }

      const updatedProducts = products.map((p: Product) =>
        p.id === Number(id)
          ? {
              ...p,
              name: values.name,
              price: values.price,
              category: values.category,
            }
          : p
      );

      localStorage.setItem("products", JSON.stringify(updatedProducts));

      Swal.fire("Success!", "Product updated successfully!", "success") // Show success alert
        .then(() => navigate("/products"));
    },
    [id, navigate, products]
  );

  return (
    <div
      style={{
        maxWidth: "60",
        margin: "50px auto",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <Title
        level={3}
        style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
      >
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
          <Input size="large" style={{ borderRadius: "6px", padding: "8px" }} />
        </Form.Item>

        <Form.Item
          label="Product Price"
          name="price"
          rules={[{ required: true, message: "Please enter a product price" }]}
        >
          <Input
            type="number"
            size="large"
            style={{ borderRadius: "6px", padding: "8px" }}
          />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please enter a category" }]}
        >
          <Input size="large" style={{ borderRadius: "6px", padding: "8px" }} />
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
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProduct;
