# 完成任务

**POST** `http(s)://{{Host}}/v1/queue/{taskId}/complete`

## 示例

**请求**

```bash
curl -X POST "https://${Host}/v1/queue/TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX/complete" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "request_id": "TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
    "status_code": 200,
    "body": {
        // Worker处理结果 - chat completion响应
        "id": "chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        "object": "chat.completion",
        "created": 1762857979,
        "model": "deepseek-r1-20250401",
        "choices": [
          {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "你好呀！很高兴见到你，我是你的AI助手"
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
}'
```

**响应**

```bash
"TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX"
```

## Path Parameters

| 参数       | 类型     | 必需       | 说明       |
|----------|--------|----------|----------|
| `taskId` | string | Required | 要完成的任务ID |

## Request Body Parameters

| 参数     | 类型                  | 必需       | 说明       |
|--------|---------------------|----------|----------|
| `data` | Map&lt;String, Object&gt; | Required | 任务处理结果数据 |

## Returns

```bash
"任务ID"
```

此接口由Worker调用，用于提交任务处理完成的结果。

**使用场景**:

- **callback模式**: Worker处理完成后调用此接口，系统会向指定的callbackUrl发送HTTP回调请求
- **batch模式**: 批处理任务完成后调用此接口更新批次状态

**注意**: blocking和streaming模式通过Redis事件总线直接处理，无需调用此接口
