import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import React from 'react';
import ReactDOM from 'react-dom';
import GitHubStarButton from '../components/GitHubStarButton';

// 仅在浏览器环境执行
if (ExecutionEnvironment.canUseDOM) {
  const initGitHubStarButton = () => {
    const buttonContainer = document.getElementById('github-star-button');
    if (buttonContainer && !buttonContainer.hasChildNodes()) {
      ReactDOM.render(React.createElement(GitHubStarButton), buttonContainer);
    }
  };
  
  // 页面加载后初始化
  window.addEventListener('load', initGitHubStarButton);
  
  // 对于SPA导航，在路由变化后重新初始化
  document.addEventListener('docusaurus.routeDidUpdate', initGitHubStarButton);
}

// 导出模块
export default {
  onRouteDidUpdate() {
    if (ExecutionEnvironment.canUseDOM) {
      setTimeout(() => {
        const buttonContainer = document.getElementById('github-star-button');
        if (buttonContainer && !buttonContainer.hasChildNodes()) {
          ReactDOM.render(React.createElement(GitHubStarButton), buttonContainer);
        }
      }, 200);
    }
  },
};
