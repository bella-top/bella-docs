# Get Queue Statistics

**GET** `http(s)://{{Host}}/v1/queue/{fullQueueName}/stats`

## Examples

**Request**

```bash
curl -X GET "https://${Host}/v1/queue/test-queue:1/stats" \
  -H "Authorization: Bearer ${apikey}"
```

**Response**

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

| Parameter       | Type   | Required | Description                              |
|-----------------|--------|----------|------------------------------------------|
| `fullQueueName` | string | Required | Full queue name (queueName:level format) |

## Returns

```json
{
  "id": "primary key id", 
  "queue": "queue name",
  "level": "queue level",
  "last_wrote_sharding_key": "write pointer shard key",
  "last_wrote_id": "write pointer shard key primary ID",
  "last_scanned_sharding_key": "scan pointer shard key",
  "last_scanned_id": "scan pointer shard key primary ID",
  "total_put_cnt": "total enqueued tasks",
  "total_loaded_cnt": "total scanned tasks",
  "total_completed_cnt": "total completed tasks",
  "cuid": "creator ID",
  "muid": "modifier ID",
  "cu_name": "creator name",
  "mu_name": "modifier name",
  "ctime": "creation time",
  "mtime": "modification time"
}
```