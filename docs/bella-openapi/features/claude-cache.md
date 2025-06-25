# 为Claude开启提示词缓存

本文档介绍如何在Bella OpenAPI中为Claude模型开启提示词缓存功能，以提高大型上下文处理的效率和降低成本。

## 概述

Claude的提示词缓存功能允许缓存长内容（如文档、代码库或对话历史），在后续请求中重用这些内容而无需重新处理，从而显著提高响应速度并降低成本。缓存内容的token计费为正常价格的1/10。

## 配置要求

### 1. 通道配置 (使用者无需关注)

在创建或编辑AWS Bedrock通道时，需要设置以下配置：

```json
{
   "auth": {
      "apiKey": "your-aws-access-key-id",
      "secret": "your-aws-secret-access-key"
   },
   "region": "us-east-1",
   "deployName": "anthropic.claude-3-5-sonnet-20241022-v2:0",
   "supportCache": true,
   "additionalParams": {}
}
```

**重要参数说明：**
- `supportCache`: 必须设置为 `true` 以启用缓存功能
- `deployName`: 确保使用支持缓存的Claude模型版本

### 2. 支持的模型

目前支持缓存的Claude模型包括：
- `claude-opus-4`
- `claude-4-sonnet`
- `claude-3.7-sonnet`

## 缓存机制说明

### 缓存层级结构

缓存前缀按以下顺序创建，形成层级结构：
1. **Tools** - 工具定义
2. **System** - 系统消息
3. **Messages** - 对话消息

每个层级都基于前一个层级构建，系统会自动检查之前位置的缓存命中，并使用找到的最长匹配前缀。

### 多个缓存断点

你可以使用 `cache_control` 参数定义最多 **4个缓存断点**，允许分别缓存不同的可重用部分。以下是符合 OpenAI Chat Completions API 格式的示例：

```json
{
  "model": "claude-4-sonnet",
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "search_documents",
        "description": "搜索知识库",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {"type": "string", "description": "搜索查询"}
          },
          "required": ["query"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_document", 
        "description": "根据ID获取文档",
        "parameters": {
          "type": "object",
          "properties": {
            "doc_id": {"type": "string", "description": "文档ID"}
          },
          "required": ["doc_id"]
        }
      },
      "cache_control": {"type": "ephemeral"}
    }
  ],
  "messages": [
    {
      "role": "system",
      "content": [
        {
          "type": "text",
          "text": "你是一个有用的研究助手，可以访问文档知识库。",
          "cache_control": {"type": "ephemeral"}
        },
        {
          "type": "text", 
          "text": "知识库上下文：这里是相关文档...",
          "cache_control": {"type": "ephemeral"}
        }
      ]
    },
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "我已搜索到相关信息，以下是分析结果...",
          "cache_control": {"type": "ephemeral"}
        }
      ]
    },
    {
      "role": "user", 
      "content": "请继续深入分析"
    }
  ]
}
```

### 完整的4个缓存断点示例

以下是一个完整的示例，展示如何使用所有4个可用的缓存断点来优化提示词的不同部分：

```bash
curl -X POST "https://your-bella-api.com/v1/chat/completions" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-4-sonnet",
    "max_tokens": 8000,
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "search_documents",
          "description": "搜索知识库",
          "parameters": {
            "type": "object",
            "properties": {
              "query": {
                "type": "string",
                "description": "搜索查询"
              }
            },
            "required": ["query"]
          }
        }
      },
      {
        "type": "function",
        "function": {
          "name": "get_document",
          "description": "根据ID获取特定文档",
          "parameters": {
            "type": "object",
            "properties": {
              "doc_id": {
                "type": "string",
                "description": "文档ID"
              }
            },
            "required": ["doc_id"]
          }
        },
        "cache_control": {"type": "ephemeral"}
      }
    ],
    "messages": [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": "你是一个有用的研究助手，可以访问文档知识库。\n\n# 指令\n- 在回答前总是搜索相关文档\n- 为你的来源提供引用\n- 在回应中保持客观和准确\n- 如果多个文档包含相关信息，请综合它们\n- 当知识库中没有信息时，请承认",
            "cache_control": {"type": "ephemeral"}
          },
          {
            "type": "text",
            "text": "# 知识库上下文\n\n以下是此对话的相关文档：\n\n## 文档1：太阳系概述\n太阳系由太阳和所有围绕它运行的天体组成...\n\n## 文档2：行星特征\n每个行星都有独特的特征。水星是最小的行星...\n\n## 文档3：火星探索\n火星几十年来一直是探索的目标...\n\n[其他文档...]",
            "cache_control": {"type": "ephemeral"}
          }
        ]
      },
      {
        "role": "user",
        "content": "你能搜索有关火星漫游者的信息吗？"
      },
      {
        "role": "assistant",
        "content": "",
        "tool_calls": [
          {
            "id": "tool_1",
            "type": "function",
            "function": {
              "name": "search_documents",
              "arguments": "{\"query\": \"火星漫游者\"}"
            }
          }
        ]
      },
      {
        "role": "tool",
        "tool_call_id": "tool_1",
        "content": "找到3个相关文档：文档3（火星探索）、文档7（漫游者技术）、文档9（任务历史）"
      },
      {
        "role": "assistant",
        "content": [
          {
            "type": "text",
            "text": "我找到了3个关于火星漫游者的相关文档。让我从火星探索文档中获取更多详细信息。",
            "cache_control": {"type": "ephemeral"}
          }
        ]
      },
      {
        "role": "user",
        "content": "是的，请具体告诉我毅力号漫游者的情况。"
      }
    ]
  }'
```

#### 4个缓存断点详细说明

这个综合示例演示了如何使用所有4个可用的缓存断点来优化提示词的不同部分：

##### 缓存断点1：工具定义缓存
```json
{
  "name": "get_document",
  "cache_control": {"type": "ephemeral"}
}
```
- **用途**：缓存所有工具定义
- **适用场景**：工具定义通常在整个会话中保持不变
- **优化效果**：避免重复处理工具schema和描述

##### 缓存断点2：可重用指令缓存
```json
{
  "type": "text",
  "text": "你是一个有用的研究助手...",
  "cache_control": {"type": "ephemeral"}
}
```
- **用途**：缓存系统提示词中的静态指令部分
- **适用场景**：基础角色定义和行为指令很少改变
- **优化效果**：这些指令可以在多个请求之间重用

##### 缓存断点3：RAG上下文缓存
```json
{
  "type": "text", 
  "text": "# 知识库上下文\n\n以下是此对话的相关文档：...",
  "cache_control": {"type": "ephemeral"}
}
```
- **用途**：独立缓存知识库文档
- **适用场景**：RAG应用中的大型文档上下文
- **优化效果**：可以更新RAG文档而不影响工具或指令缓存

##### 缓存断点4：对话历史缓存
```json
{
  "type": "text",
  "text": "我找到了3个关于火星漫游者的相关文档...",
  "cache_control": {"type": "ephemeral"}
}
```
- **用途**：启用对话进展的增量缓存
- **适用场景**：长对话需要保持上下文
- **优化效果**：随着对话发展逐步建立缓存

#### 缓存策略的灵活性

这种方法提供了最大的灵活性：

1. **仅更新最终用户消息**：重用所有四个缓存段
2. **更新RAG文档但保持相同工具和指令**：重用前两个缓存段
3. **改变对话但保持相同工具、指令和文档**：重用前三个段
4. **每个缓存断点都可以根据应用程序中的变化独立失效**

#### Token使用说明

**首次请求**：
- `input_tokens`: 最终用户消息中的token
- `cache_creation_input_tokens`: 所有缓存段中的token（工具+指令+RAG文档+对话历史）
- `cache_read_input_tokens`: 0（无缓存命中）

**仅有新用户消息的后续请求**：
- `input_tokens`: 仅新用户消息中的token
- `cache_creation_input_tokens`: 添加到对话历史的任何新token
- `cache_read_input_tokens`: 所有先前缓存的token（工具+指令+RAG文档+先前对话）

#### 最佳应用场景

这种模式特别适用于：

- **RAG应用**：具有大型文档上下文的检索增强生成
- **Agent系统**：使用多个工具的智能代理
- **长期对话**：需要维护上下文的长时间交互
- **独立优化应用**：需要独立优化提示词不同部分的应用

## 缓存限制

#### 最小缓存长度
- **Claude Opus 4, Sonnet 4, Sonnet 3.7, Sonnet 3.5, Opus 3**: 1024 tokens
- **Claude Haiku 3.5, Haiku 3**: 2048 tokens

短于最小长度的提示词无法缓存，即使标记了 `cache_control`。系统会正常处理这些请求但不会缓存。

#### 其他限制
- 并发请求时，缓存条目只有在第一个响应开始后才可用
- 如果需要并行请求的缓存命中，请等待第一个响应后再发送后续请求
- 目前只支持 "ephemeral" 缓存类型，默认生命周期为 **5分钟**

## 可缓存和不可缓存的内容

#### 可缓存的内容
使用 `cache_control` 可以缓存以下内容块：

- **Tools**: `tools` 数组中的工具定义
- **System messages**: `system` 数组中的内容块
- **Text messages**: `messages.content` 数组中的内容块（用户和助手轮次）
- **Images & Documents**: `messages.content` 数组中的内容块（用户轮次）
- **Tool use and tool results**: `messages.content` 数组中的内容块（用户和助手轮次）

#### 不可缓存的内容
- **Thinking blocks**: 无法直接缓存，但当它们出现在之前的助手轮次中时，可以与其他内容一起缓存
- **子内容块**: 如引用(citations)等无法直接缓存，应缓存顶级块
- **空文本块**: 无法缓存

## 使用方法

### 基本缓存使用

在消息内容中添加 `cache_control` 字段来标记需要缓存的内容：

#### 1. System消息缓存

```json
{
  "model": "claude-4-sonnet",
  "messages": [
    {
      "role": "system",
      "content": [
        {
          "type": "text",
          "text": "You are an expert software engineer. Here is the complete codebase you'll be working with...",
          "cache_control": {"type": "ephemeral"}
        }
      ]
    },
    {
      "role": "user",
      "content": "请分析这个代码库的架构"
    }
  ]
}
```

#### 2. User消息缓存

```json
{
  "model": "claude-4-sonnet",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "请总结这个文档的要点"
        },
        {
          "type": "text",
          "text": "这是一个大型文档的内容...",
          "cache_control": {"type": "ephemeral"}
        }
      ]
    }
  ]
}
```

#### 3. 图片内容缓存

```json
{
  "model": "claude-4-sonnet",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
          },
          "cache_control": {"type": "ephemeral"}
        },
        {
          "type": "text",
          "text": "请分析这张图片"
        }
      ]
    }
  ]
}
```

#### 4. Tool定义缓存

```json
{
  "model": "claude-4-sonnet",
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "search",
        "description": "搜索工具",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {"type": "string"}
          },
          "required": ["query"]
        }
      },
      "cache_control": {"type": "ephemeral"}
    }
  ],
  "messages": [
    {
      "role": "user",
      "content": "请使用search工具查找相关信息"
    },
    {
      "role": "assistant",
      "content": "",
      "tool_calls": [
        {
          "id": "call_123",
          "type": "function",
          "function": {
            "name": "search",
            "arguments": "{\"query\": \"Claude API\"}"
          }
        }
      ]
    },
    {
      "role": "tool",
      "tool_call_id": "call_123",
      "content": [
        {
          "type": "text",
          "text": "搜索结果：大量的搜索结果内容...",
          "cache_control": {"type": "ephemeral"}
        }
      ]
    },
    {
      "role": "user",
      "content": "基于搜索结果回答我的问题"
    }
  ]
}
```

### 流式响应缓存

流式响应同样支持缓存：

```json
{
  "model": "claude-4-sonnet",
  "messages": [
    {
      "role": "system",
      "content": [
        {
          "type": "text",
          "text": "长系统提示词内容...",
          "cache_control": {"type": "ephemeral"}
        }
      ]
    },
    {
      "role": "user",
      "content": "请逐步分析"
    }
  ],
  "stream": true
}
```

## 最佳实践

### 1. 缓存策略

- **大内容优先**: 优先缓存超过最小token要求的内容
- **重复使用**: 确保缓存的内容会在多个请求中重复使用
- **合理位置**: 将静态内容（工具定义、系统指令、上下文、示例）放在提示词开头
- **结构化布局**: 按照 tools → system → messages 的层级结构组织内容

### 2. 成本优化

- 缓存的内容按1/10价格计费
- 首次请求会产生缓存写入成本
- 后续请求享受缓存读取优惠价格
- 响应使用情况字段检查是否成功缓存：
   - `cache_creation_input_tokens`: 缓存创建的token数
   - `cache_read_input_tokens`: 从缓存读取的token数

### 3. 性能优化

- 缓存大型文档、代码库、对话历史
- 避免缓存经常变化的内容
- 合理组织消息结构，将稳定内容放在前面
- 利用多个缓存断点分别缓存不同类型的可重用内容

### 4. 并发处理

- 对于并发请求，等待第一个响应开始后再发送后续请求以获得缓存命中
- 缓存条目只有在第一个响应开始后才对其他请求可用

## 完整示例

以下是一个完整的API调用示例：

```bash
curl -X POST "https://your-bella-api.com/v1/chat/completions" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "messages": [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": "You are an expert code reviewer. Here is the complete codebase:\n\npackage com.example;\n\npublic class Application {\n    // 大量代码内容...\n}",
            "cache_control": {"type": "ephemeral"}
          }
        ]
      },
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Please review this code and provide suggestions for improvement."
          }
        ]
      }
    ],
    "max_tokens": 1000,
    "temperature": 0.7
  }'
```

## 技术实现说明

### 处理流程

1. **请求接收**: `ChatController.completion()` 接收请求 (ChatController.java:63)
2. **通道路由**: 系统根据模型选择AWS Bedrock适配器
3. **请求转换**: `TransferToCompletionsUtils.convertRequest()` 处理缓存标记
4. **缓存处理**:
   - **Tools**: `setTools()` 和 `createMessageTool()` 方法处理工具定义的缓存标记
   - **System消息**: `convertMessages()` 方法中处理system内容转换
   - **User/Assistant消息**: `convertContentPartToBlock()` 方法处理消息内容块
5. **API调用**: `AwsAdaptor.completion()` 调用AWS Bedrock API (AwsAdaptor.java:40)

### 缓存点处理

基于 `TransferToCompletionsUtils.java` 的实现，系统在以下位置处理 `cache_control`：

#### 文本内容块处理
```java
// 在convertContentPartToBlock方法中
if ("text".equals(type)) {
    MessageRequest.TextContentBlock textBlock = new MessageRequest.TextContentBlock();
    textBlock.setText((String) part.get("text"));
    textBlock.setCache_control(part.get("cache_control")); // 处理缓存控制
    return textBlock;
}
```

#### 图片内容块处理
```java
// 图片内容块也支持缓存控制
MessageRequest.ImageContentBlock imageBlock = new MessageRequest.ImageContentBlock();
// ... 设置图片相关属性
imageBlock.setCache_control(part.get("cache_control")); // 处理缓存控制
return imageBlock;
```

#### 请求文本块处理
```java
// 在convertContentToMessageFormat方法中
if ("text".equals(part.get("type"))) {
    MessageRequest.RequestTextBlock textBlock = new MessageRequest.RequestTextBlock();
    textBlock.setType("text");
    textBlock.setText((String) part.get("text"));
    textBlock.setCache_control(part.get("cache_control")); // 处理缓存控制
    textBlocks.add(textBlock);
}
```

#### 工具缓存处理
```java
// 在createMessageTool方法中处理工具缓存
private static MessageRequest.Tool createMessageTool(Message.Tool tool) {
    MessageRequest.Tool.ToolBuilder toolBuilder = MessageRequest.Tool.builder()
            .name(tool.getFunction().getName())
            .description(tool.getFunction().getDescription())
            .cache_control(tool.getCache_control()); // 处理工具缓存控制
    
    // 处理参数定义
    if (tool.getFunction().getParameters() != null) {
        Message.Function.FunctionParameter params = tool.getFunction().getParameters();
        MessageRequest.InputSchema.InputSchemaBuilder schemaBuilder = MessageRequest.InputSchema.builder()
                .type(params.getType())
                .additionalProperties(params.isAdditionalProperties());
        
        if (params.getProperties() != null) {
            schemaBuilder.properties(params.getProperties());
        }
        if (params.getRequired() != null) {
            schemaBuilder.required(params.getRequired());
        }
        
        toolBuilder.inputSchema(schemaBuilder.build());
    }
    
    return toolBuilder.build();
}
```

### 消息转换流程

`TransferToCompletionsUtils` 提供了完整的消息转换流程：

1. **基本参数设置**: `setBasicParameters()` 设置模型、token限制、温度等
2. **消息转换**: `convertMessages()` 处理消息列表，分离system和对话消息
3. **工具处理**: `setTools()` 和 `setToolChoice()` 处理工具定义和选择
4. **推理配置**: `setThinkingConfig()` 处理推理相关配置

每个步骤都会保留原始请求中的 `cache_control` 设置，确保缓存标记正确传递给底层API。

## 注意事项

1. **配置检查**: 确保通道配置中 `supportCache` 为 `true` （使用者无需关注）
2. **模型支持**: 只有支持缓存的Claude模型版本才能使用此功能
3. **内容大小**: 确保缓存内容达到最小token要求才有效果
4. **缓存生命周期**: 缓存会在5分钟后失效，需要重新建立
5. **最大断点数**: 最多支持4个缓存断点
6. **并发限制**: 并发请求时需等待第一个响应开始后才能获得缓存命中

通过正确使用Claude的提示词缓存功能，您可以显著提高大内容处理的效率，同时降低API调用成本。合理利用多个缓存断点和层级结构，可以实现更精细的缓存控制和更好的性能表现。
