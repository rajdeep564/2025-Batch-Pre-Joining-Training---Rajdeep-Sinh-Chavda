import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "../product/ProductContext";
import ProductList from "../components/ProductList";
import { Typography, Spin } from "antd";

const { Title } = Typography;

const Products: React.FC = () => {
  const { products } = useContext(ProductContext)!;
  const [loading, setLoading] = useState(true);
  console.log(products);

  useEffect(() => {
  
    const timer = setTimeout(() => setLoading(false), 1000);

    return () => clearTimeout(timer);
  }, [products]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Title level={2} style={{ color: "#333", marginBottom: "20px" }}>
        Explore Our Products
      </Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <ProductList products={products} setloadingforparent = {setLoading}/>
      )}
    </div>
  );
};

export default Products;
 