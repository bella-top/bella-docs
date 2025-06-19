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
- `claude-3.5-sonnet`
- `claude-3.7-sonnet`
- `claude-4-sonnet`

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
          "text": "这是一个大型文档的内容...",
          "cache_control": {"type": "ephemeral"}
        },
        {
          "type": "text",
          "text": "请总结这个文档的要点"
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

#### 4. Tool调用结果缓存

```json
{
  "model": "claude-4-sonnet",
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
          },
          "cache_control": {"type": "ephemeral"}
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

- **大内容优先**: 优先缓存超过1000个token的内容
- **重复使用**: 确保缓存的内容会在多个请求中重复使用
- **合理位置**: 将`cache_control`放在内容块的最后部分

### 2. 成本优化

- 缓存的内容按1/10价格计费
- 首次请求会产生缓存写入成本
- 后续请求享受缓存读取优惠价格

### 3. 性能优化

- 缓存大型文档、代码库、对话历史
- 避免缓存经常变化的内容
- 合理组织消息结构，将稳定内容放在前面

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
3. **请求转换**: `AwsCompletionConverter.convert2AwsRequest()` 处理缓存标记 (AwsCompletionConverter.java:72)
4. **缓存处理**: 
   - System消息: `convert2AwsSystemContent()` 方法处理 (AwsCompletionConverter.java:315)
   - User/Assistant消息: `convert2AwsContent()` 方法处理 (AwsCompletionConverter.java:363)
5. **API调用**: `AwsAdaptor.completion()` 调用AWS Bedrock API (AwsAdaptor.java:40)

### 缓存点插入

当检测到 `cache_control` 字段时，系统会自动在相应位置插入 `CachePointBlock`:

```java
// 在System消息中插入缓存点
if (hasCacheControl && property.supportCache) {
    blocks.add(SystemContentBlock.builder()
            .cachePoint(CachePointBlock.builder()
                    .type("default")
                    .build())
            .build());
}
```

## 注意事项

1. **配置检查**: 确保通道配置中 `supportCache` 为 `true` （使用者无需关注）
2. **模型支持**: 只有支持缓存的Claude模型版本才能使用此功能
3. **内容大小**: 建议缓存内容超过1000个token才有明显效果
4. **缓存生命周期**: 缓存会在一定时间后失效，需要重新建立，目前为5min

通过正确使用Claude的提示词缓存功能，您可以显著提高大内容处理的效率，同时降低API调用成本。

