import React from 'react';
import { Divider } from 'antd';
import { Product } from '../../types';
import styles from './ProductView.module.scss';

interface ProductViewProps {
  product: Product;
}

const ProductView: React.FC<ProductViewProps> = ({ product }) => {
  return (
    <div className={styles.productView}>
      <div className={styles.field}>
        <span className={styles.label}>Product Name</span>
        <span className={styles.value}>{product.name}</span>
      </div>
      
      <Divider style={{ margin: '8px 0' }} />
      
      <div className={styles.field}>
        <span className={styles.label}>Category</span>
        <span className={styles.value}>{product.category}</span>
      </div>
      
      <Divider style={{ margin: '8px 0' }} />
      
      <div className={styles.field}>
        <span className={styles.label}>Price</span>
        <span className={styles.value}>${product.price.toFixed(2)}</span>
      </div>
      
      <Divider style={{ margin: '8px 0' }} />
      
      <div className={styles.field}>
        <span className={styles.label}>Stock</span>
        <span className={styles.value}>{product.stock} units</span>
      </div>
      
      <Divider style={{ margin: '8px 0' }} />
      
      <div className={styles.field}>
        <span className={styles.label}>Created At</span>
        <span className={styles.value}>
          {new Date(product.createdAt).toLocaleDateString()} at {new Date(product.createdAt).toLocaleTimeString()}
        </span>
      </div>
      
      <Divider style={{ margin: '8px 0' }} />
      
      <div className={styles.field}>
        <span className={styles.label}>Description</span>
        <span className={`${styles.value} ${styles.description}`}>{product.description}</span>
      </div>
    </div>
  );
};

export default ProductView;