# Submit Task

**POST** `http(s)://{{Host}}/v1/queue/put`

## Examples

**Request (callback mode)**

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

**Response (callback mode)**

```json
{
  "code": 200,
  "timestamp": 1762856201269,
  "data": "TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX"
}
```

**Request (blocking mode)**

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
                "content": "Hello"
            }
        ],
        "stream": false
    }
}'
```

**Response (blocking mode)**

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
        "content": "\nHello there! 👋 Nice to meet you~  \nI'm your AI assistant, ready to help you answer questions, organize materials, or chat about interesting topics. What would you like to talk about, or do you need help with anything? For example:  \n- Life concerns? 📚  \n- Work/study questions? 💡  \n- Exploring a knowledge area? 🌍  \n- Or just relaxing and chatting? 😄  \n\nI'm waiting for you to speak up~ ✨",
        "tool_calls": [],
        "reasoning_content": "\nHmm, the user sent a simple \"Hello\". It looks like an initial greeting, maybe they just opened the chat interface or are using this type of AI assistant for the first time.  \n\nThe user didn't ask a specific question, they might be testing functionality, wanting to chat, or haven't thought of what to ask yet. At this time, I need to maintain a friendly and open attitude while avoiding being overly enthusiastic and seeming mechanical.  \n\nConsidering the English context, \"Hello\" is a fairly standard greeting. When replying, I can add some warmth, like adding an emoji to balance formality, while clearly expressing my \"I'm ready to help anytime\" stance.  \n\nShould I proactively provide directional hints? New users might really need guidance. Listing several common directions (life/study/work) is relatively safe, covering most scenarios, and adding an \"other needs\" fallback option to avoid feeling limited. Ending with a wave and emoji to maintain a relaxed feeling is appropriate.  \n\nOh, is that last sentence \"waiting for you to speak up\" too literary? ...But with the ✨ symbol it should be able to convey the goodwill of \"patient waiting\", so I'll keep it.\n"
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

**Request (streaming mode)**

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
                "content": "Hello"
            }
        ],
        "stream": true
    }
}'
```

**Response (streaming mode)**

```bash
Connected to http://{{Host}}/v1/queue/put
data: {"id":"chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","object":"chat.completion.chunk","created":1762858384,"model":"deepseek-r1-20250401","choices":[{"index":0,"delta":{"role":"assistant","content":""},"logprobs":null,"finish_reason":null}]}
data: {"id":"chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","object":"chat.completion.chunk","created":1762858384,"model":"deepseek-r1-20250401","choices":[{"index":0,"delta":{"reasoning_content":"\n"},"logprobs":null,"finish_reason":null}]}
data: {"id":"chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","object":"chat.completion.chunk","created":1762858384,"model":"deepseek-r1-20250401","choices":[{"index":0,"delta":{"reasoning_content":"Hmm"},"logprobs":null,"finish_reason":null}]}
data: {"id":"chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","object":"chat.completion.chunk","created":1762858384,"model":"deepseek-r1-20250401","choices":[{"index":0,"delta":{"reasoning_content":","},"logprobs":null,"finish_reason":null}]}
...
data: [DONE]
Connection closed
```

## Request Body Parameters

| Parameter       | Type    | Required | Description                                                                                                                                                                                        |
|-----------------|---------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `queue`         | string  | Required | Queue name                                                                                                                                                                                         |
| `endpoint`      | string  | Required | Capability endpoint for processing tasks                                                                                                                                                           |
| `level`         | integer | Required | Queue level: 0(online queue), 1(offline queue)                                                                                                                                                     |
| `data`          | object  | Required | Task data payload, refer to [OpenAPI Usage Documentation](../../../bella-openapi/core/chat-completions.md)                                                                                         |
| `response_mode` | string  | Optional | Response mode: blocking(synchronous), streaming(stream), callback(callback), default callback. callback supports both online and offline queues, blocking and streaming only support online queues |
| `callback_url`  | string  | Optional | Callback URL (used in callback mode)                                                                                                                                                               |
| `timeout`       | integer | Optional | Task timeout (seconds), default 300s for blocking/streaming mode, 24 hours for callback mode                                                                                                       |

## Response Modes

### blocking mode

- Synchronously wait for task completion and return results
- Suitable for real-time interaction scenarios
- Response time affected by task processing duration
- **Only supports online queues (level=0)**

### streaming mode

- Returns Server-Sent Events stream
- Suitable for scenarios requiring real-time streaming output
- Client needs to support SSE
- **Only supports online queues (level=0)**

### callback mode

- Asynchronous processing, callback to specified URL after completion
- Suitable for long-running tasks
- Immediately returns task ID
- **Supports both online queues (level=0) and offline queues (level=1)**

## Returns

Returns different formats based on `response_mode`:

- **blocking**: Directly returns task processing results
- **streaming**: Returns SSE stream object
- **callback**: Returns response object containing task ID
