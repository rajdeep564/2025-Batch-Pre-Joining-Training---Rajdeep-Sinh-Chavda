import React from "react";
import { Form, Input, InputNumber, Button } from "antd";
import { Product } from "../product/ProductTypes";

interface ProductFormProps {
  initialValues?: Product;
  onSubmit: (values: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit} initialValues={initialValues}>
      <Form.Item name="name" label="Product Name" rules={[{ required: true, message: "Enter product name" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="price" label="Price" rules={[{ required: true, message: "Enter price" }]}>
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="image" label="Image URL">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Save</Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
