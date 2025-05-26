import React, { useState, useMemo, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import projectsData from '../../../config/projects-data.json';
import FeatureCards from './feature-cards';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// 从 JSON 文件中获取项目列表
const projects = projectsData.projects as [];

// 定义项目状态和类型
type ProjectStatus = 'released' | 'upcoming';
type ProjectType = 'gateway' | 'endpoint' | 'application' | 'infer' | 'model';

// 项目类型定义
interface Dependency {
  project: string;
  endpoints: string[] | string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  en_description: string;
  status: ProjectStatus;
  type: ProjectType;
  github?: string;
  link?: string;
  apiDocPath?: string;
  documentationLink?: string;
  deepwiki?: string;
  en_deepwiki?: string;
  dependency?: Dependency[];
  dependencies?: Dependency[];
}

// 获取项目的依赖项
const getProjectDependencies = (project: Project): Dependency[] => {
  return project.dependencies || project.dependency || [];
};

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

// 架构图模块组件
const ArchitectureModule: React.FC<{
  project: Project;
  onClick: () => void;
  isSelected: boolean;
  width: number;
}> = ({ project, onClick, isSelected, width }) => {
  
  // 根据项目状态设置不同的样式
  const moduleClasses = [
    styles.architectureModule,
    project.status === 'released' ? styles.releasedModule : styles.upcomingModule,
    styles[`module-${project.type}`],
    isSelected ? styles.selectedModule : ''
  ].join(' ');

  return (
    <div 
      className={moduleClasses} 
      onClick={onClick}
      style={{ width: `${width}px` }}
    >
      <div className={styles.moduleHeader}>
        <h3>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ marginRight: '8px' }}>
              <img 
                style={{ width: '16px', height: 'auto', verticalAlign: 'middle' }} 
                src="./img/github/github-mark.svg" 
                alt="GitHub" 
              />
            </a>
          )}
          {project.name}
        </h3>
        {project.status === 'released' && (
          <div className={`${styles.statusBadge} ${styles[`status-${project.status}`]}`}>
            {translate({
              id: 'project.status.released',
              message: '已发布',
              description: 'Released project status'
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// 架构图组件
const ArchitectureDiagram: React.FC<{
  projects: Project[];
}> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  
  // 计算依赖关系
  const dependencyMap = useMemo(() => {
    const map: {[key: string]: {dependsOn: string[], endpoints: {[key: string]: string[] | string}}} = {};
    
    projects.forEach(project => {
      if (!map[project.id]) {
        map[project.id] = { dependsOn: [], endpoints: {} };
      }
      
      // 处理依赖项
      const dependencies = getProjectDependencies(project);
      dependencies.forEach(dep => {
        if (!map[project.id].dependsOn.includes(dep.project)) {
          map[project.id].dependsOn.push(dep.project);
          map[project.id].endpoints[dep.project] = dep.endpoints;
        }
      });
    });
    
    return map;
  }, [projects]);
  
  // 按照类型分组项目
  const projectsByType = useMemo(() => {
    const groupedProjects: {[key in ProjectType]?: Project[]} = {};
    
    // 初始化所有类型的数组
    Object.keys(typeConfig).forEach(type => {
      groupedProjects[type as ProjectType] = [];
    });
    
    projects.forEach(project => {
      if (project.type && groupedProjects[project.type]) {
        groupedProjects[project.type]!.push(project);
      } else {
        // 如果类型不明确，默认放到能力层
        if (!groupedProjects.endpoint) {
          groupedProjects.endpoint = [];
        }
        groupedProjects.endpoint.push({
          ...project,
          type: 'endpoint'
        });
      }
    });
    
    // 过滤掉空的类型
    Object.keys(groupedProjects).forEach(type => {
      if (groupedProjects[type as ProjectType]!.length === 0) {
        delete groupedProjects[type as ProjectType];
      }
    });
    
    return groupedProjects;
  }, [projects]);
  
  // 按照类型顺序排列的层级
  const orderedLayers = useMemo(() => {
    return Object.entries(typeConfig)
      .sort((a, b) => a[1].order - b[1].order)
      .map(([type]) => type as ProjectType)
      .filter(type => projectsByType[type] && projectsByType[type]!.length > 0);
  }, [projectsByType]);
  
  // 根据每层的模块数量计算宽度
  const getModuleWidth = (type: ProjectType): number => {
    const count = projectsByType[type]?.length || 0;
    
    // 根据数量动态调整宽度
    if (count === 1) {
      return 260; // 增加模块宽度
    } else if (count === 2) {
      return 220; // 增加模块宽度
    } else {
      return 200; // 增加模块宽度
    }
  };
  
  // 处理模块点击
  const handleModuleClick = (projectId: string) => {
    setSelectedProject(selectedProject === projectId ? null : projectId);
  };

  // 处理点击事件，如果点击的是详情面板外部，则关闭详情面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 如果没有选中项目，不需要处理
      if (!selectedProject) return;
      
      // 如果点击的是详情面板内部，不关闭
      if (detailsRef.current && detailsRef.current.contains(event.target as Node)) {
        return;
      }
      
      // 如果点击的是模块，不关闭（因为模块点击会触发 handleModuleClick）
      const moduleElements = document.querySelectorAll(`.${styles.architectureModule}`);
      //@ts-ignore
      for (const moduleElement of moduleElements) {
        if (moduleElement.contains(event.target as Node)) {
          return;
        }
      }
      
      // 其他情况，关闭详情面板
      setSelectedProject(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedProject]);

  // 渲染项目详情面板
  const renderProjectDetails = () => {
    if (!selectedProject) return null;
    
    const project = projects.find(p => p.id === selectedProject);
    if (!project) return null;
    
    // 获取当前语言
    const { i18n } = useDocusaurusContext();
    const currentLocale = i18n.currentLocale;
    
    // 找出此项目调用的项目
    const callingTo = dependencyMap[project.id]?.dependsOn.map(id => {
      const targetProject = projects.find(p => p.id === id);
      return {
        project: targetProject,
        endpoints: dependencyMap[project.id].endpoints[id]
      };
    }).filter(item => item.project) || [];
    
    // 找出调用此项目的项目
    const calledBy = Object.entries(dependencyMap)
      .filter(([id, { dependsOn }]) => dependsOn.includes(project.id))
      .map(([id, { endpoints }]) => {
        const sourceProject = projects.find(p => p.id === id);
        return {
          project: sourceProject,
          endpoints: endpoints[project.id]
        };
      }).filter(item => item.project);
    
    return (
      <div 
        ref={detailsRef}
        className={styles.projectDetails} 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '350px',
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: '-5px 0 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          overflowY: 'auto',
          zIndex: 1000,
          borderLeft: '1px solid #E5E7EB'
        }}
      >
        <div className={styles.detailsHeader}>
          <h2>{project.name}</h2>
          <span className={`${styles.detailsStatus} ${styles[project.status]}`}>
            {translate({
              id: 'project.status.' + project.status,
              message: project.status === 'released' ? '已发布' : '待发布',
              description: 'Project status'
            })}
          </span>
        </div>
        
        <div className={styles.detailsTypeSection}>
          <span className={styles.detailsTypeLabel}>{translate({
            id: 'project.type.label',
            message: '类型:',
            description: 'Project type label'
          })}</span>
          <span className={`${styles.detailsTypeValue} ${styles[`type-${project.type}`]}`}>
            {typeConfig[project.type]?.name || project.type}
          </span>
        </div>
        
        <p className={styles.detailsDescription}>
          {currentLocale === 'en' && project.en_description ? project.en_description : project.description}
        </p>
        
        <div className={styles.detailsButtons}>
          {project.github && (
            <a 
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubButton}
            >
              {translate({
                id: 'project.github.button',
                message: 'GitHub',
                description: 'GitHub button'
              })}
            </a>
          )}
          
          {((currentLocale === 'en' && project.en_deepwiki) || (currentLocale !== 'en' && project.deepwiki)) && (
            <a 
              href={currentLocale === 'en' ? project.en_deepwiki : project.deepwiki}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.deepwikiButton}
            >
              {translate({
                id: 'project.deepwiki.button',
                message: 'DeepWiki',
                description: 'DeepWiki button'
              })}
            </a>
          )}
          
          {project.status === 'released' && (
            <>
              {project.link && (
                <a 
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.visitButton}
                >
                  {translate({
                    id: 'project.visit.button',
                    message: '快速体验',
                    description: 'Visit button'
                  })}
                </a>
              )}
              
              {project.documentationLink && (
                <a 
                  href={project.documentationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.docsButton}
                >
                  {translate({
                    id: 'project.docs.button',
                    message: '查看文档',
                    description: 'Docs button'
                  })}
                </a>
              )}
            </>
          )}
        </div>
        
        <div className={styles.dependencySection}>
          <h3>{translate({
            id: 'project.dependencies.title',
            message: '调用接口:',
            description: 'Dependencies title'
          })}</h3>
          {callingTo.length > 0 ? (
            <ul className={styles.dependencyList}>
              {callingTo.map(({ project, endpoints }) => project && (
                <li key={project.id}>
                  <div className={styles.dependencyItem}>
                    <div className={styles.dependencyItemHeader}>
                      <span className={styles.dependencyName}>
                        {project.name}
                      </span>
                      <span className={`${styles.dependencyItemType} ${styles[`type-${project.type}`]}`}>
                        {typeConfig[project.type]?.name || project.type}
                      </span>
                    </div>
                    <div className={styles.dependencyEndpoints}>
                      <strong>{translate({
                        id: 'project.dependencies.endpoints',
                        message: '接口:',
                        description: 'Endpoints label'
                      })}</strong>
                      <span>
                        {Array.isArray(endpoints) 
                          ? endpoints.join(', ')
                          : endpoints.toString()}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noDependencies}>{translate({
              id: 'project.dependencies.none',
              message: '不调用其他模块',
              description: 'No dependencies'
            })}</p>
          )}
          
          <h3>{translate({
            id: 'project.calledBy.title',
            message: '被调用:',
            description: 'Called by title'
          })}</h3>
          {calledBy.length > 0 ? (
            <ul className={styles.dependencyList}>
              {calledBy.map(({ project, endpoints }) => project && (
                <li key={project.id}>
                  <div className={styles.dependencyItem}>
                    <div className={styles.dependencyItemHeader}>
                      <span className={styles.dependencyName}>
                        {project.name}
                      </span>
                      <span className={`${styles.dependencyItemType} ${styles[`type-${project.type}`]}`}>
                        {typeConfig[project.type]?.name || project.type}
                      </span>
                    </div>
                    <div className={styles.dependencyEndpoints}>
                      <strong>{translate({
                        id: 'project.dependencies.endpoints',
                        message: '接口:',
                        description: 'Endpoints label'
                      })}</strong>
                      <span>
                        {Array.isArray(endpoints) 
                          ? endpoints.join(', ')
                          : endpoints.toString()}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noDependencies}>{translate({
              id: 'project.calledBy.none',
              message: '无',
              description: 'No called by'
            })}</p>
          )}
        </div>
        
        <button 
          className={styles.closeButton}
          onClick={() => setSelectedProject(null)}
        >
          {translate({
            id: 'project.details.close',
            message: '关闭',
            description: 'Close button'
          })}
        </button>
      </div>
    );
  };

  return (
    <div ref={diagramRef}>
      {/* 架构图层级布局 */}
      <div className={styles.architectureLevels}>
        {orderedLayers.map((type) => {
          const moduleWidth = getModuleWidth(type);
          
          return (
            <div key={type} className={styles.architectureLevel}>
              <div className={styles.levelTitleContainer}>
                <h2 className={`${styles.levelTitle} ${styles[`levelTitle-${type}`]}`}>
                  {typeConfig[type]?.name || type}
                </h2>
              </div>
              <div className={styles.levelModulesContainer}>
                <div className={styles.levelModules}>
                  {projectsByType[type]?.map(project => (
                    <div 
                      key={project.id} 
                      className={styles.moduleWrapper}
                      data-module-id={project.id}
                    >
                      <ArchitectureModule
                        project={project}
                        onClick={() => handleModuleClick(project.id)}
                        isSelected={selectedProject === project.id}
                        width={moduleWidth}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 项目详情面板 */}
      {selectedProject && renderProjectDetails()}
    </div>
  );
};

// 主页特性组件
export default function HomepageFeatures(): React.ReactElement {
  return (
    <section className={styles.architectureSection}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>B</div>
          <div className={styles.logoText}>{translate({
                id: 'homepage.architecture.title',
                message: 'Bella 开源项目清单',
                description: 'Architecture overview title'
              })}</div>
        </div>
        <p className={styles.architectureTip}>{translate({
                id: 'homepage.architecture.tip',
                message: '点击项目可查看详情',
                description: 'Tip for clicking on projects'
              })}</p>
      </div>
      
      <div className={styles.container} style={{ maxWidth: '100%', padding: 0 }}>
        <div className={styles.architectureDiagramContainer}>
          <ArchitectureDiagram projects={projects as Project[]} />
        </div>
        <FeatureCards />
      </div>
    </section>
  );
}