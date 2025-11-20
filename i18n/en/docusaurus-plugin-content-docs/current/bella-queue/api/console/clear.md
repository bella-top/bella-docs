# Clear Queue

**POST** `http(s)://{{Host}}/v1/console/{fullQueueName}/clear`

## Examples

**Request**

```bash
curl -X POST "https://${Host}/v1/console/test-queue:1/clear" \
  -H "Authorization: Bearer ${apikey}"
```

**Response**

```bash
"test-queue:1"
```

## Path Parameters

| Parameter       | Type   | Required | Description                            |
|-----------------|--------|----------|----------------------------------------|
| `fullQueueName` | string | Required | Full name of the queue to be cleared   |

## Function Description

This interface performs the following operations:

1. **Refresh queue statistics**: Update queue head statistics to the latest state
2. **Move scan head**: Move the scan head position to the latest position, skipping all pending tasks
3. **Clear Redis queue**: Clear all pending tasks in the Redis queue

## Returns

```bash
"Queue name"
```
