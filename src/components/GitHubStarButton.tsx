import React, { useState, useEffect } from 'react';
import styles from './GitHubStarButton.module.css';
import { translate } from '@docusaurus/Translate';

// 配置信息
const GITHUB_CLIENT_ID = 'Ov23libkfFAeZk8u5wFL'; // 您的GitHub OAuth应用Client ID
const TARGET_REPO = 'LianjiaTech/bella-openapi'; // 您的目标仓库
const GATEKEEPER_URL = 'https://api.bella.top/gatekeeper'; // http://gatekeeper.yourdomain.com
interface TokenResponse {
  token: string;
}

const GitHubStarButton: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const errorStr = translate({
        id: 'project.GitHub.Stared.Failed',
        message: '点赞操作失败，请刷新后重试',
        description: 'Github Star Failed'
  });

  // 当组件加载时检查认证状态和是否已点赞
  useEffect(() => {
    // 检查是否已登录（本地存储的token）
    const token = localStorage.getItem('github_token');
    if (token) {
      setIsAuthenticated(true);
      // 检查用户是否已经为仓库点赞
      checkIfStarred(token);
    }
    
    // 检查URL中是否有授权码
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        // 有授权码，通过Gatekeeper交换获取token
        exchangeCodeForToken(code);
      }
    }
  }, []);

  // 检查用户是否已经为仓库点赞
  const checkIfStarred = async (token: string): Promise<void> => {
    try {
      const response = await fetch(`https://api.github.com/user/starred/${TARGET_REPO}`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      
      // 204表示找到了，404表示没有找到（未点赞）
      setIsStarred(response.status === 204);
    } catch (err) {
      console.error('检查星标状态失败:', err);
      setIsStarred(false);
    }
  };

  // 使用授权码通过Gatekeeper交换token
  const exchangeCodeForToken = async (code: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 使用Gatekeeper交换token
      const response = await fetch(`${GATEKEEPER_URL}/authenticate/${code}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json() as TokenResponse;
        const token = data.token; // Gatekeeper返回的格式
        
        if (token) {
          // 存储token到本地
          localStorage.setItem('github_token', token);
          setIsAuthenticated(true);
          
          // 检查是否已点赞
          await checkIfStarred(token);
          
          // 清除URL中的code参数
          if (typeof window !== 'undefined' && window.history.replaceState) {
            const newUrl = window.location.pathname + 
                          (window.location.search ? window.location.search.replace(/[?&]code=[^&]+/, '') : '');
            window.history.replaceState({}, document.title, newUrl);
          }
          
          // 自动执行点赞操作
          await performStar(token);
        } else {
          throw new Error('响应中没有token');
        }
      } else {
        throw new Error('获取token失败');
      }
    } catch (err) {
      setError(errorStr);
      console.error('Token交换失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 执行点赞操作
  const performStar = async (token: string): Promise<void> => {
    // 如果已经点赞了，什么都不做
    if (isStarred) {
      return;
    }
    
    try {
      const response = await fetch(`https://api.github.com/user/starred/${TARGET_REPO}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Length': '0',
        },
      });
      
      if (response.status === 204) {
        setIsStarred(true);
      } else {
        throw new Error('点赞操作失败');
      }
    } catch (err) {
      setError(errorStr);
      console.error('Star操作失败:', err);
    }
  };

  // 处理登录
  const handleLogin = (): void => {
    const redirectUri = window.location.href.split('?')[0]; // 移除现有的查询参数
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=public_repo`;
    
    // 跳转到GitHub授权页面
    window.location.href = authUrl;
  };

  // 处理点赞操作
  const handleStar = async (): Promise<void> => {
    if (!isAuthenticated) {
      handleLogin();
      return;
    }
    
    // 如果已经点赞了，什么都不做
    if (isStarred) {
      return;
    }
    
    setIsLoading(true);
    const token = localStorage.getItem('github_token');
    
    if (!token) {
      setError(errorStr);
      setIsLoading(false);
      return;
    }
    
    try {
      await performStar(token);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      
      <button 
        onClick={handleStar}
        className={`${styles.starButton} ${isStarred ? styles.starred : ''}`}
        disabled={isLoading}
      >
        <svg className={styles.icon} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
        </svg>
        {isStarred ? translate({
                    id: 'project.GitHub.Stared',
                    message: '已点赞',
                    description: 'Github Stared'
                  }) : translate({
                    id: 'project.GitHub.Star',
                    message: '点赞',
                    description: 'Github Star'
                  })}
      </button>
    </div>
  );
};

export default GitHubStarButton;