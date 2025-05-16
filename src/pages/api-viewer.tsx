import React from 'react';
import Layout from '@theme/Layout';
import { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import projectsData from '../../config/projects-data.json';

export default function ApiViewerPage() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale;
  
  // 项目卡片样式
  const cardContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
  };
  
  const cardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column' as const,
  };
  
  const cardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#1890ff',
  };
  
  const cardDescriptionStyle = {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '20px',
    flexGrow: 1,
  };
  
  const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'center' as const,
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'inline-block',
  };
  
  const disabledButtonStyle = {
    padding: '10px 15px',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    textAlign: 'center' as const,
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'inline-block',
    opacity: 0.6,
  };
  
  const statusBadgeStyle = (status) => ({
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    marginLeft: '10px',
    backgroundColor: status === 'released' ? '#52c41a' : '#faad14',
    color: 'white',
  });
  
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
      <div>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>API 文档</h1>
          <p style={{ margin: '10px 0 0 0', color: '#666' }}>选择一个项目查看其 API 文档</p>
        </div>
        
        <div style={cardContainerStyle}>
          {projectsData.projects.map(project => (
            <div key={project.id} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2 style={cardTitleStyle}>{project.name}</h2>
                <span style={statusBadgeStyle(project.status)}>
                  {project.status === 'released' ? '已发布' : '即将推出'}
                </span>
              </div>
              <p style={cardDescriptionStyle}>
                {project.description}
              </p>
              {project.status === 'released' ? (
                <Link 
                  to={`/api-docs/${project.id}`} 
                  style={buttonStyle}
                >
                  查看 API 文档
                </Link>
              ) : (
                <div 
                  style={disabledButtonStyle}
                  title="即将推出"
                >
                  查看 API 文档
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}