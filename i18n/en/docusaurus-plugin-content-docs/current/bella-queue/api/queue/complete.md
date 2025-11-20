# Complete Task

**POST** `http(s)://{{Host}}/v1/queue/{taskId}/complete`

## Example

**Request**

```bash
curl -X POST "https://${Host}/v1/queue/TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX/complete" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "request_id": "TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
    "status_code": 200,
    "body": {
        // Worker processing result - chat completion response
        "id": "chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        "object": "chat.completion",
        "created": 1762857979,
        "model": "deepseek-r1-20250401",
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": "Hello! Nice to meet you, I am your AI assistant"
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

**Response**

```bash
"TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX"
```

## Path Parameters

| Parameter | Type   | Required | Description            |
|-----------|--------|----------|------------------------|
| `taskId`  | string | Required | ID of task to complete |

## Request Body Parameters

| Parameter | Type                     | Required | Description          |
|-----------|--------------------------|----------|----------------------|
| `data`    | Map&lt;String, Object&gt; | Required | Task processing result data |

## Returns

```bash
"Task ID"
```

This interface is called by Workers to submit task completion results.

**Use Cases**:

- **callback mode**: After Worker processing is complete, call this interface and the system will send HTTP callback requests to the specified callbackUrl
- **batch mode**: After batch task completion, call this interface to update batch status

**Note**: blocking and streaming modes are handled directly through Redis event bus without calling this interface
