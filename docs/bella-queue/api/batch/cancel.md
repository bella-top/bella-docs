# 取消批处理任务

**POST** `http(s)://{{Host}}/v1/batches/{batch_id}/cancel`

## 示例

**请求**

```bash
curl -X POST "https://${Host}/v1/batches/BATCH-X-X-XXXXXXXXXXXX-XXXX-XXXXXX/cancel" \
  -H "Authorization: Bearer ${apikey}"
```

**响应**

```json
{
  "id": "BATCH-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
  "object": "batch",
  "endpoint": "/v1/chat/completions",
  "input_file_id": "file-XXXXXXXXXXXXXXXXXXXXXXX-XXXXXXXXXX",
  "completion_window": "24h",
  "created_at": 1762928558649,
  "expired_at": 1763014958648,
  "request_counts": {
    "total": 121,
    "completed": 0,
    "failed": 0
  }
}
```

## Path Parameters

| 参数         | 类型     | 必需       | 说明          |
|------------|--------|----------|-------------|
| `batch_id` | string | Required | 要取消的批处理任务ID |

## Returns

取消操作是异步的，需要进行结果处理，状态不会立马变成cancelled。

```json
{
  "id": "batchId",
  "object": "batch",
  "endpoint": "能力点",
  "input_file_id": "输入文件ID",
  "completion_window": "指定的完成时间",
  "created_at": "创建时间",
  "expired_at": "修改时间",
  "request_counts": {
    "total": "总任务数",
    "completed": "完成任务数",
    "failed": "失败任务数"
  }
}
```

## 取消行为

- **validating状态**: 立即取消，停止验证过程
- **in_progress状态**: 停止处理新请求，已在处理的请求会继续完成
- **finalizing状态**: 无法取消，批次即将完成
- **completed状态**: 无法取消，批次已完成
- **failed/expired/cancelled状态**: 无法取消，批次已处于终态

## 注意事项

- 取消操作不可逆
- 已完成的部分请求结果仍可通过output_file_id获取
- 取消后会生成包含已处理结果的输出文件
