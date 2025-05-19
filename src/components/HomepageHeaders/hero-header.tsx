import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function HeroHeader(): React.ReactElement {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>B</div>
        <div className={styles.logoText}>Bella</div>
      </div>
      <h1 className={styles.pageTitle}>AI开放平台</h1>
      
      {/* AI 旋转动画 */}
      <div className={styles.aiAnimationContainer}>
        <div className={styles.orbit}>
          <div className={styles.orbitParticle}></div>
          <div className={styles.orbitParticle}></div>
          <div className={styles.orbitParticle}></div>
        </div>
        <div className={styles.aiBox}>
          <div className={styles.aiText}>AI</div>
        </div>
      </div>
      
      <div className={styles.intro}>
      Bella是贝壳找房内部的一站式智能接入、智能体创建及发布平台，通过提供0代码解决方案、API集成、微调能力及插件式能力拓展等多层次、灵活性极高的服务
      </div>
      <Link to="/docs/intro" className={styles.ctaButton}>
          查看文档
          <span style={{ marginLeft: '0.5rem' }}>→</span>
        </Link>
    </header>
  );
}