import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  documentationSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '介绍（Introduction）',
      key: 'main-intro',
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
          key: 'openapi-intro',
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
          key: 'openapi-usage-docs',
          items: [
            'bella-openapi/core/chat-completions',
            'bella-openapi/core/embeddings',
            'bella-openapi/core/flash-asr',
            'bella-openapi/core/audio-transcriptions',
            'bella-openapi/core/tts',
            'bella-openapi/core/realtime',
            'bella-openapi/core/images-generate',
            'bella-openapi/core/images-edit',
            'bella-openapi/core/advanced-features',
            'bella-openapi/core/document-parse',
          ],
        },
        {
          type: 'category',
          label: '特性介绍（Features Introduce）',
          key: 'openapi-features',
          items: [
            'bella-openapi/features/claude-cache',
            'bella-openapi/features/thinking',
          ],
        },
        {
          type: 'category',
          label: '技术文档（Tech Documents）',
          key: 'openapi-tech-docs',
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
            'bella-openapi/dev/model-console',
            `bella-openapi/dev/endpoint-console`,
            `bella-openapi/dev/bella-service-introduction`
          ],
        }
      ],
    },
    {
      type: 'category',
      label: 'assistant&responses',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'bella-assistants/intro',
          label: '介绍（Introduction）',
          key: 'assistant-intro',
        },
        {
          type: 'category',
          label: '使用文档 (Usage Documents)',
          key: 'assistant-usage-docs',
          items: [
            'bella-assistants/api/assistant-core-api',
            'bella-assistants/api/create-response',
          ],
        },
        {
          type: 'category',
          label: '开发者文档（Dev Documents）',
          key: 'assistant-Dev-docs',
          items: [
            'bella-assistants/dev/run-executor-design',
            'bella-assistants/dev/thread-concurrent',
            'bella-assistants/dev/responses-api-architecture-reuse',
            'bella-assistants/dev/dialog-branching-multipath-execution',
            'bella-assistants/dev/non-store-mode-architecture',
            'bella-assistants/dev/tool-plugin-architecture',
            'bella-assistants/dev/multimodal-input-architecture'
          ],
        }
      ],
    },
    {
      type: 'category',
      label: 'RAG',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'bella-rag/intro',
          label: '介绍（Introduction）',
          key: 'rag-intro',
        },
        {
          type: 'category',
          label: '使用文档 (Usage Documents)',
          key: 'rag-usage-docs',
          items: [
            'bella-rag/usage',
            'bella-rag/deep-rag',
            'bella-rag/api',
            'bella-rag/advanced',
          ],
        }
      ],
    },
    {
      type: 'category',
      label: 'Workflow',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'bella-workflow/intro',
          label: '介绍（Introduction）',
          key: 'workflow-intro',
        },
      ],
    },
    {
      type: 'category',
      label: 'Domify',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'bella-domify/intro',
          label: '介绍（Introduction）',
          key: 'domify-intro',
        },
        {
          type: 'category',
          label: '使用文档 (Usage Documents)',
          key: 'domify-usage-docs',
          items: [
            'bella-domify/integration-knowledge-rag-integration',
            'bella-domify/standalone-quick-start',
            'bella-domify/domtree',
          ],
        }
      ],
    },
    {
      type: 'category',
      label: 'Knowledge',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'bella-knowledge/intro',
          label: '介绍（Introduction）',
          key: 'knowledge-intro',
        },
        {
          type: 'category',
          label: '使用文档 (Usage Documents)',
          key: 'knowledge-usage-docs',
          items: [
            {
              type: 'category',
              label: 'File API',
              items: [
                'bella-knowledge/api/files/upload',
                'bella-knowledge/api/files/list',
                'bella-knowledge/api/files/retrieve',
                'bella-knowledge/api/files/delete',
                'bella-knowledge/api/files/content',
                'bella-knowledge/api/files/url',
                'bella-knowledge/api/files/rename',
                'bella-knowledge/api/files/mkdir',
                'bella-knowledge/api/files/find',
                'bella-knowledge/api/files/info',
                'bella-knowledge/api/files/progress',
                'bella-knowledge/api/files/dom-tree',
              ],
            },
            {
              type: 'category',
              label: 'Dataset API',
              items: [
                {
                  type: 'category',
                  label: '数据集管理',
                  items: [
                    'bella-knowledge/api/datasets/create',
                    'bella-knowledge/api/datasets/update',
                    'bella-knowledge/api/datasets/delete',
                    'bella-knowledge/api/datasets/get',
                    'bella-knowledge/api/datasets/page',
                    'bella-knowledge/api/datasets/import',
                    'bella-knowledge/api/datasets/export',
                  ],
                },
                {
                  type: 'category',
                  label: 'QA数据管理',
                  items: [
                    'bella-knowledge/api/datasets/qa/create',
                    'bella-knowledge/api/datasets/qa/update',
                    'bella-knowledge/api/datasets/qa/delete',
                    'bella-knowledge/api/datasets/qa/get',
                    'bella-knowledge/api/datasets/qa/page',
                    'bella-knowledge/api/datasets/qa/list',
                  ],
                },
                {
                  type: 'category',
                  label: 'QA引用管理',
                  items: [
                    'bella-knowledge/api/datasets/qa/reference/create',
                    'bella-knowledge/api/datasets/qa/reference/update',
                    'bella-knowledge/api/datasets/qa/reference/delete',
                    'bella-knowledge/api/datasets/qa/reference/get',
                    'bella-knowledge/api/datasets/qa/reference/page',
                    'bella-knowledge/api/datasets/qa/reference/list',
                  ],
                },
                {
                  type: 'category',
                  label: '文档管理',
                  items: [
                    'bella-knowledge/api/datasets/documents/create',
                    'bella-knowledge/api/datasets/documents/delete',
                    'bella-knowledge/api/datasets/documents/get',
                    'bella-knowledge/api/datasets/documents/page',
                    'bella-knowledge/api/datasets/documents/list',
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: '特性介绍（Features Introduce）',
          key: 'knowledge-features',
          items: [
            'bella-knowledge/features/openai-compatibility',
            'bella-knowledge/features/multi-format-support',
            'bella-knowledge/features/enterprise',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Claude Code With Bella',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'claude-code/introduction',
          label: '导读（Introduction）',
        },
        {
          type: 'category',
          label: '快速使用（Quick Start）',
          items: [
            'claude-code/introduce/use-in-ide',
            'claude-code/introduce/use-in-github',
            'claude-code/introduce/use-in-code',
          ],
        },
        {
          type: 'category',
          label: '技术分析（Tech Analysis）',
          items: [
            'claude-code/tech/agent_design',
            'claude-code/tech/codebase',
            'claude-code/tech/sub-agents',
          ],
        },
        {
          type: 'category',
          label: '实践案例（cases）',
          items: [
            'claude-code/case/tips',
            'claude-code/case/technical-research-case',
            'claude-code/case/sub-agents-use',
            'claude-code/case/client',
          ],
        },
        {
          type: 'category',
          label: '经验分享（shares）',
          items: [
            'claude-code/share/share',
            'claude-code/share/think-share'
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
