import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import styles from './Footer.module.scss';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  return (
    <AntFooter className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLogo}>
          <Package size={18} />
          <span>Product Manager</span>
        </div>
        <div className={styles.footerLinks}>
          <Link to="/" className={styles.footerLink}>Home</Link>
          <Link to="/products" className={styles.footerLink}>Products</Link>
          <Link to="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
          <Link to="/terms-of-service" className={styles.footerLink}>Terms of Service</Link>
        </div>
        <div>
          Product Manager ©{new Date().getFullYear()} Created with React, TypeScript & Ant Design
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;