# 如何开启深度思考

本文档介绍如何在Bella OpenAPI中为不同的AI模型开启深度思考功能。深度思考功能允许模型在生成最终答案前进行内部推理，从而提供更准确、更深入的回答。

## 概述

Bella OpenAPI支持多个AI提供商的深度思考功能，通过统一的OpenAI协议`reasoning_effort`参数进行控制。系统会根据不同的模型协议自动转换为相应的原生参数格式。

## 支持的模型和协议

### 1. Claude系列 (AWS Bedrock)

**支持的模型:**
- `claude-3.7-sonnet`
- `claude-4-sonnet`
- 其他支持推理的Claude模型版本

**实现方式:**
- 通过`reasoning_effort`参数或将`reasoning_effort`配置参数Claude模型协议的`thinking`

### 2. 通义千问系列 (Qwen)

**支持的模型:**
- `qwen3-235b-a22b`
- `qwq-plus`
- 其他支持思考模式的Qwen模型

**实现方式:**
- 通过`reasoning_effort`参数或`enable_thinking`参数开启思考模式

### 3. Gemini系列 (Google)

**支持的模型:**
- `gemini-2.5-pro`
- 其他支持思考功能的Gemini模型

**实现方式:**
- 通过标准协议的`reasoning_effort`参数或`extra_body`中的Google特定思考配置

### 4. DeepSeek系列

**支持的模型:**
- `deepseek-reasoner` (R1)

**特殊说明:**
- DeepSeek R1模型默认启用深度思考且不支持关闭
- 无需额外配置，模型会自动进行推理

### 5. 豆包系列 (Doubao)

**支持的模型:**
- `doubao-seed-1.6`
- 其他支持思考模式的doubao模型

**特殊说明:**
- doubao-seed-1.6-thinking模型默认启用深度思考且不支持关闭

### 5. Openai系列
**支持的模型:**
- `gpt-5`
- `gpt-5-mini`
- `gpt-5-nano`
- `o系列`

## 使用方法

### 标准协议方式

使用统一的`reasoning_effort`参数，支持4个标准级别：null(不开启)，low，medium，high

#### 基础用法

- 支持所有可开启/关闭深度思考的模型

```json
{
  "model": "claude-4-sonnet",
  "messages": [
    {
      "role": "user",
      "content": "请解决这个复杂的数学问题：..."
    }
  ],
  "reasoning_effort": "medium"
}
```

#### 支持的标准级别

- **`"low"`**: 低强度思考（对于claude模型：预算token: 2000）
- **`"medium"`**: 中等强度思考（对于claude模型：预算token: 4000）  
- **`"high"`**: 高强度思考（对于claude模型：预算token: 8000）
- 对于qwen、google、doubao系列模型，请求协议中只能控制是否开启，无法控制思考程度

### 各协议详细示例

#### 1. Claude 深度思考

**Claude协议方式:**
```json
{
  "model": "claude-4-sonnet",
  "messages": [
    {
      "role": "user",
      "content": "请详细分析这个复杂的业务场景..."
    }
  ],
  "reasoning_effort": {
    "type": "enabled",
    "budget_tokens": 10000
  }
}
```

#### 2. 通义千问 深度思考

- 开启深度思考时只支持流式请求
**通义千问协议方式:**
```json
{
  "model": "qwen3-235b-a22b",
  "messages": [
    {
      "role": "user",
      "content": "请逐步推理解决这个逻辑问题..."
    }
  ],
  "enable_thinking": true,
  "stream": true
}
```

#### 3. Gemini 深度思考

**google协议方式:**
```json
{
  "model": "gemini-2.5-pro",
  "messages": [
    {
      "role": "user",
      "content": "请深入思考这个问题的解决方案..."
    }
  ],
  "extra_body": {
    "google": {
      "thinking_config": {
        "include_thoughts": true
      },
      "thought_tag_marker": "think"
    }
  }
}
```

#### 4. DeepSeek 深度思考

```json
{
  "model": "deepseek-reasoner",
  "messages": [
    {
      "role": "user", 
      "content": "请分析这个复杂的技术问题..."
    }
  ]
}
```
*注：DeepSeek R1无需额外参数即可进行深度思考*

#### 5. Doubao 深度思考

**火山协议方式:**
```json
{
  "model": "doubao-seed-1.6",
  "messages": [
    {
      "role": "user", 
      "content": "请分析这个复杂的技术问题..."
    }
  ],
  "thinking": {
    "type": "enabled"
  }
}
```
*注：doubao-seed-1.6-thinking 无需额外参数即可进行深度思考*


#### 6. openai 深度思考

同[Openai标准协议方式](#标准协议方式)

### 流式响应中的深度思考

所有支持深度思考的模型都可以在流式响应中使用：

```json
{
  "model": "claude-4-sonnet",
  "messages": [
    {
      "role": "user",
      "content": "请逐步分析..."
    }
  ],
  "reasoning_effort": "medium",
  "stream": true
}
```

## 技术实现细节

### 处理流程

1. **请求接收**: `ChatController.completion()` 接收包含`reasoning_effort`的请求
2. **协议转换**: 根据模型类型选择相应的适配器进行协议转换
3. **参数映射**: 将统一的`reasoning_effort`转换为各协议的原生参数
4. **API调用**: 使用转换后的参数调用相应的AI服务
5. **响应处理**: 解析包含推理内容的响应并统一格式返回

### 各协议转换逻辑

#### Claude协议转换 (AwsCompletionConverter.java:121-136)

```java
private static Document convertThinking(Object reasoning_effort) {
    Map<String, Object> thinking = new HashMap<>();
    if(reasoning_effort instanceof String) {
        int thinkingToken = 2000;  // low
        if(reasoning_effort.equals("medium")) {
            thinkingToken = 4000;
        } else if(reasoning_effort.equals("high")) {
            thinkingToken = 8000;
        }
        thinking.put("thinking", new MessageRequest.ThinkingConfigEnabled(thinkingToken));
        return convertObjectToDocument(thinking);
    } else {
        // 直接使用自定义配置
        thinking.put("thinking", reasoning_effort);
        return convertObjectToDocument(thinking);
    }
}
```

#### Qwen协议转换 (QwenAdaptor.java:46-51)

```java
private void fillExtraBody(CompletionRequest request) {
    if(request.getReasoning_effort() != null) {
        request.setEnable_thinking(true);
        request.setReasoning_effort(null);
    }
}
```

#### Google协议转换 (GoogleAdaptor.java:50-55)

```java
private void fillExtraBody(CompletionRequest request) {
    if(request.getReasoning_effort() != null) {
        request.setExtra_body(new ExtraBody.ExtraBodyBuilder()
            .google(new GoogleExtraBody(true)).build());
        request.setReasoning_effort(null);
    }
}
```

### ThinkingConfig类结构

```java
// 启用思考配置
public static class ThinkingConfigEnabled extends ThinkingConfig {
    private Integer budget_tokens;  // 预算token数量
    
    public ThinkingConfigEnabled(Integer budget_tokens) {
        super("enabled");
        this.budget_tokens = budget_tokens;
    }
}

// 禁用思考配置  
public static class ThinkingConfigDisabled extends ThinkingConfig {
    public ThinkingConfigDisabled() {
        super("disabled");
    }
}
```

## 响应格式

### 包含推理内容的响应

当启用深度思考时，响应会包含推理过程：

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "基于以上分析，最终答案是...",
        "reasoning_content": "让我仔细思考这个问题...",
        "reasoning_content_signature": "signature_hash",
        "redacted_reasoning_content": "经过编辑的推理内容..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 500,
    "total_tokens": 600
  }
}
```

**字段说明:**
- `content`: 最终回答内容
- `reasoning_content`: 完整的推理过程
- `reasoning_content_signature`: 推理内容的签名，只有claude模型包含
- `redacted_reasoning_content`: 编辑过的推理内容（隐私保护），只有claude模型包含

### 流式响应中的推理内容

```json
data: {"choices":[{"delta":{"reasoning_content":"正在思考..."}}]}
data: {"choices":[{"delta":{"content":"基于推理结果..."}}]}
```

## 最佳实践

### 1. 选择合适的思考强度

- 只有Openai系列和Claude系列支持思考强度
- **低强度 (low)**: 适合简单问题，快速响应
- **中等强度 (medium)**: 适合一般复杂度问题，平衡效果和成本
- **高强度 (high)**: 适合复杂问题，需要深度分析

### 2. 成本考虑

- 深度思考会消耗额外的token
- 推理过程的token通常按正常价格计费
- 建议根据问题复杂度选择合适的强度级别

### 3. 应用场景

- **数学问题解决**: 使用高强度思考
- **代码调试分析**: 使用中等强度思考  
- **文本理解**: 使用低强度思考
- **复杂决策**: 使用高强度思考

## 完整调用示例

```bash
curl -X POST "https://your-bella-api.com/v1/chat/completions" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet",
    "messages": [
      {
        "role": "user",
        "content": "请分析以下商业案例的优缺点，并提供改进建议：[详细案例描述]"
      }
    ],
    "reasoning_effort": "high",
    "max_tokens": 2000,
    "temperature": 0.7
  }'
```

## 注意事项

1. **模型支持**: 确保使用支持深度思考的模型版本
2. **Token消耗**: 深度思考会增加token使用量，请合理控制预算
3. **响应时间**: 深度思考通常需要更长的处理时间
4. **协议兼容**: 不同模型的推理输出格式可能略有差异
5. **费用计算**: 推理过程的token按正常价格计费

通过合理使用深度思考功能，您可以获得更加准确、深入的AI回答，特别适合复杂问题的分析和解决。
