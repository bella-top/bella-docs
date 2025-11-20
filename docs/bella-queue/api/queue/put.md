# 提交任务

**POST** `http(s)://{{Host}}/v1/queue/put`

## 示例

**请求 (callback模式)**

```bash
curl -X POST "https://${Host}/v1/queue/put" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "queue": "test-queue",
    "endpoint": "/v1/chat/completions",
    "level": 1,
    "data": {
        "model": "deepseek-r1-20250401",
        "messages": [
            {
                "role": "user",
                "content": "你好"
            }
        ],
        "stream": false
    },
    "callback_url": "http://localhost:8081/test/callback",
  }'
```

**响应 (callback模式)**

```json
{
  "code": 200,
  "timestamp": 1762856201269,
  "data": "TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX"
}
```

**请求 (blocking模式)**

```bash
curl -X POST "https://${Host}/v1/queue/put" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "queue": "test-queue",
    "endpoint": "/v1/chat/completions",
    "level": 0,
    "response_mode": "blocking",
    "data": {
        "model": "deepseek-r1-20250401",
        "messages": [
            {
                "role": "user",
                "content": "你好"
            }
        ],
        "stream": false
    }
}'
```

**响应 (blocking模式)**

```json
{
  "id": "chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "object": "chat.completion",
  "created": 1762857979,
  "model": "deepseek-r1-20250401",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "\n你好呀！👋 很高兴见到你～  \n我是你的AI助手，随时准备帮你解答问题、整理资料或陪你聊聊有趣的话题。有什么想聊的，或者需要帮忙的吗？比如：  \n- 生活小烦恼？ 📚  \n- 学习/工作上的疑问？ 💡  \n- 想探索某个知识领域？ 🌍  \n- 或者单纯想放松聊聊？ 😄  \n\n等你开口啦～ ✨",
        "tool_calls": [],
        "reasoning_content": "\n嗯，用户发来一句简单的“你好”。看起来像是初次打招呼，可能刚打开聊天界面或者第一次使用这类AI助手。  \n\n用户没有提出具体问题，可能是在测试功能、想闲聊，或者还没想好要问什么。这时候需要既保持友好开放的态度，又避免过度热情显得机械。  \n\n考虑到中文语境，“你好”比“嗨”更正式一点，但也不是特别拘谨。回复时可以带点温度，比如加个表情符号平衡正式感，同时明确表达“我随时能帮忙”的立场。  \n\n要不要主动提供方向提示呢？新用户可能真的需要引导。列举几个常见方向（生活/学习/工作）比较稳妥，覆盖大部分场景，再加个“其他需求”的兜底选项，避免局限感。结尾用波浪号和emoji保持轻松感比较合适。  \n\n对了，最后那句“等你开口”是不是太文艺了？……不过配合前面的✨符号应该能传达出“耐心等待”的善意，保留吧。\n"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 4,
    "total_tokens": 307,
    "completion_tokens": 303
  }
}
```

**请求 (streaming模式)**

```bash
curl -X POST "https://${Host}/v1/queue/put" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "queue": "test-queue",
    "endpoint": "/v1/chat/completions",
    "level": 0,
    "response_mode": "streaming",
    "data": {
        "model": "deepseek-r1-20250401",
        "messages": [
            {
                "role": "user",
                "content": "你好"
            }
        ],
        "stream": true
    }
}'
```

**响应 (streaming模式)**

```bash
Connected to http://{{Host}}/v1/queue/put
data: {"id":"chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","object":"chat.completion.chunk","created":1762858384,"model":"deepseek-r1-20250401","choices":[{"index":0,"delta":{"role":"assistant","content":""},"logprobs":null,"finish_reason":null}]}
data: {"id":"chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","object":"chat.completion.chunk","created":1762858384,"model":"deepseek-r1-20250401","choices":[{"index":0,"delta":{"reasoning_content":"\n"},"logprobs":null,"finish_reason":null}]}
data: {"id":"chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","object":"chat.completion.chunk","created":1762858384,"model":"deepseek-r1-20250401","choices":[{"index":0,"delta":{"reasoning_content":"嗯"},"logprobs":null,"finish_reason":null}]}
data: {"id":"chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","object":"chat.completion.chunk","created":1762858384,"model":"deepseek-r1-20250401","choices":[{"index":0,"delta":{"reasoning_content":"，"},"logprobs":null,"finish_reason":null}]}
...
data: [DONE]
Connection closed
```

## Request Body Parameters

| 参数              | 类型      | 必需       | 说明                                                                                                  |
|-----------------|---------|----------|-----------------------------------------------------------------------------------------------------|
| `queue`         | string  | Required | 队列名称                                                                                                |
| `endpoint`      | string  | Required | 处理任务的能力点                                                                                            |
| `level`         | integer | Required | 队列级别：0(在线队列)、1(离线队列)                                                                                |
| `data`          | object  | Required | 任务数据载荷，参考[openapi使用文档](../../../bella-openapi/core/chat-completions.md)                             |
| `response_mode` | string  | Optional | 响应模式：blocking(阻塞)、streaming(流式)、callback(回调)，默认callback。callback支持在线和离线队列，blocking和streaming仅支持在线队列 |
| `callback_url`  | string  | Optional | 回调URL(callback模式时使用)                                                                                |
| `timeout`       | integer | Optional | 任务超时时间(秒)，blocking/streaming模式默认300秒，callback模式默认24小时                                               |

## Response Modes

### blocking模式

- 同步等待任务完成并返回结果
- 适合实时交互场景
- 响应时间受任务处理时长影响
- **仅支持在线队列 (level=0)**

### streaming模式

- 返回Server-Sent Events流
- 适合需要实时流式输出的场景
- 客户端需支持SSE
- **仅支持在线队列 (level=0)**

### callback模式

- 异步处理，完成后回调指定URL
- 适合长时间处理任务
- 立即返回任务ID
- **支持在线队列 (level=0) 和离线队列 (level=1)**

## Returns

根据`response_mode`返回不同格式：

- **blocking**: 直接返回任务处理结果
- **streaming**: 返回SSE流对象
- **callback**: 返回包含任务ID的响应对象
