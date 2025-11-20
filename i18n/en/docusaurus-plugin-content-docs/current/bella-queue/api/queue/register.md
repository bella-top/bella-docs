# Register Queue

**POST** `http(s)://{{Host}}/v1/queue/register`

## Example

**Request**

```bash
curl -X POST "https://${Host}/v1/queue/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "queue": "test-queue",
    "endpoint": "/v1/chat/completions"
  }'
```

**Response**

```bash
"test-queue"
```

## Request Body Parameters

| Parameter  | Type   | Required | Description                                                                            |
|------------|--------|----------|----------------------------------------------------------------------------------------|
| `queue`    | string | Required | Queue name (only letters, numbers, underscores, separators allowed, max 64 characters) |
| `endpoint` | string | Required | API endpoint for processing tasks                                                      |

## Returns

```bash
"Queue name"
```
