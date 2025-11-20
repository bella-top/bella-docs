# 列出批处理任务

**GET** `http(s)://{{Host}}/v1/batches`

## 示例

**请求**

```bash
curl -X GET "https://${Host}/v1/batches?after=BATCH-X-X-XXXXXXXXXXXX-XXXX-XXXXXX&limit=10" \
  -H "Authorization: Bearer ${apikey}"
```

**响应**

```json
{
  "data": [
    {
      "id": "BATCH-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
      "object": "batch",
      "endpoint": "/v1/chat/completions",
      "status": "expired",
      "input_file_id": "file-XXXXXXXXXXXXXXXXXXXXXXX-XXXXXXXXXX",
      "completion_window": "24h",
      "output_file_id": "",
      "error_file_id": "",
      "created_at": 1762136757000,
      "in_progress_at": 1762136757000,
      "finalizing_at": 1762223427000,
      "completed_at": 946656000000,
      "failed_at": 946656000000,
      "expired_at": 1762223157000,
      "cancelling_at": 946656000000,
      "cancelled_at": 946656000000,
      "request_counts": {
        "total": 121,
        "completed": 8,
        "failed": 0
      }
    }
  ],
  "object": "list",
  "has_more": true
}
```

## Query Parameters

| 参数      | 类型      | 必需       | 说明                   |
|---------|---------|----------|----------------------|
| `after` | string  | Optional | 分页游标，返回此BatchID之后的批次 |
| `limit` | integer | Required | 每页返回的批次数量，必须大于0      |

## Returns
返回批处理任务列表，按创建时间倒序排列（最新的在前）

```json
{
  "object": "对象类型(固定为list)",
  "data": "批处理任务数组",
  "has_more": "是否还有更多数据"
}
```


