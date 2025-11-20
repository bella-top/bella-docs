# Cancel Task

**POST** `http(s)://{{Host}}/v1/queue/{taskId}/cancel`

## Example

**Request**

```bash
curl -X POST "https://${Host}/v1/queue/TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX/cancel" \
  -H "Authorization: Bearer ${apikey}"
```

**Response**

```bash
"TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX"
```

## Path Parameters

| Parameter | Type   | Required | Description         |
|-----------|--------|----------|---------------------|
| `taskId`  | string | Required | ID of task to cancel |

## Returns

```bash
"Task ID"
```

## Notes

- Cancel operation is only effective for tasks that have not started processing or are currently being processed
- Completed tasks cannot be cancelled
- HTTP status code 202 (Accepted) indicates the cancel request has been accepted
