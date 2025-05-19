import React from 'react';
import { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

export default function FeatureCards(): React.ReactElement {
  return (
    <section className={styles.featureGrid}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>🌐</div>
        <h3 className={styles.featureTitle}>{translate({
          id: 'homepage.features.multiAI.title',
          message: '多元AI能力',
          description: 'Multi-AI capabilities feature title'
        })}</h3>
        <p className={styles.featureDesc}>{translate({
          id: 'homepage.features.multiAI.description',
          message: '经典文本、语音、图像等多AI能力',
          description: 'Multi-AI capabilities feature description'
        })}</p>
      </div>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>⚙️</div>
        <h3 className={styles.featureTitle}>{translate({
          id: 'homepage.features.stable.title',
          message: '生产级稳定',
          description: 'Production-grade stability feature title'
        })}</h3>
        <p className={styles.featureDesc}>{translate({
          id: 'homepage.features.stable.description',
          message: '经过大规模生产环境验证',
          description: 'Production-grade stability feature description'
        })}</p>
      </div>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>🔌</div>
        <h3 className={styles.featureTitle}>{translate({
          id: 'homepage.features.flexible.title',
          message: '灵活扩展',
          description: 'Flexible extension feature title'
        })}</h3>
        <p className={styles.featureDesc}>{translate({
          id: 'homepage.features.flexible.description',
          message: '支持插件式能力扩展和API集成',
          description: 'Flexible extension feature description'
        })}</p>
      </div>
    </section>
  );
}
