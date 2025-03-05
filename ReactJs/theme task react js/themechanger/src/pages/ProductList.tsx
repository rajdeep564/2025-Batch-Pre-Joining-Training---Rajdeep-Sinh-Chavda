import React, { useState } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./ProductList.module.scss";

type Product = {
  id: number;
  name: string;
  price: number;
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Laptop", price: 1200 },
    { id: 2, name: "Phone", price: 800 },
  ]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        setProducts(products.map((prod) => (prod.id === editingProduct.id ? { ...prod, ...values } : prod)));
      } else {
        setProducts([...products, { id: Date.now(), ...values }]);
      }
      setIsModalOpen(false);
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price", render: (price: number) => `$${price}` },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className={styles.addButton}>
        Add Product
      </Button>

      <Table
        className={styles.table}
        dataSource={products}
        columns={columns}
        rowKey="id"
        scroll={{ y: 300 }}
      />

      <Modal title={editingProduct ? "Edit Product" : "Add Product"} open={isModalOpen} onOk={handleSave} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductList;
