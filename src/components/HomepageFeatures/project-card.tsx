import React from 'react';
import styles from './styles.module.css';

// 定义项目卡片的属性
const ProjectCard = ({ project }) => {
  return (
    <div 
      className={`${styles.card} ${
        project.status === 'released' 
          ? styles.released 
          : styles.upcoming
      }`}
    >
      <div className={styles.header}>
        {project.icon && (
          <img 
            src={project.icon} 
            alt={`${project.name} 图标`} 
            className={styles.icon} 
            width={40}
            height={40}
          />
        )}
        <div className={styles.meta}>
          <h3 className={styles.title}>{project.name}</h3>
          <span 
            className={`${styles.status} ${
              project.status === 'released' 
                ? styles.releasedStatus 
                : styles.upcomingStatus
            }`}
          >
            {project.status === 'released' ? '已发布' : '待发布'}
          </span>
        </div>
      </div>
      
      <p className={styles.description}>{project.description}</p>
      
      <div className={styles.links}>
        {project.status === 'released' && project.link && (
          <a href={project.link} className={styles.link}>
            查看项目
          </a>
        )}
        
        {project.status === 'released' && project.documentationLink && (
          <a href={project.documentationLink} className={styles.link}>
            文档
          </a>
        )}
        
        {project.github && (
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.link}
          >
            GitHub
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;