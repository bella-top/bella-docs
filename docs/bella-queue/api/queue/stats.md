# 获取队列统计信息

**GET** `http(s)://{{Host}}/v1/queue/{fullQueueName}/stats`

## 示例

**请求**

```bash
curl -X GET "https://${Host}/v1/queue/test-queue:1/stats" \
  -H "Authorization: Bearer ${apikey}"
```

**响应**

```json
{
  "id": 2,
  "queue": "test-queue",
  "level": 1,
  "last_wrote_sharding_key": "2-1-20251031183551",
  "last_wrote_id": 124,
  "last_scanned_sharding_key": "2-1-20251031183551",
  "last_scanned_id": 124,
  "total_put_cnt": 124,
  "total_loaded_cnt": 124,
  "total_completed_cnt": 7,
  "cuid": 10001,
  "muid": 10001,
  "cu_name": "xxx",
  "mu_name": "xxx",
  "ctime": "2025-10-31T18:35:52",
  "mtime": "2025-11-11T12:12:14"
}
```

## Path Parameters

| 参数              | 类型     | 必需       | 说明                       |
|-----------------|--------|----------|--------------------------|
| `fullQueueName` | string | Required | 完整的队列名称（queueName:level） |

## Returns

```json
{
  "id": "主键id",
  "queue": "队列名称",
  "level": "队列level",
  "last_wrote_sharding_key": "写指针分片键",
  "last_wrote_id": "写指针分片键主键ID",
  "last_scanned_sharding_key": "扫描指针分片键",
  "last_scanned_id": "扫描指针分片键主键ID",
  "total_put_cnt": "总入队任务数",
  "total_loaded_cnt": "总扫描任务数",
  "total_completed_cnt": "总完成任务数",
  "cuid": "创建人ID",
  "muid": "修改人ID",
  "cu_name": "创建人名称",
  "mu_name": "修改人名称",
  "ctime": "创建时间",
  "mtime": "修改时间"
}
```
