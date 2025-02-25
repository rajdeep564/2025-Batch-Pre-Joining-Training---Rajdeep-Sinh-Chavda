import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Typography, Button, Empty } from "antd";
import { Product } from "../Products";

const { Title } = Typography;

const ViewProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  
  const product = useMemo(() => {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    return products.find((p: Product) => p.id === Number(id));
  }, [id]);


  const columns = [
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];


  const dataSource = product
    ? [
        { key: "1", property: "ID", value: product.id },
        { key: "2", property: "Name", value: product.name },
        { key: "3", property: "Price", value: `₹${product.price}` },
        { key: "4", property: "Category", value: product.category },
      ]
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
        Product Details
      </Title>

      {product ? (
        <>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered
            style={{ width: "50%", minWidth: "400px", overflowX:scroll}}
          />
          <Button
            type="primary"
            block
            onClick={() => navigate("/products")}
            style={{
              marginTop: "20px",
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
            Back to Products
          </Button>
        </>
      ) : (
        <Empty description="Product Not Found" style={{ textAlign: "center" }} />
      )}
    </div>
  );
};

export default ViewProduct;
