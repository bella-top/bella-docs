const fs = require('fs');
const path = require('path');

// 读取项目配置文件
function readProjectsConfig() {
  try {
    const configPath = path.join(__dirname, '../config/projects-data.json');
    const content = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading projects config:`, error);
    return { projects: [] };
  }
}

// 创建 API 文档页面
function createApiDocPage(project, outputPath) {
  // 获取项目路径或
  const projectPath = project.apiDocPath;
  
  // 将项目ID转换为驼峰命名
  const componentName = project.id
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') + 'ApiPage';
  
  const template = `import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import '../../css/redoc-overrides.css'; // 引入自定义CSS样式

export default function ${componentName}() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale;
  
  // 根据当前语言选择正确的API规范文件
  const specUrl = useBaseUrl(
    currentLocale === 'en' 
      ? '/openapi/${projectPath}/' + 'openapi-en.json' 
      : '/openapi/${projectPath}/' + 'openapi.json' 
  );
  
  return (
    <Layout
      title="${project.name} API 文档"
      description="${project.description || project.name + ' API 文档'}"
      noFooter={true}>
      <main className="container" style={{padding: 0, maxWidth: '100%', height: 'calc(100vh - 60px)'}}>
        {/* 加载指示器 */}
        <div id="redoc-loading" style={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%',
          fontSize: '1.2rem',
          color: '#666'
        }}>
          API 文档加载中...
        </div>
        
        {/* 使用 script 标签直接加载 Redoc */}
        <BrowserOnly>
          {() => {
            useEffect(() => {
              // 使用最直接的方式加载 Redoc
              const loadRedoc = async () => {
                try {
                  // 添加返回按钮
                  const container = document.querySelector('main.container');
                  if (container) {
                    const header = document.createElement('div');
                    header.style.padding = '10px';
                    header.style.backgroundColor = '#f5f5f5';
                    header.style.borderBottom = '1px solid #e0e0e0';
                    header.style.display = 'flex';
                    header.style.alignItems = 'center';
                    
                    const backButton = document.createElement('a');
                    backButton.href = '/api-viewer';
                    backButton.textContent = '← 返回项目列表';
                    backButton.style.display = 'inline-flex';
                    backButton.style.alignItems = 'center';
                    backButton.style.padding = '10px 15px';
                    backButton.style.backgroundColor = '#f5f5f5';
                    backButton.style.border = '1px solid #e0e0e0';
                    backButton.style.borderRadius = '4px';
                    backButton.style.color = '#333';
                    backButton.style.textDecoration = 'none';
                    backButton.style.fontWeight = 'bold';
                    backButton.style.margin = '10px';
                    
                    const title = document.createElement('h1');
                    title.textContent = '${project.name} API 文档';
                    title.style.margin = '0 0 0 20px';
                    title.style.fontSize = '1.5rem';
                    
                    header.appendChild(backButton);
                    header.appendChild(title);
                    container.insertBefore(header, container.firstChild);
                  }
                  
                  // 加载 Redoc 脚本
                  const script = document.createElement('script');
                  script.src = 'https://cdn.jsdelivr.net/npm/redoc@2.0.0/bundles/redoc.standalone.js';
                  script.async = true;
                  script.onload = () => {
                    // 创建 Redoc 容器
                    const redocContainer = document.createElement('div');
                    redocContainer.id = 'redoc-container';
                    redocContainer.style.height = 'calc(100% - 60px)';
                    
                    // 获取加载指示器
                    const loadingElement = document.getElementById('redoc-loading');
                    if (loadingElement && loadingElement.parentNode) {
                      // 替换加载指示器为 Redoc 容器
                      loadingElement.parentNode.replaceChild(redocContainer, loadingElement);
                    }
                    
                    // 初始化 Redoc
                    // @ts-ignore
                    window.Redoc.init(
                      specUrl,
                      {
                        scrollYOffset: 60,
                        hideHostname: false,
                        expandResponses: '200,201',
                        nativeScrollbars: true,
                        theme: {
                          colors: {
                            primary: { main: '#1890ff' },
                          },
                          typography: {
                            fontSize: '16px',
                            headings: {
                              fontFamily: '"Source Sans Pro", sans-serif',
                            },
                            fontFamily: 'Montserrat, Helvetica, Arial, sans-serif',
                          },
                          sidebar: {
                            width: '300px',
                          },
                        },
                      },
                      redocContainer
                    );
                  };
                  
                  document.body.appendChild(script);
                } catch (error) {
                  console.error('Error initializing Redoc:', error);
                  const loadingElement = document.getElementById('redoc-loading');
                  if (loadingElement) {
                    loadingElement.textContent = '加载 API 文档失败，请刷新页面重试';
                    loadingElement.style.color = 'red';
                  }
                }
              };
              
              loadRedoc();
              
              // 清理函数
              return () => {
                const script = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/redoc@2.0.0/bundles/redoc.standalone.js"]');
                if (script && script.parentNode) {
                  script.parentNode.removeChild(script);
                }
              };
            }, []);
            
            return null;
          }}
        </BrowserOnly>
      </main>
    </Layout>
  );
}`;

  try {
    fs.writeFileSync(outputPath, template, 'utf8');
    console.log(`Created API doc page for ${project.id} at ${outputPath}`);
  } catch (error) {
    console.error(`Error creating API doc page for ${project.id}:`, error);
  }
}

// 主函数
function generateApiDocs() {
  // 读取项目配置
  const config = readProjectsConfig();
  
  if (!config.projects || config.projects.length === 0) {
    console.error('No projects found in config');
    return;
  }
  
  // 确保目录存在
  const pagesDir = path.join(__dirname, '../src/pages/api-docs');
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  
  // 为每个项目生成 API 文档页面
  config.projects.forEach(project => {
    if(project.apiDocPath) {
        const outputPath = path.join(pagesDir, `${project.id}.tsx`);
        createApiDocPage(project, outputPath);
    }
  });
  
  console.log('API doc pages generation completed');
}

// 执行主函数
generateApiDocs();
