import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Space, Typography, Modal, Card } from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

export type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() =>
    JSON.parse(localStorage.getItem("products") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: "Are you sure?",
        content: "You won't be able to revert this!",
        okText: "Yes, delete it!",
        okType: "danger",
        cancelText: "Cancel",
        onOk: () => {
          const updatedProducts = products.filter((p) => p.id !== id);
          setProducts(updatedProducts);
          localStorage.setItem("products", JSON.stringify(updatedProducts));
          Modal.success({ title: "Deleted!", content: "Your product has been removed." });
        },
      });
    },
    [products]
  );

  const columns: ColumnsType<Product> = useMemo(
    () => [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Category", dataIndex: "category", key: "category" },
      { title: "Price", dataIndex: "price", key: "price", render: (price) => `₹${price}` },
      {
        title: "Actions",
        key: "actions",
        render: (_text, record) => (
          <Space size="middle">
            <Link to={`/view-product/${record.id}`}>
              <Button type="default" icon={<EyeOutlined />} style={{ borderRadius: "6px" }}>
                View
              </Button>
            </Link>
            <Link to={`/edit-product/${record.id}`}>
              <Button type="primary" icon={<EditOutlined />} style={{ borderRadius: "6px" }}>
                Edit
              </Button>
            </Link>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              style={{ borderRadius: "6px" }}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [handleDelete]
  );

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <Card
        style={{ width: "90%", maxWidth: "1200px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
        bordered={false}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <Title level={3} style={{ margin: 0 }}>📦 Product List</Title>
          <Link to="/add-product">
            <Button type="primary" icon={<PlusCircleOutlined />} style={{ borderRadius: "6px" }}>
              Add Product
            </Button>
          </Link>
        </div>
        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
        />
      </Card>
    </div>
  );
};

export default Products;
