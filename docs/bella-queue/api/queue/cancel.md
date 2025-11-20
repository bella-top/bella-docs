# 取消任务

**POST** `http(s)://{{Host}}/v1/queue/{taskId}/cancel`

## 示例

**请求**

```bash
curl -X POST "https://${Host}/v1/queue/TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX/cancel" \
  -H "Authorization: Bearer ${apikey}"
```

**响应**

```bash
"TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX"
```

## Path Parameters

| 参数       | 类型     | 必需       | 说明       |
|----------|--------|----------|----------|
| `taskId` | string | Required | 要取消的任务ID |

## Returns

```bash
"任务ID"
```

## 注意事项

- 取消操作只对尚未开始处理或正在处理中的任务有效
- 已完成的任务无法取消
- HTTP状态码为202 (Accepted)，表示取消请求已接受
