# List Batch Jobs

**GET** `http(s)://{{Host}}/v1/batches`

## Examples

**Request**

```bash
curl -X GET "https://${Host}/v1/batches?after=BATCH-X-X-XXXXXXXXXXXX-XXXX-XXXXXX&limit=10" \
  -H "Authorization: Bearer ${apikey}"
```

**Response**

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

| Parameter | Type    | Required | Description                                          |
|-----------|---------|----------|------------------------------------------------------|
| `after`   | string  | Optional | Pagination cursor, returns batches after this BatchID |
| `limit`   | integer | Required | Number of batches to return per page, must be greater than 0 |

## Returns
Returns a list of batch jobs, sorted by creation time in descending order (newest first)

```json
{
  "object": "object type (fixed as list)",
  "data": "array of batch jobs",
  "has_more": "whether there is more data"
}
```