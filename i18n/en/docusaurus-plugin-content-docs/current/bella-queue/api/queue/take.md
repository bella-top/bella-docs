# Get Task

**POST** `http(s)://{{Host}}/v1/queue/take`

## Examples

### Offline Task Example

**Request**

```bash
curl -X POST "https://${Host}/v1/queue/take" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "queues": [
        "test-queue:1"
    ],
    "strategy": "active_passive",
    "endpoint": "/v1/chat/completions",
    "size": 1
}'
```

**Response (Offline task with batch_id and trace_id)**

```json
{
  "test-queue:1": [
    {
      "ak": "xxx",
      "endpoint": "/v1/chat/completions",
      "queue": "test-queue",
      "level": 1,
      "data": {
        "k": "v"
      },
      "status": "waiting",
      "task_id": "TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
      "batch_id": "BATCH-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
      "trace_id": "BATCH-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
      "start_time": 1762863595000,
      "running_time": 0,
      "expire_time": 1762949994000,
      "completed_time": 0,
      "callback_url": "",
      "response_mode": "batch"
    }
  ]
}
```

### Online Task Example

**Request**

```bash
curl -X POST "https://${Host}/v1/queue/take" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "queues": [
        "test-queue:0"
    ],
    "strategy": "fifo",
    "endpoint": "/v1/chat/completions",
    "size": 1
}'
```

**Response (Online task with instance_id)**

```json
{
  "test-queue:0": [
    {
      "ak": "xxx",
      "endpoint": "/v1/chat/completions",
      "queue": "test-queue",
      "level": 0,
      "data": {
        "model": "deepseek-r1-20250401",
        "messages": [
          {
            "role": "user",
            "content": "Hello"
          }
        ],
        "stream": false
      },
      "status": "waiting",
      "task_id": "TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
      "instance_id": "xx.xx.xx.xx:xxx",
      "start_time": 1762863595000,
      "running_time": 0,
      "expire_time": 1762949994000,
      "completed_time": 0,
      "callback_url": "",
      "response_mode": "blocking"
    }
  ]
}
```

## Request Body Parameters

| Parameter  | Type     | Required | Description                                                                    |
|------------|----------|----------|--------------------------------------------------------------------------------|
| `queues`   | string[] | Required | List of queue names to get tasks from (format: "queueName:level")             |
| `strategy` | string   | Optional | Queue strategy: fifo, round_robin, active_passive, sequential, default fifo   |
| `endpoint` | string   | Optional | Capability endpoint for processing tasks                                       |
| `size`     | integer  | Required | Number of tasks to get                                                         |

## Queue Strategies

### fifo strategy

- **Logic**: First-In-First-Out
- **Behavior**: Process tasks in order of submission time, earliest submitted tasks are taken first
- **Use case**: Scenarios requiring strict chronological order processing

### round_robin strategy

- **Logic**: Round-robin scheduling, taking tasks from multiple queues in turn
- **Behavior**: Take tasks from each queue in sequence, achieving load balancing
- **Use case**: Scenarios where multiple queues need evenly distributed processing resources

### active_passive strategy

- **Logic**: Primary-backup mode, prioritize processing primary queue tasks
- **Behavior**: Prioritize getting tasks from the first queue (primary queue), only get from backup queues when primary queue is empty
- **Use case**: Scenarios with priority distinction, high-priority queues processed first

### sequential strategy

- **Logic**: Global sequential execution, ensuring each queue can only have one task running at a time, only one task per queue
- **Behavior**: Skip queues with running tasks, get the earliest task from other queues in order, set running lock to prevent concurrent execution
- **Use case**: Scenarios requiring strict sequential execution, avoiding race conditions caused by concurrent tasks in the same queue

## Returns

Response format: `{queueName: [taskArray]}`

### Field Differences

- **Online Tasks (level=0)**: Contains `instance_id` field for real-time task processing and event bus communication
- **Offline Tasks (level=1)**: Contains `batch_id` and `trace_id` fields for batch processing tracking and management