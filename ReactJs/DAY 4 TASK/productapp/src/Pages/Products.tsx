import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Space, Typography } from "antd";
import Swal from "sweetalert2";

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
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedProducts = products.filter((p) => p.id !== id);
          setProducts(updatedProducts);
          localStorage.setItem("products", JSON.stringify(updatedProducts));

          Swal.fire("Deleted!", "Your product has been deleted.", "success");
        }
      });
    },
    [products]

  
  );

  const columns: ColumnsType<Product> = useMemo(
    () => [
      { title: "ID", dataIndex: "id", key: "id" },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Category", dataIndex: "category", key: "category" },
      { title: "Price", dataIndex: "price", key: "price" },
      {
        title: "Actions",
        key: "actions",
        render: (_text, record) => (
          <Space size="middle">
            <Link to={`/view-product/${record.id}`}>
              <Button type="primary" ghost>
                View
              </Button>
            </Link>
            <Link to={`/edit-product/${record.id}`}>
              <Button type="default">Edit</Button>
            </Link>
            <Button
              type="primary"
              danger
              onClick={() => handleDelete(record.id)}
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
    <div style={{ margin: "50px" }}>
      <Title level={3} style={{ marginBottom: "20px", textAlign: "center" }}>
        Product List
      </Title>
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default Products;
