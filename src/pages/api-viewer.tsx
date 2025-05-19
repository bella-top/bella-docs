import React, { useMemo, useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';
import { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import projectsData from '../../config/projects-data.json';
import styles from './api-viewer.module.css';

// 项目类型的显示名称和顺序
const typeConfig = {
  gateway: { 
    name: translate({
      id: 'architecture.layer.gateway',
      message: '网关层',
      description: 'Gateway layer name in architecture diagram'
    }), 
    order: 1 
  },
  endpoint: { 
    name: translate({
      id: 'architecture.layer.endpoint',
      message: '能力层',
      description: 'Endpoint layer name in architecture diagram'
    }), 
    order: 2 
  },
  infer: { 
    name: translate({
      id: 'architecture.layer.infer',
      message: '推理服务层',
      description: 'Inference layer name in architecture diagram'
    }), 
    order: 3 
  },
  model: { 
    name: translate({
      id: 'architecture.layer.model',
      message: '模型层',
      description: 'Model layer name in architecture diagram'
    }), 
    order: 4 
  },
  application: { 
    name: translate({
      id: 'architecture.layer.application',
      message: '应用层',
      description: 'Application layer name in architecture diagram'
    }), 
    order: 5 
  }
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
          {project.status === 'released' ? 
            translate({
              id: 'project.status.released',
              message: '已发布',
              description: 'Released project status'
            }) : 
            translate({
              id: 'project.status.upcoming',
              message: '即将推出',
              description: 'Upcoming project status'
            })
          }
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
            aria-label={isExpanded ? 
              translate({
                id: 'project.description.collapse',
                message: '收起详情',
                description: 'Collapse description button aria label'
              }) : 
              translate({
                id: 'project.description.expand',
                message: '查看更多详情',
                description: 'Expand description button aria label'
              })
            }
          >
            {isExpanded ? 
              translate({
                id: 'project.description.collapse.button',
                message: '收起',
                description: 'Collapse button text'
              }) : 
              translate({
                id: 'project.description.expand.button',
                message: '更多',
                description: 'Expand button text'
              })
            } 
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
          {translate({
            id: 'project.api.view',
            message: '查看 API 文档',
            description: 'View API documentation button'
          })}
        </Link>
      ) : (
        <div 
          className={`${styles.viewButton} ${styles.disabledButton}`}
          title={translate({
            id: 'project.api.upcoming',
            message: '即将推出',
            description: 'Upcoming API documentation tooltip'
          })}
        >
          {translate({
            id: 'project.api.view',
            message: '查看 API 文档',
            description: 'View API documentation button'
          })}
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
        // 根据当前语言选择正确的描述字段
        const localizedProject = {
          ...project,
          description: currentLocale === 'en' && project.en_description 
            ? project.en_description 
            : project.description
        };
        groupedProjects[project.type].push(localizedProject);
      }
    });
    
    // 过滤掉空的类型
    Object.keys(groupedProjects).forEach(type => {
      if (groupedProjects[type].length === 0) {
        delete groupedProjects[type];
      }
    });
    
    return groupedProjects;
  }, [currentLocale]);
  
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
          <h1 className={styles.title}>
            {translate({
              id: 'pages.apiViewer.heading',
              message: 'API 文档',
              description: 'API documentation page heading'
            })}
          </h1>
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