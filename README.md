# Bella - Be Everyone's Large Language model Assistant
Bella是贝壳找房内部的一站式智能接入、智能体创建及发布平台，通过提供0代码解决方案、API集成、微调能力及插件式能力拓展等多层次、灵活性极高的服务，显著降低了AI应用的开发门槛，促进了AI技术的普及，加快了公司智能化升级的步伐，为推进贝壳AI普惠做出了重要贡献。

在此基础上，Bella沉淀了许多可被灵活复用的基础能力，后续我们将逐步将其中与业务无关的所有能力进行开源，这些能力都经过了大规模的生产环境验证，期望能够为全行业的AI普及贡献一点微小的力量。

## Bella-openapi

Bella-openapi是一个提供了丰富的AI调用能力的API网关，可类比openrouter，与之不同的是除了提供聊天补全(chat-completion)能力外，还提供了文本向量化(text-embedding)、语音识别(ASR)、语音合成(TTS)、文生图、图生图等多种AI能力，同时集成了计费、限流和资源管理功能。且集成的所有能力都经过了大规模生产环境的验证。

[repo](https://github.com/LianjiaTech/bella-openapi)

## Bella-knowledge
Bella-knowledge负责知识的统一存储、管理，主要包含文件、QA对两类知识的统一管理。

[repo](https://github.com/LianjiaTech/bella-knowledge)

## Bella-assistants
Bella-assistants-api是openai assistants-api和responses api的开源实现，主要优点是不局限于openai的生态，可以灵活切换不同厂商的模型。

[repo](https://github.com/LianjiaTech/bella-assistant)

## Bella-rag
Bella-rag负责提供统一的检索问答生成能力，依托于Bella-knowledge的数据源，进行解析、抽取、索引后提供多种检索能力，同时提供多种rag范式

[repo](https://github.com/LianjiaTech/bella-rag)

## Bella-workflow
bella的工作流实现，类似DIFY又提供了差异化的能力特性，比如回调模式、比如groovy支持、比如batch支持、三方数据源注册及使用等等，同时拥有更优秀的性能。

[repo](https://github.com/LianjiaTech/bella-workflow)

## Bella-job-queue
bella的批处理能力，本质是一个集中式的队列，各种基础能力都可以接入这个队列以轻松的支持batch模式。

[repo](https://github.com/LianjiaTech/bella-job-queue)

## Bella-realtime
Bella的实时语音对话能力，超低的延迟和超强的灵活性，可任意替换不同的asr，llm和tts以达到更好的效果，同时还支持multi agent等关键特性。

[repo](https://github.com/LianjiaTech/bella-realtime)

## Bella-general-infer
 Bella的通用推理服务，支持llm，asr，tts，embedding，rerank等多种明星，transforms，vllm，sglang，faster_whisper等多种推理后端。

[repo](https://github.com/LianjiaTech/bella-general-infer)

## Bella-whisper
基于领域数据微调后的whisper模型，拥有更强的简体中文识别能力。

[repo](https://github.com/LianjiaTech/bella-whisper)
