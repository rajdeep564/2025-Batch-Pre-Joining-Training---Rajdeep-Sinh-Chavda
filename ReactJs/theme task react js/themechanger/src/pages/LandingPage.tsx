import React from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "antd";
import { useTheme } from "../context/ThemeContext";
import styles from "./LandingPage.scss";

const LandingPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className={`${styles.landing} ${isDarkMode ? styles.dark : styles.light}`}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <h1>Effortless Product Management</h1>
        <p>Streamline your workflow with our intuitive and powerful product management system.</p>
        <Link to="/products">
          <Button type="primary" size="large">Get Started</Button>
        </Link>
      </header>
      
      {/* Features Section */}
      <section className={styles.features}>
        <h2>Why Choose Us?</h2>
        <div className={styles.featureGrid}>
          <Card title="Seamless Product Management" className={styles.card}>
            Easily add, edit, and remove products with a simple and intuitive interface.
          </Card>
          <Card title="Dark & Light Mode" className={styles.card}>
            Enjoy a comfortable experience with our adaptive theme switching feature.
          </Card>
          <Card title="Real-Time Updates" className={styles.card}>
            Stay up to date with instant updates and seamless data synchronization.
          </Card>
          <Card title="User-Friendly Design" className={styles.card}>
            Experience a clean and modern UI designed for maximum efficiency.
          </Card>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <h2>What Our Users Say</h2>
        <div className={styles.testimonialGrid}>
          <Card className={styles.testimonial}>
            "This app transformed the way I manage my inventory. A must-have!" - Alex J.
          </Card>
          <Card className={styles.testimonial}>
            "Sleek design and powerful features. Love the dark mode!" - Maria K.
          </Card>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2025 Product Manager | Built with ❤️ for seamless productivity.</p>
      </footer>
    </div>
  );
};

export default LandingPage;