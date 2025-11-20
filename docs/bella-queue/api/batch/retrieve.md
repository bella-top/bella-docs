# 获取批处理任务详情

**GET** `http(s)://{{Host}}/v1/batches/{batch_id}`

## 示例

**请求**

```bash
curl -X GET "https://${Host}/v1/batches/BATCH-X-X-XXXXXXXXXXXX-XXXX-XXXXXX" \
  -H "Authorization: Bearer ${apikey}"
```

**响应**

```json
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
```

## Path Parameters

| 参数         | 类型     | 必需       | 说明      |
|------------|--------|----------|---------|
| `batch_id` | string | Required | 批处理任务ID |

## Returns

```json
{
  "id": "BatchId",
  "object": "batch",
  "endpoint": "能力点",
  "status": "batch状态",
  "input_file_id": "输入文件ID",
  "completion_window": "时间窗口",
  "output_file_id": "结果文件ID",
  "error_file_id": "失败文件ID",
  "created_at": "创建时间",
  "in_progress_at": "开始处理时间",
  "finalizing_at": "完结开始时间",
  "completed_at": "完成时间",
  "failed_at": "失败时间",
  "expired_at": "过期时间",
  "cancelling_at": "取消中时间",
  "cancelled_at": "取消完成时间",
  "request_counts": {
    "total": "总任务数",
    "completed": "完成任务数",
    "failed": "失败任务数"
  }
}
```
