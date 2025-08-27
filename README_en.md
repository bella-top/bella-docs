# Bella - Be Everyone's Large Language model Assistant

English | [中文](./README.md)

Bella is Beike's internal one-stop intelligent access, AI agent creation, and deployment platform. By providing zero-code solutions, API integration, fine-tuning capabilities, and plugin-based capability expansion, it significantly lowers the development barrier for AI applications, promotes the popularization of AI technology, accelerates the company's intelligent upgrade process, and makes important contributions to advancing AI accessibility within Beike.

Building on this foundation, Bella has accumulated many flexibly reusable basic capabilities. We will gradually open-source all non-business-related capabilities, all of which have been validated in large-scale production environments. We hope to make a small contribution to the popularization of AI across the entire industry.

## 💎 Core Modules
### [Bella-openapi - All-in-one AI Capability Gateway]<a href="https://github.com/LianjiaTech/bella-openapi"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
Beyond chat completion, Bella-openapi integrates multiple AI capabilities including text vectorization, speech recognition, speech synthesis, text-to-image, and image-to-image generation, equipped with comprehensive billing, rate limiting, and resource management features. All capabilities have been thoroughly tested in large-scale production environments, ensuring stability and reliability.

### Bella-knowledge - Intelligent Knowledge Management Center <a href="https://github.com/LianjiaTech/bella-knowledge"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
Focused on unified storage and management of knowledge, elegantly handling multiple knowledge sources such as files and Q&A pairs, providing powerful knowledge support for intelligent applications.

### Bella-assistants - Cross-platform Intelligent Assistant Engine <a href="https://github.com/LianjiaTech/bella-assistants"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
An open-source implementation compatible with OpenAI Assistants API and Responses API, breaking through native ecosystem limitations, supporting flexible switching between various vendor models, truly achieving "develop once, use everywhere."

### Bella-rag - Efficient Retrieval-Augmented Generation System <a href="https://github.com/LianjiaTech/bella-rag"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
Leveraging Bella-knowledge data sources, it provides unified retrieval question-answering generation capabilities, supports various retrieval methods and RAG implementation paradigms, making AI responses more accurate and reliable.

### Bella-workflow - Workflow Engine Beyond Imagination <a href="https://github.com/LianjiaTech/bella-workflow"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
Similar to DIFY but with many differentiated capabilities, such as callback mode, Groovy script support, batch processing capabilities, third-party data source registration, while delivering superior performance.

### Bella-job-queue - Efficient Batch Processing Solution <a href="https://github.com/LianjiaTech/bella-job-queue"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
A centralized queue system that enables various basic capabilities to easily support batch processing mode, significantly improving processing efficiency and resource utilization.

### Bella-realtime - Ultimate Real-time Voice Interaction <a href="https://github.com/LianjiaTech/bella-realtime"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
Known for ultra-low latency and high flexibility, it supports free combination of different ASR, LLM, and TTS components to create the best user experience, while supporting cutting-edge features like multi-agent collaboration.

### Bella-general-infer - Universal AI Inference Engine <a href="https://github.com/LianjiaTech/bella-general-infer"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
Supports multiple models including LLM, ASR, TTS, Embedding, Rerank, compatible with mainstream inference backends such as Transformers, vLLM, SGLang, Faster-Whisper, providing one-stop solution for various AI inference needs.

### Bella-whisper - Chinese-optimized ASR Model <a href="https://github.com/LianjiaTech/bella-whisper"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/github/github-mark.svg" alt="GitHub" /></a>
A Whisper model carefully fine-tuned with domain data, possessing excellent Simplified Chinese recognition capabilities, providing more accurate support for voice applications.

### Bella-claude-code - Code Agent Integrated with Bella Openapi <a href="https://doc.bella.top/docs/claude-code/introduction"><img style="width: 24px; height: auto; vertical-align: middle;" src="./static/img/logo.svg alt="GitHub" /></a>
Claude Code is a Code Agent launched by anthropic-ai, which boasts the most powerful coding capability currently available on the market. All LLMs integrated into Bella-Openapi are provided with Route capability, and Claude Code can be utilized by all LLM protocols integrated into Bella-Openapi. It not only supports Claude series models but also supports the entire series of OpenAI models, as well as mainstream models such as Gemini, DeepSeek, Qwen, and Doubao.
