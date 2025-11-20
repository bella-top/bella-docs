# Get Batch Job Details

**GET** `http(s)://{{Host}}/v1/batches/{batch_id}`

## Examples

**Request**

```bash
curl -X GET "https://${Host}/v1/batches/BATCH-X-X-XXXXXXXXXXXX-XXXX-XXXXXX" \
  -H "Authorization: Bearer ${apikey}"
```

**Response**

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

| Parameter  | Type   | Required | Description   |
|------------|--------|----------|---------------|
| `batch_id` | string | Required | Batch job ID  |

## Returns

```json
{
  "id": "BatchId",
  "object": "batch",
  "endpoint": "capability endpoint",
  "status": "batch status",
  "input_file_id": "input file ID",
  "completion_window": "time window",
  "output_file_id": "result file ID",
  "error_file_id": "error file ID",
  "created_at": "creation time",
  "in_progress_at": "processing start time",
  "finalizing_at": "finalization start time",
  "completed_at": "completion time",
  "failed_at": "failure time",
  "expired_at": "expiration time",
  "cancelling_at": "cancelling time",
  "cancelled_at": "cancelled time",
  "request_counts": {
    "total": "total tasks",
    "completed": "completed tasks",
    "failed": "failed tasks"
  }
}
```