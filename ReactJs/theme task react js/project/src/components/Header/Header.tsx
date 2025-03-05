import React from 'react';
import { Layout } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Package } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Header.module.scss';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <AntHeader className={styles.header}>
      <div className={styles.logo}>
        <Package size={24} />
        <span>Product Manager</span>
      </div>
      <div className={styles.nav}>
        <Link 
          to="/" 
          className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
        >
          Home
        </Link>
        <Link 
          to="/products" 
          className={`${styles.navLink} ${location.pathname === '/products' ? styles.active : ''}`}
        >
          Products
        </Link>
      </div>
      <div className={styles.actions}>
        <div className={styles.themeToggle} onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;