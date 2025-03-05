import React from 'react';
import { Form, Input, InputNumber, Select, Button } from 'antd';
import { Product } from '../../types';
import styles from './ProductForm.module.scss';

interface ProductFormProps {
  initialValues?: Product;
  onSubmit: (values: Omit<Product, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const { Option } = Select;
const { TextArea } = Input;

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: Omit<Product, 'id' | 'createdAt'>) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
      className={styles.form}
    >
      <Form.Item
        name="name"
        label="Product Name"
        rules={[{ required: true, message: 'Please enter product name' }]}
      >
        <Input placeholder="Enter product name" />
      </Form.Item>

      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: 'Please select a category' }]}
      >
        <Select placeholder="Select a category">
          <Option value="Electronics">Electronics</Option>
          <Option value="Audio">Audio</Option>
          <Option value="Wearables">Wearables</Option>
          <Option value="Photography">Photography</Option>
          <Option value="Gaming">Gaming</Option>
          <Option value="Other">Other</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: 'Please enter price' }]}
      >
        <InputNumber
          min={0}
          step={0.01}
          precision={2}
          style={{ width: '100%' }}
          placeholder="Enter price"
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>

      <Form.Item
        name="stock"
        label="Stock"
        rules={[{ required: true, message: 'Please enter stock quantity' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter stock quantity" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter product description' }]}
      >
        <TextArea rows={4} placeholder="Enter product description" />
      </Form.Item>

      <div className={styles.formActions}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </Form>
  );
};

export default ProductForm;