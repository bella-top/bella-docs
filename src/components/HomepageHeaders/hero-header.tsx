import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function HeroHeader(): React.ReactElement {
  return (
    <div className={styles.heroSection}>
      <div className={styles.heroBackground}></div>
      
      <div className={styles.floatingElements}>
        <div className={styles.cube1}></div>
        <div className={styles.cube2}></div>
        <div className={styles.cube3}></div>
        <div className={styles.cube4}></div>
      </div>

      {/* 右侧3D AI元素 */}
      <div className={styles.aiElements}>
        <div className={styles.aiBoard}>
          <div className={styles.aiFront}>AI</div>
          <div className={styles.aiBack}>AI</div>
          <div className={styles.aiRight}>AI</div>
          <div className={styles.aiLeft}>AI</div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className={styles.heroContent}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <span className={styles.logoText}>B</span>
          </div>
          <div>
            <h1 className={styles.brandName}>Bella</h1>
            <p className={styles.subtitle}>AI开放平台</p>
          </div>
        </div>
        
        <p className={styles.description}>
          Bella是贝壳找房开源的一站式智能接入、智能体创建及发布平台，
          融合前沿AI技术，为企业提供智能高效的一站式数字化解决方案。
        </p>
        
        <Link to="/docs/intro" className={styles.ctaButton}>
          立即体验
          <span style={{ marginLeft: '0.5rem' }}>→</span>
        </Link>
      </div>

      {/* 特性网格 - 现在作为独立的块级元素 */}
      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>🌐</span>
          <div className={styles.featureTitle}>多元AI能力</div>
          <div className={styles.featureDesc}>整合文本、语音、图像等多种AI能力</div>
        </div>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>⚙️</span>
          <div className={styles.featureTitle}>生产级稳定</div>
          <div className={styles.featureDesc}>经过大规模生产环境验证</div>
        </div>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>🔌</span>
          <div className={styles.featureTitle}>灵活扩展</div>
          <div className={styles.featureDesc}>支持插件式能力拓展和API集成</div>
        </div>
      </div>
    </div>
  );
}