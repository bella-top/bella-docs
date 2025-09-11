# Bella - Be Everyone's Large Language model Assistant

中文 | [English](./README_en.md)

Bella是贝壳找房内部的一站式智能接入、智能体创建及发布平台，通过提供0代码解决方案、API集成、微调能力及插件式能力拓展等多层次、灵活性极高的服务，显著降低了AI应用的开发门槛，促进了AI技术的普及，加快了公司智能化升级的步伐，为推进贝壳AI普惠做出了重要贡献。

在此基础上，Bella沉淀了许多可被灵活复用的基础能力，后续我们将逐步开源其中与业务无关的所有能力，这些能力都经过了大规模的生产环境验证，期望能够为全行业的AI普及贡献一点微小的力量。

## 💎 核心模块
### Bella-openapi - 全能AI能力网关 <a href="https://github.com/LianjiaTech/bella-openapi"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
不止于聊天补全，Bella-openapi整合了文本向量化、语音识别、语音合成、文生图、图生图等多元AI能力，并配备完善的计费、限流和资源管理功能。所有能力均经过大规模生产环境检验，稳定可靠。

### Bella-knowledge - 智能知识管理中心 <a href="https://github.com/LianjiaTech/bella-knowledge"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
专注于知识的统一存储与管理，优雅处理文件、问答对等多类知识源，为智能应用提供强大的知识支撑。

### Bella-assistants - 跨平台智能助手引擎 <a href="https://github.com/LianjiaTech/bella-assistants"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
兼容OpenAI Assistants API和Responses API的开源实现，突破原生生态限制，支持灵活切换各大厂商模型，真正实现"一次开发，处处可用"。

### Bella-rag - 高效检索增强生成系统 <a href="https://github.com/LianjiaTech/bella-rag"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
依托Bella-knowledge数据源，提供统一的检索问答生成能力，支持多种检索方式和RAG实现范式，让AI回答更精准、更可靠。

### Bella-workflow - 超越想象的工作流引擎 <a href="https://github.com/LianjiaTech/bella-workflow"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
类似DIFY但拥有诸多差异化能力，如回调模式、Groovy脚本支持、批处理能力、第三方数据源注册等，同时性能更为卓越。

### Bella-job-queue - 高效批处理解决方案 <a href="https://github.com/LianjiaTech/bella-job-queue"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
集中式队列系统，让各类基础能力轻松支持批处理模式，大幅提升处理效率与资源利用率。

### Bella-realtime - 极致实时语音交互 <a href="https://github.com/LianjiaTech/bella-realtime"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
以超低延迟和极高灵活性著称，支持自由组合不同的ASR、LLM和TTS组件，打造最佳用户体验，并支持多智能体协作等前沿特性。

### Bella-general-infer - 通用AI推理引擎 <a href="https://github.com/LianjiaTech/bella-general-infer"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
支持LLM、ASR、TTS、Embedding、Rerank等多种模型，兼容Transformers、vLLM、SGLang、Faster-Whisper等主流推理后端，一站式满足各类AI推理需求。

### Bella-whisper - 中文优化ASR模型 <a href="https://github.com/LianjiaTech/bella-whisper"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
基于领域数据精心微调的Whisper模型，拥有卓越的简体中文识别能力，为语音应用提供更精准的支持。

### Bella-claude-code - 集成Bella Openapi的Code Agent <a href="https://doc.bella.top/docs/claude-code/introduction"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/logo.svg" /></a>
Claude Code是由anthropic-ai推出的一款当前市面上coding能力最强大的Code Agent。所有在Bella-Openapi为其LLM调用提供了Route能力，Bella-Openapi中接入的LLM协议均可使用Claude Code，不仅仅支持Claude系列模型，同时支持了Openai全系列、Gemini、DeepSeek、Qwen、Doubao等主流模型。

### Bella-domify - 文档解析服务  <a href="https://github.com/LianjiaTech/bella-domify"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
文档解析Python库。使用Python lib包形式引入，也可以服务化方式运行，支持多种文档格式的解析和转换。是检索增强等服务能力的基石
