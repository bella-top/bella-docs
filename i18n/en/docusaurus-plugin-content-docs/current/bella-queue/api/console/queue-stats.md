# Get All Queue Statistics

**GET** `http(s)://{{Host}}/v1/console/queue/stats`

## Examples

**Request**

```bash
curl -X GET "https://${Host}/v1/console/queue/stats" \
  -H "Authorization: Bearer ${apikey}"
```

**Response**

```json
[
  {
    "id": 1,
    "queue": "test-queue1",
    "level": 1,
    "last_wrote_sharding_key": "1-1-20251105164619",
    "last_wrote_id": 153,
    "last_scanned_sharding_key": "1-1-20251105164619",
    "last_scanned_id": 145,
    "total_put_cnt": 20153662,
    "total_loaded_cnt": 145,
    "total_completed_cnt": 7,
    "cuid": 10001,
    "muid": 10001,
    "cu_name": "xxx",
    "mu_name": "xxx",
    "ctime": "2025-10-31T18:35:46",
    "mtime": "2025-11-10T16:14:28"
  },
  {
    "id": 2,
    "queue": "test-queue2",
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
]
```

## Returns

Returns a list of statistical information for all queues in the system

```json
[
  {
    "id": "primary key id",
    "queue": "queue name",
    "level": "queue level",
    "last_wrote_sharding_key": "write pointer shard key",
    "last_wrote_id": "write pointer task ID",
    "last_scanned_sharding_key": "scan pointer shard key",
    "last_scanned_id": "scan pointer task ID",
    "total_put_cnt": "total enqueued tasks",
    "total_loaded_cnt": "total scanned tasks",
    "total_completed_cnt": "total completed tasks",
    "cuid": "creator ID",
    "muid": "modifier ID",
    "cu_name": "creator name",
    "mu_name": "modifier name",
    "ctime": "creation time",
    "mtime": "modification time"
  },
  {
    ...
  }
]
```