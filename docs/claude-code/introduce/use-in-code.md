# Agent SDK

> 使用 Claude Agent SDK 构建自定义 AI 代理
> 
## 安装

  ```bash TypeScript theme={null}
  npm install @anthropic-ai/claude-agent-sdk
  ```

  ```bash Python theme={null}
  pip install claude-agent-sdk
  ```

## SDK 选项

Claude Agent SDK 提供多种形式以适应不同的使用场景：

* **[TypeScript SDK](https://docs.claude.com/zh-CN/api/agent-sdk/typescript)** - 用于 Node.js 和 Web 应用程序
* **[Python SDK](https://docs.claude.com/zh-CN/api/agent-sdk/python)** - 用于 Python 应用程序和数据科学
* **[流式 vs 单次模式](https://docs.claude.com/zh-CN/api/agent-sdk/streaming-vs-single-mode)** - 了解输入模式和最佳实践

## 为什么使用 Claude Agent SDK？

基于为 Claude Code 提供支持的代理框架构建，Claude Agent SDK 提供了构建生产就绪代理所需的所有构建块。

利用我们在 Claude Code 上所做的工作，包括：

* **上下文管理**：自动压缩和上下文管理，确保您的代理不会耗尽上下文。
* **丰富的工具生态系统**：文件操作、代码执行、网络搜索和 MCP 可扩展性
* **高级权限**：对代理功能的细粒度控制
* **生产必需品**：内置错误处理、会话管理和监控
* **优化的 Claude 集成**：自动提示缓存和性能优化

## 您可以使用 SDK 构建什么？

以下是您可以创建的一些示例代理类型：

**编码代理：**

* 诊断和修复生产问题的 SRE 代理
* 审计代码漏洞的安全审查机器人
* 分类事件的值班工程助手
* 执行风格和最佳实践的代码审查代理

**业务代理：**

* 审查合同和合规性的法律助手
* 分析报告和预测的财务顾问
* 解决技术问题的客户支持代理
* 为营销团队提供的内容创建助手

## 核心概念

### 完整的 Claude Code 功能支持

SDK 提供对 Claude Code 中所有默认功能的访问，利用相同的基于文件系统的配置：

* **子代理**：启动存储为 Markdown 文件的专门代理，位于 `./.claude/agents/`
* **钩子**：执行在 `./.claude/settings.json` 中配置的自定义命令，响应工具事件
* **斜杠命令**：使用定义为 Markdown 文件的自定义命令，位于 `./.claude/commands/`
* **内存 (CLAUDE.md)**：通过项目目录中的 `CLAUDE.md` 或 `.claude/CLAUDE.md` 文件，或用户级别指令的 `~/.claude/CLAUDE.md` 维护项目上下文。要加载这些文件，您必须在选项中明确设置 `settingSources: ['project']`（TypeScript）或 `setting_sources=["project"]`（Python）。详情请参阅[修改系统提示](https://docs.claude.com/zh-CN/api/agent-sdk/modifying-system-prompts#method-1-claudemd-files-project-level-instructions)。

这些功能通过从相同的文件系统位置读取，与其 Claude Code 对应功能的工作方式完全相同。

### 系统提示

系统提示定义您的代理的角色、专业知识和行为。这是您指定要构建什么类型代理的地方。

### 工具权限

通过细粒度权限控制您的代理可以使用哪些工具：

* `allowedTools` - 明确允许特定工具
* `disallowedTools` - 阻止特定工具
* `permissionMode` - 设置整体权限策略

### 模型上下文协议 (MCP)

通过 MCP 服务器使用自定义工具和集成扩展您的代理。这允许您连接到数据库、API 和其他外部服务。

## 报告错误

如果您在使用 Agent SDK 时遇到错误或问题：

* **TypeScript SDK**：[在 GitHub 上报告问题](https://github.com/anthropics/claude-agent-sdk-typescript/issues)
* **Python SDK**：[在 GitHub 上报告问题](https://github.com/anthropics/claude-agent-sdk-python/issues)
