import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HeroHeader from '@site/src/components/HomepageHeaders/hero-header';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Bella是贝壳找房开源的一站式智能接入、智能体创建及发布平台">
      <HeroHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
