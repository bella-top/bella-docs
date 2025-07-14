import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  documentationSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '介绍（Introduction）',
    },
    {
      type: 'category',
      label: 'OpenAPI',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'bella-openapi/intro',
          label: '介绍（Introduction）',
        },
        {
          type: 'category',
          label: '配置与部署 (Configuration & Deployment)',
          items: [
            'bella-openapi/configuration-details',
            'bella-openapi/startup-deployment-details',
          ],
        },
        {
          type: 'category',
          label: '使用文档 (Usage Documents)',
          items: [
            'bella-openapi/core/chat-completions',
            'bella-openapi/core/embeddings',
            'bella-openapi/core/flash-asr',
            'bella-openapi/core/tts',
            'bella-openapi/core/realtime',
            'bella-openapi/core/images-generage',
            'bella-openapi/core/advanced-features',
          ],
        },
        {
          type: 'category',
          label: '特性介绍（Features Introduce）',
          items: [
            'bella-openapi/features/claude-cache',
            'bella-openapi/features/thinking',
          ],
        },
        {
          type: 'category',
          label: '技术文档（Tech Documents）',
          items: [
            'bella-openapi/tech/system-structure',
            'bella-openapi/tech/metadata',
            'bella-openapi/tech/dynamic-route',
            'bella-openapi/tech/function-call',
            'bella-openapi/tech/async-performace',
            'bella-openapi/tech/user-authorization',
            'bella-openapi/tech/usage-manage',
          ],
        },
        {
          type: 'category',
          label: '开发者文档（Dev Documents）',
          items: [
            'bella-openapi/dev/login-spi',
            'bella-openapi/dev/model-console'
          ],
        }
      ],
    },
    // 可以在这里添加更多项目
    // {
    //   type: 'category',
    //   label: '其他项目名称',
    //   collapsible: true,
    //   collapsed: true,
    //   items: [
    //     // 项目相关文档
    //   ],
    // },
  ],
};

export default sidebars;
