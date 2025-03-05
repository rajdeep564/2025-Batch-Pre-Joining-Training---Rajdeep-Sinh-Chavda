import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { BarChart3, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import CountUp from 'react-countup';
import styles from './LandingPage.module.scss';

const LandingPage: React.FC = () => {
  return (
    <div className={styles.landingPage}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Streamline Your Product Management</h1>
          <p className={styles.heroSubtitle}>
            A powerful, intuitive platform designed to help you manage your product inventory with ease.
            Track, analyze, and optimize your product catalog in one place.
          </p>
          <Link to="/products">
            <Button 
              type="primary" 
              size="large" 
              className={styles.ctaButton}
            >
              Get Started <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      <div className={styles.statsSection}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>
            <CountUp end={1000} duration={2} separator="," />+
          </div>
          <div className={styles.statLabel}>Products Managed</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>
            <CountUp end={98} duration={2} suffix="%" />
          </div>
          <div className={styles.statLabel}>Customer Satisfaction</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>
            <CountUp end={50} duration={2} suffix="%" />
          </div>
          <div className={styles.statLabel}>Time Saved</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>
            <CountUp end={24} duration={2} suffix="/7" />
          </div>
          <div className={styles.statLabel}>Support Available</div>
        </div>
      </div>

      <h2 className={styles.sectionTitle} id="features">Key Features</h2>
      <section className={styles.featureSection}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <BarChart3 size={24} />
          </div>
          <h3 className={styles.featureTitle}>Real-time Analytics</h3>
          <p className={styles.featureDescription}>
            Get instant insights into your product performance with our powerful analytics dashboard.
            Track inventory levels, sales trends, and more.
          </p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <ShieldCheck size={24} />
          </div>
          <h3 className={styles.featureTitle}>Secure Data</h3>
          <p className={styles.featureDescription}>
            Your product data is protected with enterprise-grade security. 
            Role-based access control ensures only authorized users can make changes.
          </p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <Zap size={24} />
          </div>
          <h3 className={styles.featureTitle}>Lightning Fast</h3>
          <p className={styles.featureDescription}>
            Our optimized platform ensures quick loading times and responsive interactions,
            even when managing thousands of products.
          </p>
        </div>
      </section>

      <div className={styles.ctaContainer}>
        <Link to="/products">
          <Button 
            type="primary" 
            size="large" 
            className={styles.ctaButton}
          >
            Explore Products <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;