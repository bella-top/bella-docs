import React, { useMemo, useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';
import { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import projectsData from '../../config/projects-data.json';
import styles from './api-viewer.module.css';

// 项目类型的显示名称和顺序
const typeConfig = {
  gateway: { name: '网关层', order: 1 },
  endpoint: { name: '能力层', order: 2 },
  infer: { name: '推理服务层', order: 3 },
  model: { name: '模型层', order: 4 },
  application: { name: '应用层', order: 5 }
};

// 项目卡片组件
function ProjectCard({ project }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const needsMoreButton = project.description.length > 60;
  
  return (
    <div className={`${styles.projectCard} ${styles[`module-${project.type}`]}`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{project.name}</h3>
        <span className={`${styles.statusBadge} ${styles[project.status]}`}>
          {project.status === 'released' ? '已发布' : '即将推出'}
        </span>
      </div>
      <div className={styles.cardContentWrapper}>
        <p className={`${styles.cardDescription} ${isExpanded ? styles.cardDescriptionExpanded : styles.cardDescriptionCollapsed}`}>
          {project.description}
        </p>
        {needsMoreButton && (
          <button 
            className={styles.moreButton} 
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
            aria-label={isExpanded ? '收起详情' : '查看更多详情'}
          >
            {isExpanded ? '收起' : '更多'} 
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      {project.apiDocPath && project.status === 'released' ? (
        <Link 
          to={`/api-docs/${project.id}`} 
          className={`${styles.viewButton} ${styles.activeButton}`}
        >
          查看 API 文档
        </Link>
      ) : (
        <div 
          className={`${styles.viewButton} ${styles.disabledButton}`}
          title="即将推出"
        >
          查看 API 文档
        </div>
      )}
    </div>
  );
}

export default function ApiViewerPage() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale;
  
  // 按照类型分组项目
  const projectsByType = useMemo(() => {
    const groupedProjects = {};
    
    // 初始化所有类型的数组
    Object.keys(typeConfig).forEach(type => {
      groupedProjects[type] = [];
    });
    
    projectsData.projects.forEach(project => {
      if (project.type && groupedProjects[project.type]) {
        groupedProjects[project.type].push(project);
      }
    });
    
    // 过滤掉空的类型
    Object.keys(groupedProjects).forEach(type => {
      if (groupedProjects[type].length === 0) {
        delete groupedProjects[type];
      }
    });
    
    return groupedProjects;
  }, []);
  
  // 按照类型顺序排列的层级
  const orderedLayers = useMemo(() => {
    return Object.entries(typeConfig)
      .sort((a, b) => a[1].order - b[1].order)
      .map(([type]) => type)
      .filter(type => projectsByType[type] && projectsByType[type].length > 0);
  }, [projectsByType]);
  
  return (
    <Layout
      title={translate({
        id: 'pages.apiViewer.title',
        message: 'API 文档',
      })}
      description={translate({
        id: 'pages.apiViewer.description',
        message: 'Bella API 完整文档',
      })}>
      <div className={styles.apiViewerContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>API 文档</h1>
        </div>
        
        <div className={styles.typeLevels}>
          {orderedLayers.map((type) => (
            <div key={type} className={styles.typeLevel}>
              <div className={styles.levelTitleContainer}>
                <h2 className={`${styles.levelTitle} ${styles[`levelTitle-${type}`]}`}>
                  {typeConfig[type]?.name || type}
                </h2>
              </div>
              <div className={styles.levelProjectsContainer}>
                <div className={styles.levelProjects}>
                  {projectsByType[type]?.map(project => (
                    <div 
                      key={project.id} 
                      className={styles.projectCardWrapper}
                    >
                      <ProjectCard project={project} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}