import React, { useState, useMemo } from 'react';
import styles from './styles.module.css';
import projectsData from '../../../config/projects-data.json';

// 从 JSON 文件中获取项目列表
const projects = projectsData.projects;

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
  status: ProjectStatus;
  type: ProjectType;
  github?: string;
  link?: string;
  apiDocPath?: string;
  documentationLink?: string;
  dependency?: Dependency[];
  dependencies?: Dependency[];
}

// 获取项目的依赖项
const getProjectDependencies = (project: Project): Dependency[] => {
  return project.dependencies || project.dependency || [];
};

// 项目类型的显示名称和顺序
const typeConfig = {
  gateway: { name: '网关层', order: 1 },
  endpoint: { name: '能力层', order: 2 },
  infer: { name: '推理服务层', order: 3 },
  model: { name: '模型层', order: 4 },
  application: { name: '应用层', order: 5 }
};

// 架构图模块组件
const ArchitectureModule: React.FC<{
  project: Project;
  onClick: () => void;
  isSelected: boolean;
  width: number;
}> = ({ project, onClick, isSelected, width }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // 处理描述的展开/收起
  const toggleDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };
  
  // 处理已发布项目的访问链接点击
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.status === 'released' && project.link) {
      window.location.href = project.link;
    }
  };

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
        <h3>{project.name}</h3>
        <div className={`${styles.statusBadge} ${styles[`status-${project.status}`]}`}>
          {project.status === 'released' ? '已发布' : '待发布'}
        </div>
      </div>
      
      <div className={styles.moduleBody}>
        <p className={isDescriptionExpanded ? styles.expandedDescription : styles.description}>
          {project.description}
        </p>
        {project.description.length > 50 && (
          <button 
            className={styles.expandButton}
            onClick={toggleDescription}
          >
            {isDescriptionExpanded ? '收起' : '展开'}
          </button>
        )}
      </div>
      
      <div className={styles.moduleFooter}>
        {project.github && (
          <a 
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
            onClick={(e) => e.stopPropagation()}
          >
            GitHub
          </a>
        )}
        {project.status === 'released' && project.link && (
          <button 
            className={styles.visitButton}
            onClick={handleLinkClick}
          >
            访问
          </button>
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
      return 320; // 单个模块较宽
    } else if (count === 2) {
      return 280; // 两个模块中等宽度
    } else {
      return 240; // 多个模块较窄
    }
  };
  
  // 处理模块点击
  const handleModuleClick = (projectId: string) => {
    setSelectedProject(selectedProject === projectId ? null : projectId);
  };
  
  // 渲染项目详情面板
  const renderProjectDetails = () => {
    if (!selectedProject) return null;
    
    const project = projects.find(p => p.id === selectedProject);
    if (!project) return null;
    
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
      <div className={styles.projectDetails}>
        <div className={styles.detailsHeader}>
          <h2>{project.name}</h2>
          <span className={`${styles.detailsStatus} ${styles[project.status]}`}>
            {project.status === 'released' ? '已发布' : '待发布'}
          </span>
        </div>
        
        <div className={styles.detailsTypeSection}>
          <span className={styles.detailsTypeLabel}>类型:</span>
          <span className={`${styles.detailsTypeValue} ${styles[`type-${project.type}`]}`}>
            {typeConfig[project.type]?.name || project.type}
          </span>
        </div>
        
        <p className={styles.detailsDescription}>{project.description}</p>
        
        <div className={styles.detailsButtons}>
          {project.github && (
            <a 
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubButton}
            >
              GitHub
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
                  访问项目
                </a>
              )}
              
              {project.documentationLink && (
                <a 
                  href={project.documentationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.docsButton}
                >
                  查看文档
                </a>
              )}
            </>
          )}
        </div>
        
        <div className={styles.dependencySection}>
          <h3>调用接口:</h3>
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
                      <strong>接口:</strong>
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
            <p className={styles.noDependencies}>不调用其他模块</p>
          )}
          
          <h3>被调用:</h3>
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
                      <strong>接口:</strong>
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
            <p className={styles.noDependencies}>无模块调用此模块</p>
          )}
        </div>
        
        <button 
          className={styles.closeButton}
          onClick={() => setSelectedProject(null)}
        >
          关闭
        </button>
      </div>
    );
  };

  return (
    <div className={styles.architectureDiagramContainer}>
      {/* 架构图层级布局 */}
      <div className={styles.architectureLevels}>
        {orderedLayers.map((type) => {
          const moduleWidth = getModuleWidth(type);
          
          return (
            <div key={type} className={styles.architectureLevel}>
              <div className={styles.levelHeader}>
                <h2 className={`${styles.levelTitle} ${styles[`levelTitle-${type}`]}`}>
                  {typeConfig[type]?.name || type}
                </h2>
              </div>
              <div className={styles.levelContent}>
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

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.architectureSection}>        
          <ArchitectureDiagram projects={projects} />
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p> {new Date().getFullYear()} Bella</p>
          <a 
            href="https://github.com/bella-top" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}