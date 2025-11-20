# 注册队列

**POST** `http(s)://{{Host}}/v1/queue/register`

## 示例

**请求**

```bash
curl -X POST "https://${Host}/v1/queue/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "queue": "test-queue",
    "endpoint": "/v1/chat/completions"
  }'
```

**响应**

```bash
"test-queue"
```

## Request Body Parameters

| 参数         | 类型     | 必需       | 说明                                |
|------------|--------|----------|-----------------------------------|
| `queue`    | string | Required | 队列名称（只能包含字母、数字、下划线、分隔符，长度不超过64字符） |
| `endpoint` | string | Required | 处理任务的能力点                          |

## Returns

```bash
"队列名称"
```
