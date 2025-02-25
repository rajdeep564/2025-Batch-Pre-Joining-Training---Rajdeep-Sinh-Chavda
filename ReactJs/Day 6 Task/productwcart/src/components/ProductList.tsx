import React from "react";
import { Row, Col } from "antd";
import { Product } from "../product/ProductTypes";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products , setloadingforparent}) => {
  return (
    <Row
      gutter={[24, 24]}
      justify="center"
      
    >
      {products.map((product) => (
        <Col key={product.id} xs={24} sm={12} md={8} lg={6} xl={6}>
          <ProductCard product={product} setloadingforparent1 = {setloadingforparent} />
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;
