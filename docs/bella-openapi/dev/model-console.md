# 模型管理操作指南

## 概述

本指南旨在帮助服务管理者了解和使用Bella-OpenAPI平台的模型管理功能。通过本文档，您将学会如何使用Web控制台和API接口来添加、配置和管理AI模型及其关联的渠道。

Bella-OpenAPI是一个多厂商AI服务统一接入平台，支持OpenAI、阿里云、火山引擎、AWS Bedrock等多种AI服务提供商。平台通过统一的接口规范和灵活的协议适配机制，为用户提供一致的AI服务体验。

## 核心概念

### 模型(Model)
模型是AI服务的核心实体，定义了AI模型的能力边界和基础属性，包含：
- **基础信息**：模型名称、文档地址、所有者信息
- **状态控制**：激活/停用、公开/私有状态
- **模型属性(Properties)**：模型本身的能力参数（如上下文长度、支持的语音类型等）
- **模型特性(Features)**：模型具备的AI能力开关（如流式输出、函数调用、视觉能力等）
- **端点关联**：模型支持的API端点类型
- **所有者类型**：system(系统级)、org(组织级)、person(个人级)，org(组织级)目前暂未实现
- **所有者编号**：system类型，统一为0；如果是person类型，则为用户id，比如ucid

> **重要区别**：模型特性描述的是AI模型"能做什么"，与具体服务商实现无关；而渠道特性描述的是服务商"怎么实现"，与具体协议和技术实现相关。

### 渠道(Channel)
渠道是模型的具体服务实现，连接特定的AI服务供应商，包含：
- **服务配置**：厂商协议、服务URL、认证信息
- **协议属性(Protocol Properties)**：服务商特定的技术实现参数
- **路由策略**：优先级、数据流向、负载均衡
- **价格信息**：调用成本配置
- **安全控制**：访问权限、安全级别
- **所有者类型**：system(系统级)、org(组织级)、person(个人级)，org(组织级)目前暂未实现
- **所有者编号**：system类型，统一为0；如果是person类型，则为用户id，比如ucid

> **渠道特性**：描述具体服务商的API接口能力和技术实现细节，如是否支持StreamOptions参数、API版本要求等。

### 端点(Endpoint)
端点定义了不同类型的AI服务接口：
- `/v1/chat/completions` - 对话完成
- `/v1/audio/speech` - 语音合成(TTS)
- `/v1/audio/realtime` - 实时音频对话
- `/v1/images/generations` - 图像生成
- `/v1/embeddings` - 文本向量化

### 协议适配
平台支持多种厂商协议的统一接入：
- **OpenAI协议** - OpenAI、火山引擎等
- **阿里云协议** - 阿里云通义千问
- **AWS协议** - AWS Bedrock
- **自定义协议** - 支持扩展其他厂商

## Web控制台操作指南

### 访问控制台

访问模型管理控制台：
```
https://your-domain/meta/console/model
```

### 创建模型

#### 1. 进入创建页面
- 访问 `https://your-domain/meta/console/model/create`
- 或在模型列表页面点击"添加模型"按钮

#### 2. 选择能力点
首先选择模型支持的端点类型：
- **对话完成** (`/v1/chat/completions`) - 支持文本对话、函数调用、视觉理解
- **语音合成** (`/v1/audio/speech`) - 文本转语音
- **实时音频** (`/v1/audio/realtime`) - 实时语音对话
- **图像生成** (`/v1/images/generations`) - 文本生成图像
- **文本向量化** (`/v1/embeddings`) - 文本转向量

> **重要提示**：选择端点后，系统会自动加载对应的属性和特性配置表单

#### 3. 填写基础信息
- **模型名称**：全局唯一标识符，建议使用描述性名称
- **文档URL**：模型的官方文档链接（可选）
- **所有者类型**：模型的归属类型
  - `system`：系统级，全平台共享，仅管理员可管理
  - `org`：组织级，组织内共享，组织管理员可管理
  - `person`：个人级，仅个人使用，个人用户可管理
- **所有者编码**：所有者的唯一标识
- **所有者名称**：所有者的显示名称
- **可见性**：
  - `public`：公开可见
  - `private`：私有访问
  - `protected`：受保护访问

#### 4. 配置模型属性
模型属性定义了AI模型本身的能力参数，根据选择的端点显示相应配置项：

**对话模型属性 (CompletionModelProperties)** - 适用于 `/v1/chat/completions`
- `max_input_context` - 最大输入上下文长度（token数）
- `max_output_context` - 最大输出上下文长度（token数）

**语音模型属性 (VoiceProperties)** - 适用于 `/v1/audio/speech` 和 `/v1/audio/realtime`
- `voiceTypes` - 支持的语音类型映射，格式为 `{"key": "voice_name"}`

> **注意**：目前系统中缺少以下端点的模型属性定义，这些将在后续版本中补充：
> - **EmbeddingProperties** - 文本向量化模型属性
> - **ASRProperties** - 语音识别模型属性
> - **ImagesProperties** - 图像生成模型属性

#### 5. 配置模型特性
模型特性定义了AI模型具备的功能能力，根据端点类型选择支持的特性：

**对话模型特性 (CompletionModelFeatures)** - 适用于 `/v1/chat/completions`
- `stream` - 是否支持流式输出
- `function_call` - 是否支持函数调用
- `stream_function_call` - 是否支持函数调用的流式输出
- `parallel_tool_calls` - 是否支持并行工具调用
- `vision` - 是否支持视觉理解
- `json_format` - 是否支持JSON格式输出
- `json_schema` - 是否支持JSON Schema输出
- `reason_content` - 是否支持思考过程输出
- `prompt_cache` - 是否支持提示词缓存

**TTS模型特性 (TTSModelFeatures)** - 适用于 `/v1/audio/speech`
- `stream` - 是否支持流式音频输出

**图像模型特性 (ImagesModelFeatures)** - 适用于 `/v1/images/generations`
- `highQuality` - 是否支持高质量生成
- `multipleStyles` - 是否支持多种风格
- `customSize` - 是否支持自定义尺寸

> **注意**：以下端点的模型特性定义将在后续版本中补充：
> - **EmbeddingModelFeatures** - 文本向量化模型特性
> - **ASRModelFeatures** - 语音识别模型特性

#### 6. 提交创建
点击"创建模型"按钮完成模型创建。成功后会跳转到模型详情页面。

### 管理现有模型

#### 1. 查看模型列表
在模型管理页面可以看到所有模型，支持按以下条件筛选：
- 端点类型
- 模型名称
- 供应商
- 状态（激活/停用）
- 可见性（公开/私有）

#### 2. 编辑模型信息
在模型详情页面可以：
- **修改基础信息**：直接点击字段进行在线编辑
- **更新属性配置**：修改模型的协议属性
- **调整特性设置**：开启或关闭功能特性
- **管理端点关联**：添加或移除支持的端点

#### 3. 状态控制
- **激活/停用模型**：控制模型是否可用于服务
- **发布/取消发布**：控制模型的公开可见性
- **软链接管理**：设置模型别名或重定向

### 渠道管理

#### 1. 查看模型渠道
在模型详情页面的"渠道列表"部分可以看到：
- 关联的所有渠道
- 渠道状态和优先级
- 服务商和协议信息
- 价格配置

#### 2. 创建渠道
点击"添加渠道"按钮，填写以下信息：
- **渠道编码**：唯一标识符
- **协议类型**：选择支持的协议适配器
- **服务商**：AI服务提供商名称
- **服务URL**：API端点地址
- **优先级**：high/normal/low
- **数据流向**：inner/mainland/overseas/protected

#### 3. 配置渠道信息
根据选择的协议类型，配置相应的渠道参数：

**OpenAI协议配置**
```json
{
  "auth": {
    "type": "BEARER",
    "apiKey": "your-api-key"
  },
  "deployName": "gpt-4",
  "apiVersion": "2024-02-01",
  "supportStreamOptions": true
}
```

**阿里云协议配置**
```json
{
  "auth": {
    "type": "BEARER",
    "apiKey": "your-api-key"
  },
  "deployName": "qwen-turbo"
}
```

**AWS协议配置**
```json
{
  "auth": {
    "type": "IAM",
    "apiKey": "access-key-id",
    "secret": "secret-access-key"
  },
  "region": "us-east-1"
}
```

#### 4. 价格配置
设置渠道的价格信息：
```json
{
  "input": 0.01,  // 输入token价格
  "output": 0.02, // 输出token价格
}
```
详情见：[价格信息配置说明](#价格信息配置说明)

## API接口操作指南

### 认证方式
所有API调用都需要在请求头中包含认证信息：
```
Authorization: Bearer your-api-key
```

### 模型管理API

#### 创建模型
```http
POST /console/model
Content-Type: application/json

{
  "modelName": "gpt-4-turbo",
  "documentUrl": "https://docs.openai.com/gpt-4",
  "properties": "{\"max_input_context\": 128000, \"max_output_context\": 4096}",
  "features": "{\"stream\": true, \"function_call\": true, \"vision\": true}",
  "ownerType": "system",
  "ownerCode": "0",
  "ownerName": "system",
  "visibility": "private",
  "status": "active",
  "endpoints": ["/v1/chat/completions"],
  "userName": "system",
  "userId": 0
}
```

#### 更新模型
```http
PUT /console/model
Content-Type: application/json

{
  "modelName": "gpt-4-turbo",
  "documentUrl": "https://updated-docs.com",
  "properties": "{\"max_input_context\": 200000}",
  "userName": "system",
  "userId": 0
  
}
```

#### 激活/停用模型
```http
POST /console/model/activate
Content-Type: application/json

{
  "modelName": "gpt-4-turbo",
  "userName": "system",
  "userId": 0
}
```

```http
POST /console/model/inactivate
Content-Type: application/json

{
  "modelName": "gpt-4-turbo",
  "userName": "system",
  "userId": 0
}
```

#### 发布/取消发布模型
```http
POST /console/model/publish
Content-Type: application/json

{
  "modelName": "gpt-4-turbo",
  "userName": "system",
  "userId": 0
}
```

```http
POST /console/model/publish/cancel
Content-Type: application/json

{
  "modelName": "gpt-4-turbo",
  "userName": "system",
  "userId": 0
}
```

#### 创建模型软链接
```http
POST /console/model/link
Content-Type: application/json

{
  "modelName": "gpt-4-latest",
  "linkedTo": "gpt-4-turbo",
  "userName": "system",
  "userId": 0
}
```

#### 查询模型详情
```http
GET /console/model/details?modelName=gpt-4-turbo
```

#### 查询模型列表
```http
GET /console/model/list?endpoint=/v1/chat/completions&status=active&visibility=public
```

### 渠道管理API

#### 创建渠道
```http
POST /console/channel
Content-Type: application/json

{
  "entityType": "model",
  "entityCode": "gpt-4-turbo",
  "channelCode": "openai-gpt4-channel-001",
  "status": "active",
  "dataDestination": "overseas",
  "priority": "high",
  "protocol": "OpenAICompletion",
  "supplier": "OpenAI",
  "url": "https://api.openai.com/v1/chat/completions",
  "channelInfo": "{\"auth\":{\"type\":\"BEARER\",\"apiKey\":\"sk-xxx\"},\"deployName\":\"gpt-4-turbo\"}",
  "priceInfo": "{\"input\":0.01,\"output\":0.03}",
  "trialEnabled": 1,
  "userName": "system",
  "userId": 0
}
```

#### 更新渠道
```http
PUT /console/channel
Content-Type: application/json

{
  "channelCode": "openai-gpt4-channel-001",
  "priority": "normal",
  "userName": "system",
  "userId": 0
}
```

#### 激活/停用渠道
```http
POST /console/channel/activate
Content-Type: application/json

{
  "channelCode": "openai-gpt4-channel-001",
  "userName": "system",
  "userId": 0
}
```

```http
POST /console/channel/inactivate
Content-Type: application/json

{
  "channelCode": "openai-gpt4-channel-001",
  "userName": "system",
  "userId": 0
}
```

### 元数据查询API

#### 获取端点列表
```http
GET /v1/meta/endpoint/list?status=active
```

#### 获取模型属性Schema
```http
GET /v1/meta/schema/modelProperty?endpoints=/v1/chat/completions,/v1/embeddings
```

#### 获取模型特性Schema
```http
GET /v1/meta/schema/modelFeature?endpoints=/v1/chat/completions
```

#### 获取渠道信息Schema
```http
GET /v1/meta/schema/channelInfo?entityType=model&entityCode=gpt-4-turbo&protocol=OpenAICompletion
```

#### 获取价格信息Schema
```http
GET /v1/meta/schema/priceInfo?entityType=model&entityCode=gpt-4-turbo
```

#### 查询支持的协议
```http
GET /v1/meta/protocol/list?entityType=model&entityCode=gpt-4-turbo
```

## 不同端点的协议属性详解

### /v1/chat/completions - 对话完成

#### 基础协议属性 (CompletionProperty)
- `encodingType` - 编码类型，影响token计算方式
- `mergeReasoningContent` - 是否合并推理内容到响应中
- `splitReasoningFromContent` - 是否从内容中分离推理过程
- `functionCallSimulate` - 是否强制支持函数调用（对不支持的模型进行模拟）
- `extraHeaders` - 额外的HTTP请求头配置
- `queueName` - 队列配置，配置后请求会通过bella-queue服务代理

#### OpenAI协议特定属性 (OpenAIProperty)
- `auth.type` - 认证类型：BEARER（默认）、BASIC、CUSTOM等
- `auth.apiKey` - API密钥
- `auth.header` - 自定义认证头（当type为CUSTOM时使用）
- `deployName` - 部署名称，某些服务商需要指定具体的部署实例
- `apiVersion` - API版本，用于URL拼接（如Azure OpenAI的url中带有，version='xxxx'）
- `supportStreamOptions` - 是否支持StreamOptions参数

#### 阿里云协议特定属性 (AliProperty)
- `auth` - 认证配置，通常使用BEARER类型
- `deployName` - 模型部署名称，如"qwen-turbo"

#### 火山协议特定属性 (HuoshanProperty)
基于OpenAI协议，额外支持：
- 自动处理"thinking"配置
- 支持推理过程控制

#### AWS协议特定属性 (AwsProperty)
- `auth.type` - 使用IAM认证
- `auth.apiKey` - AWS Access Key ID
- `auth.secret` - AWS Secret Access Key
- `region` - AWS区域，如"us-east-1"

### /v1/audio/speech - TTS语音合成

#### 基础协议属性 (TtsProperty)
- `encodingType` - 音频编码类型
- `defaultContentType` - 默认音频格式，如"wav"、"mp3"
- `defaultVoice` - 默认语音角色
- `defaultSampleRate` - 默认采样率

#### 火山TTS特定属性 (HuoShanProperty)
- `auth` - 认证配置
- `deployName` - 部署名称
- `appId` - 应用ID
- `cluster` - 集群配置
- `resourceId` - 资源ID
- `websocketUrl` - WebSocket连接地址

### /v1/audio/realtime - 实时音频对话

#### 基础协议属性 (RealtimeProperty)
继承自ASR属性，额外包含：
- `llmOption` - LLM配置选项
- `ttsOption` - TTS配置选项

#### LLM选项配置 (LlmOption)
- `MainLlmOption` - 主要LLM配置
  - `model` - 模型名称
  - `sysPrompt` - 系统提示词
  - `prompt` - 用户提示词
  - `temperature` - 温度参数
- `WorkerLlmOption[]` - 工作者LLM配置列表，支持并行处理

#### TTS选项配置 (TtsOption)
- `model` - TTS模型名称
- `voice` - 语音角色
- `sampleRate` - 采样率

### /v1/images/generations - 图像生成

#### 基础协议属性 (ImagesProperty)
- `auth` - 认证配置
- `deployName` - 部署名称

支持的图像模型特性：
- `highQuality` - 高质量生成
- `multipleStyles` - 多种风格支持
- `customSize` - 自定义尺寸支持

### /v1/embeddings - 文本向量化

#### 基础协议属性 (EmbeddingProperty)
- `encodingType` - 编码类型

#### OpenAI协议特定属性
- `auth` - 认证配置
- `deployName` - 部署名称
- `apiVersion` - API版本
- `batchSize` - 批处理大小，默认2048

## 模型特性与渠道特性的区别

### 核心概念差异

**模型特性(Model Features)**
- **定义**: 描述AI模型本身具备的能力和功能特征
- **特点**: 由模型的训练和架构决定，与服务商实现无关
- **作用**: 定义模型"能做什么"
- **示例**: stream(流式输出)、function_call(函数调用)、vision(视觉理解)

**渠道特性(Channel Properties)**
- **定义**: 描述具体服务商的API接口特性和技术实现细节
- **特点**: 与协议和服务商强相关，可能因服务商升级而变化
- **作用**: 定义服务商"怎么实现"
- **示例**: supportStreamOptions(支持StreamOptions参数)、apiVersion(API版本要求)

### 所有者类型详细说明

#### system (系统级)
- **使用场景**: 全平台公共服务，如主流AI模型和基础服务
- **权限特征**: 仅系统管理员可管理，对所有用户可见可用
- **典型示例**: gpt-4、gpt-3.5-turbo等主流模型

#### org (组织级)
- **使用场景**: 企业或组织内部共享的专属服务
- **权限特征**: 组织管理员可管理，仅组织成员可用
- **典型示例**: 企业定制模型、部门共享服务

#### person (个人级)
- **使用场景**: 用户个人专属的私有服务和配置
- **权限特征**: 仅用户本人可管理和使用
- **典型示例**: 个人API Key配置、个人微调模型

## 协议适配机制说明

### 适配器管理
Bella-OpenAPI通过AdaptorManager统一管理所有协议适配器：
- 系统启动时自动发现并注册所有适配器
- 按端点和协议类型进行二级映射
- 支持动态协议检查和适配器选择

### 请求转换流程
1. **参数预处理** - 根据厂商特殊要求调整请求参数
2. **格式转换** - 将OpenAI标准格式转换为目标厂商格式
3. **认证处理** - 添加厂商特定的认证信息
4. **URL构建** - 根据配置构建完整的请求URL

### 响应转换流程
1. **错误处理** - 统一异常处理和错误码转换
2. **格式转换** - 将厂商格式转换回OpenAI标准格式
3. **特殊处理** - 处理推理内容分离、Token统计等

### 流式处理适配
- 通过SseEventConverter进行SSE事件转换
- 使用责任链模式处理流式回调
- 支持不同厂商的流式协议差异

## 渠道路由策略

### 多维度筛选
渠道选择基于以下策略：
1. **权限过滤** - 私有渠道只能所有者使用
2. **安全级别过滤** - 根据数据流向限制访问权限
3. **可用性过滤** - 排除当前不可用的渠道

### 安全级别控制
- `protected` (10) - 最高安全级别，内部已备案
- `inner` (20) - 内部级别
- `mainland` (30) - 境内级别  
- `overseas` (40) - 境外级别

### 负载均衡策略
1. 按优先级分组（private > public，high > normal > low）
2. 在同优先级组内随机选择
3. 支持故障转移和多模型切换

## 价格信息配置说明

不同端点支持不同的价格信息结构：

### 对话完成 (CompletionPriceInfo)
```json
{
  "input": 0.01,
  "output": 0.03,
  "unit": "分/千token"
}
```

### 文本向量化 (EmbeddingPriceInfo)
```json
{
  "input": 0.01,
  "unit": "分/千token"
}
```

### 语音合成 (TtsPriceInfo)
```json
{
  "input": 0.1,
  "unit": "分/万字"
}
```

### 图像生成 (ImagesPriceInfo)
图像生成的价格信息结构最为复杂，支持多种尺寸、质量等级和token计费模式：

```json
{
  "details": [
    {
      "size": "1024x1024",
      "ldPricePerImage": 0.04,
      "mdPricePerImage": 0.08, 
      "hdPricePerImage": 0.12,
      "textTokenPrice": 0.01,
      "imageTokenPrice": 0.15
    },
    {
      "size": "512x512",
      "ldPricePerImage": 0.02,
      "mdPricePerImage": 0.04,
      "hdPricePerImage": 0.06,
      "textTokenPrice": 0.01,
      "imageTokenPrice": 0.10
    }
  ]
}
```

**价格维度说明**：
- `size` - 图片尺寸（如256x256、1024x1024、1792x1024等）
- `ldPricePerImage` - 低质量图片单价（元/张）
- `mdPricePerImage` - 中等质量图片单价（元/张）
- `hdPricePerImage` - 高质量图片单价（元/张）
- `textTokenPrice` - 文字token价格（元/千token）
- `imageTokenPrice` - 图片token价格（元/千token）

**支持的图像操作类型**：
- `/v1/images/generations` - 图像生成
- `/v1/images/edits` - 图像编辑
- `/v1/images/variations` - 图像变换

**Token计算规则**：
- 低分辨率图片（512x512）：85 tokens
- 高分辨率图片：`图像切片数 × 170 + 85` tokens
- 图像切片单位：512x512像素块

### ASR语音识别价格信息

**快速ASR (FlashAsrPriceInfo)**
```json
{
  "price": 0.02,
  "unit": "分/次"
}
```

**实时ASR (RealTimePriceInfo)**
```json
{
  "price": 1.5,
  "unit": "时/元"
}
```

**音频转写ASR (TranscriptionsAsrPriceInfo)**
```json
{
  "price": 1.0,
  "unit": "时/元"
}
```

## 最佳实践建议

### 模型配置建议
1. **命名规范** - 使用描述性且唯一的模型名称
2. **属性配置** - 根据实际模型能力设置上下文长度限制
3. **特性开关** - 仅启用模型实际支持的功能特性
4. **所有者选择** - 根据使用范围选择合适的所有者类型
5. **文档维护** - 提供详细的模型文档链接

### 渠道配置建议
1. **多渠道冗余** - 为重要模型配置多个渠道以提高可用性
2. **优先级设置** - 合理设置渠道优先级，优先使用高质量服务
3. **协议选择** - 根据供应商选择合适的协议适配器
4. **成本控制** - 准确配置价格信息以便成本统计
5. **安全分级** - 根据数据敏感性选择合适的数据流向

### 监控运维建议
1. **状态监控** - 定期检查模型和渠道状态
2. **性能监控** - 关注响应时间和成功率指标
3. **成本监控** - 跟踪API调用成本和使用量
4. **权限监控** - 监控不同所有者类型的访问情况
5. **日志分析** - 分析错误日志及时发现问题

### 扩展开发建议
1. **新协议适配** - 实现IProtocolAdaptor接口添加新厂商支持
2. **属性扩展** - 扩展Properties类满足新endpoint需求
3. **特性扩展** - 扩展Features类支持新模型能力
4. **监控集成** - 集成外部监控系统获取更多指标
5. **自动化运维** - 通过API实现自动化的模型和渠道管理

## 故障排查

### 常见问题

#### 模型创建失败
- 检查模型名称是否唯一
- 验证端点配置是否正确
- 确认属性和特性配置格式是否正确

#### 渠道不可用
- 检查渠道状态是否为激活
- 验证协议配置是否正确
- 确认认证信息是否有效
- 检查网络连接和URL可达性

#### 请求失败
- 查看错误日志获取详细错误信息
- 检查API Key和认证配置
- 验证请求参数是否符合目标厂商要求
- 确认模型特性与渠道特性的配置一致性

#### 权限问题
- 检查所有者类型和可见性设置
- 验证用户是否有访问模型或渠道的权限
- 检查组织成员身份和角色权限

#### 性能问题
- 检查渠道优先级配置
- 分析请求分发是否均匀
- 监控各渠道的响应时间
- 调整负载均衡策略

## 结语

通过本指南，您应该能够：

1. **理解核心概念** - 区分模型特性和渠道特性，掌握所有者类型的使用场景
2. **熟练操作** - 使用Web控制台和API接口进行模型和渠道管理
3. **合理配置** - 根据不同端点和供应商选择合适的属性和特性配置
4. **解决问题** - 快速诊断和解决常见的配置和运行问题

Bella-OpenAPI为企业提供了一个统一、灵活、可扩展的AI服务接入平台。如有进一步问题，请参考API文档或联系技术支持团队。
