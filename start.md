# Bella文档

本仓库为Bella的文档网站，使用 Docusaurus 和 TypeScript 构建。

## 功能特点

- **API 文档**：基于 OpenAPI 规范自动生成
- **多语言支持**：提供中文和英文文档
- **TypeScript**：完整的 TypeScript 支持
- **GitHub Pages**：自动部署到 GitHub Pages

## 开发指南

### 环境要求

- Node.js（20 版本或更高）
- npm 或 yarn

### 安装设置

1. 克隆本仓库
2. 安装依赖：
   ```bash
   npm install
   ```

## 新增发布项目完整指南

当需要新增一个发布项目或将现有项目标记为已发布状态时，需要进行以下操作：

### 1. 创建项目文档

1. 补充中英文README.md， 同步到 `/docs/intro.md` 以及多语言目录下的 `/i18n/en/docusaurus-plugin-content-docs/current/intro.md`
2. 在 `/docs/` 目录下创建项目文档目录，例如 `/docs/your-project/`
3. 创建 `intro.md` 作为项目介绍页面，并补充 `/docs/intro.md` 以及多语言目录下的 `/i18n/en/docusaurus-plugin-content-docs/current/intro.md`中对应的项目链接，例如：
```
### [Bella-openapi - 全能AI能力网关](./bella-openapi/intro.md)
```
4. 根据需要添加其他文档页面
5. 多语言支持，在 `/i18n/en/docusaurus-plugin-content-docs/current` 目录下创建项目文档目录，同步新增的文档

### 2. 更新项目配置文件

在 `config/projects-data.json` 文件中添加或修改项目信息：

```json
{
  "projects": [
    {
      "id": "your-project-id",
      "name": "项目名称",
      "description": "项目描述", //复制readme.md中对该项目的介绍
      "en_description": "英文版的描述", //复制英文的readme中对该项目的介绍
      "type": "endpoint",  // 项目类型：gateway（网关层）、endpoint（能力层）、infer（推理服务层）、model（模型层）或 application（应用层）
      "status": "released",  // 将状态设置为 "released" 表示已发布
      "github": "https://github.com/YourOrg/your-project",
      "apiDocPath": "your-project-api-path",  // OpenAPI Json文件的存放路径，统一存放在 /static/openapi目录下，此处不需要填写目录前缀，例如Openapi Json文件位于 /static/openapi/bella-openapi目录下，此处应填bella-openapi，如不提供API Doc页面则不需要填写
      "link": "https://your-project-url/",  // 项目的线上体验链接，如不存在则不需要填写
      "documentationLink": "/docs/your-project/intro",  // 文档链接，统一为 /docs/{your-project}/intro
      "deepwiki": "https://wiki.bella.top/{owner}/{repo-name}?type=github&language=zh",  // 项目的wiki链接，如不存在则不需要填写
      "en_deepwiki": "https://wiki.bella.top/{owner}/{repo-name}?type=github&language=en",  // 项目的英文wiki链接，如不存在则不需要填写
      "dependencies": [  // 与其他项目的依赖关系
        {
          "project": "dependent-project-id",
          "endpoints": ["authoriztion", "AI Endpoint"]  // 可以是字符串或字符串数组
        }
      ]
    }
  ]
}
```

### 3. 更新侧边栏配置

在 `sidebars.ts` 文件中添加新项目的文档链接，确保用户能够在导航中找到新项目的文档：

```typescript
const sidebars: SidebarsConfig = {
  documentationSidebar: [
    // 现有项目...
    {
      type: 'category',
      label: '您的项目名称',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'your-project/intro',
          label: '介绍（Introduction）',
        },
        // 添加更多文档页面，example
        {
          type: 'category',
          label: '使用文档 (Usage Documents)',
          items: [
            'your-project/core/feature1',
            'your-project/core/feature2',
          ],
        },
      ],
    },
  ],
};
```

侧边栏配置说明：
- `type: 'category'`：创建一个可折叠的分类
- `label`：显示在侧边栏的分类名称
- `items`：分类下的文档项目列表
- `id`：文档的路径（相对于`docs`目录，不包含`.md`扩展名）

### 4. 准备 API 文档

如果项目包含 API 文档：

**注意：如果不打算提供openapi v3.0规范的文档，请删除配置中的apiDocPath参数**

1. 将中英文版本的OpenAPI v3.0 规范的json文件置于正确的目录中（ `/openapi/your-project-api-path/`）
2. 确保在 `projects-data.json` 中设置了正确的 `apiDocPath` 值
3. 运行 `npm run generate-api-docs` 命令生成对应的 API 文档页面，直接执行`npm run start`或`npm run build`时也会自动执行该命令。
4. 提供了为OpenAPI v3.0的接口和字段信息生成description的工具：[bella-api-doc-gen](https://github.com/szl97/bella-api-doc-gen)，调用域名为 `wiki.bella.top`，鉴权规则同bella-openapi。

### 5. 生成DeepWiki
如果需要生成DeepWiki：
- 使用 https://wiki.bella.top 进行生成
- 生成后的文档链接为：https://wiki.bella.top/{owner}/{repo-name}?type=github&language={zh|en}
- 使用时，需获联系 <a href="https://github.com/szl97">@saizhuolin</a> 获取授权码
- 注意：生成时wiki pages时，不可关闭浏览器页面，否则会生成失败

### 6. 架构图显示效果

项目架构图会根据 `projects-data.json` 中的配置自动渲染。已发布的项目会有以下特殊显示：

1. 在架构图中使用绿色边框高亮显示
2. 显示"已发布"标签
3. 在项目详情面板中显示"快速体验"和"查看文档"按钮，"快速体验"配置link属性时会显示

### 7. 注意事项

1. 项目 ID 应该使用连字符命名（如 `bella-openapi`）
2. 确保所有必填字段都已正确填写
3. 已发布项目应该提供有效的 `link` 和 `documentationLink`
4. 如果项目有 API 文档，确保 `apiDocPath` 指向有效的 OpenAPI 规范文件
5. 依赖关系应该准确反映项目之间的调用关系
6. 修改后，启动网站以查看更改效果：`npm run start`
7. 确认修改效果后，执行`npm run build`，验证可以正确编译
