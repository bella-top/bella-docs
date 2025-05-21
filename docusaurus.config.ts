import type { Config } from '@docusaurus/types';
import type { Options as ClassicPresetOptions } from '@docusaurus/preset-classic';
import type { ThemeConfig } from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Bella Documentation',
  favicon: 'img/favicon.svg',

  // GitHub Pages deployment config
  url: 'https://doc.bella.top',
  baseUrl: '/',
  organizationName: 'bella',
  projectName: 'bella-docs',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  // 多语言配置
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en'],
    localeConfigs: {
      'zh-CN': {
        label: '中文 (简体)',
        direction: 'ltr',
        htmlLang: 'zh-CN',
      },
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          includeCurrentVersion: true,
        },
        blog: false, // 禁用博客
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } as ClassicPresetOptions,
    ],
  ],

  plugins: [
  ],

  // 客户端模块 - 添加GitHub点赞按钮
  clientModules: [
    require.resolve('./src/clientModules/GitHubStarButtonInjector.js'),
  ],

  // 导航栏和页脚设置
  themeConfig: {
    image: 'img/bella-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Bella Opensource',
      logo: {
        alt: 'Bella Logo',
        src: 'img/logo.svg',
      },
      items: [
        // openapi文档链接
        {
          type: 'docSidebar',
          sidebarId: 'documentationSidebar',
          position: 'left',
          label: '文档',
        },
        {
          label: 'API',
          position: 'left',
          to: '/api-viewer',
        },
        // GitHub点赞按钮
        {
          type: 'html',
          position: 'right',
          value: '<div id="github-star-button"></div>',
        },
        // 多语言切换下拉菜单
        {
          type: 'localeDropdown',
          position: 'right',
        },
        // GitHub 链接
        {
          href: 'https://github.com/LianjiaTech/bella-openapi',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '入门指南',
              to: '/docs/intro',
            },
            {
              label: 'API 文档',
              to: '/api-viewer',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: 'GitHub Issues',
              href: 'https://github.com/LianjiaTech/bella-openapi/issues',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/LianjiaTech/bella-openapi',
            },
          ],
        },
      ],
      copyright: `版权所有 ${new Date().getFullYear()} LianjiaTech. 基于 Docusaurus 构建。`,
    },
    prism: {
      additionalLanguages: ['bash', 'json', 'yaml', 'java', 'csharp', 'python'],
    },
  } as ThemeConfig,
};

export default config;