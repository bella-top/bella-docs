import React from 'react';
import styles from './styles.module.css';

export default function FeatureCards(): React.ReactElement {
  return (
    <section className={styles.featureGrid}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>🌐</div>
        <h3 className={styles.featureTitle}>多元AI能力</h3>
        <p className={styles.featureDesc}>经典文本、语音、图像等多AI能力</p>
      </div>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>⚙️</div>
        <h3 className={styles.featureTitle}>生产级稳定</h3>
        <p className={styles.featureDesc}>经过大规模生产环境验证</p>
      </div>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>🔌</div>
        <h3 className={styles.featureTitle}>灵活扩展</h3>
        <p className={styles.featureDesc}>支持插件式能力扩展和API集成</p>
      </div>
    </section>
  );
}
