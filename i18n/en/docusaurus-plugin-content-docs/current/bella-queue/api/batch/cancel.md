# Cancel Batch Job

**POST** `http(s)://{{Host}}/v1/batches/{batch_id}/cancel`

## Examples

**Request**

```bash
curl -X POST "https://${Host}/v1/batches/BATCH-X-X-XXXXXXXXXXXX-XXXX-XXXXXX/cancel" \
  -H "Authorization: Bearer ${apikey}"
```

**Response**

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

| Parameter  | Type   | Required | Description                    |
|------------|--------|----------|--------------------------------|
| `batch_id` | string | Required | ID of the batch job to cancel  |

## Returns

The cancellation operation is asynchronous and requires result processing. The status will not immediately change to cancelled.

```json
{
  "id": "batchId",
  "object": "batch",
  "endpoint": "capability endpoint",
  "input_file_id": "input file ID",
  "completion_window": "specified completion time",
  "created_at": "creation time",
  "expired_at": "modification time",
  "request_counts": {
    "total": "total tasks",
    "completed": "completed tasks",
    "failed": "failed tasks"
  }
}
```

## Cancellation Behavior

- **validating status**: Immediate cancellation, stops validation process
- **in_progress status**: Stops processing new requests, requests already being processed will continue to completion
- **finalizing status**: Cannot cancel, batch is about to complete
- **completed status**: Cannot cancel, batch is already completed
- **failed/expired/cancelled status**: Cannot cancel, batch is already in terminal state

## Notes

- Cancellation operation is irreversible
- Results of completed partial requests can still be obtained through output_file_id
- After cancellation, an output file containing processed results will be generated