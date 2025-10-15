# 使用codex

## 介绍
codex是Openai推出的一个强大的code agent。支持chat completions和responses api两种模式。其中responses api可以更好地适配深度思考和网络搜索工具。

## 特点
- 对比Claude Code，其优势主要在GPT-5 high的强大。不过Bella Openapi同样支持GPT-5 high的`/v1/messages`协议，同样适配了GPT-5 high，欢迎尝试切换体验
- codex会在执行任务前，获得更详细的输入，查询更多的文件内容，在执行复杂任务时，会感觉比Claude Code更严谨
- 缺点是在使用GPT-5 high时执行任务时间很长，而不使用GPT-5 high时，体验会明显不如使用Claude Code
- 存在部分bug未修复，比如压缩上下文时，会错误地将md文件作为图片输入，详情可查看社区的Issues

基于codex的特点，建议在进行很复杂的工作时，搭配GPT-5 high使用

## 安装
```shell
npm install -g @openai/codex
```

## 推荐配置
- 写入 ~/.codex/config.toml
```toml
model = "gpt-5"
model_reasoning_effort = "high"
model_reasoning_summary = "detailed"
# 改为openai-chat-completions，即可使用chat-completion接口
model_provider = "openai-responses"
approval_policy = "on-request"
model_supports_reasoning_summaries = true
sandbox_mode = "workspace-write"


[model_providers.openai-chat-completions]
# Name of the provider that will be displayed in the Codex UI.
name = "OpenAI using Chat Completions"
# The path `/chat/completions` will be amended to this URL to make the POST
# request for the chat completions.
# 替换为实际部署的BELLA-OPENAPI域名
base_url = "https:///{OPENAPI_DOMAIN}/v1"
# If `env_key` is set, identifies an environment variable that must be set when
# using Codex with this provider. The value of the environment variable must be
# non-empty and will be used in the `Bearer TOKEN` HTTP header for the POST request.
env_key = "OPENAI_API_KEY"
# Valid values for wire_api are "chat" and "responses". Defaults to "chat" if omitted.
wire_api = "chat"
# If necessary, extra query params that need to be added to the URL.
# See the Azure example below.
query_params = {}

[model_providers.openai-responses]
name = "OpenAI using Responses"
# 替换为实际部署的BELLA-OPENAPI域名
base_url = "https://{OPENAPI_DOMAIN}/v1"
env_key = "OPENAI_API_KEY"
wire_api = "responses"

[tools]
web_search = true

[sandbox_workspace_write]
network_access = true
```
- 设置环境变量 OPENAI_API_KEY="YOUR_API_KEY"

## 相关阅读
[codex GitHub](https://github.com/openai/codex)
