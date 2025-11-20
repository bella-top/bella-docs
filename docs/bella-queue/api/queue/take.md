# 获取任务

**POST** `http(s)://{{Host}}/v1/queue/take`

## 示例

### 离线任务示例

**请求**

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

**响应 (离线任务，包含batch_id和trace_id)**

```json
{
  "test-queue:1": [
    {
      "ak": "xxx",
      "endpoint": "/v1/chat/completions",
      "queue": "test-queue",
      "level": 1,
      "data": {
        "model": "deepseek-r1-20250401",
        "messages": [
          {
            "role": "user",
            "content": "你好"
          }
        ],
        "stream": false
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

### 在线任务示例

**请求**

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

**响应 (在线任务，包含instance_id)**

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
            "content": "你好"
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

| 参数         | 类型       | 必需       | 说明                                                      |
|------------|----------|----------|---------------------------------------------------------|
| `queues`   | string[] | Required | 要获取任务的队列名称列表(格式: "queueName:level")                     |
| `strategy` | string   | Optional | 队列策略: fifo、round_robin、active_passive、sequential，默认fifo |
| `endpoint` | string   | Optional | 处理任务的能力点                                                |
| `size`     | integer  | Required | 获取任务数                                                   |

## Queue Strategies (队列策略)

### fifo策略

- **逻辑**: First-In-First-Out，先进先出
- **行为**: 按照任务提交的时间顺序依次处理，最早提交的任务最先被取出
- **适用场景**: 需要严格按时间顺序处理的场景

### round_robin策略

- **逻辑**: 轮询调度，在多个队列间轮流取任务
- **行为**: 依次从每个队列中取任务，实现负载均衡
- **适用场景**: 多个队列需要平均分配处理资源的场景

### active_passive策略

- **逻辑**: 主备模式，优先处理主队列任务
- **行为**: 优先从第一个队列（主队列）获取任务，当主队列为空时才从备用队列获取
- **适用场景**: 有优先级区分的场景，高优先级队列优先处理

### sequential策略

- **逻辑**: 全局顺序执行，确保每个队列在同一时间只能有一个任务在运行，每个队列只取一个
- **行为**: 跳过正在运行任务的队列，从其他队列中按顺序获取最早的任务，设置运行锁防止并发执行
- **适用场景**: 需要严格顺序执行的场景，避免同一队列任务并发导致的竞争条件

## Returns

响应格式：`{队列名称: [任务数组]}`

### 字段差异说明

- **在线任务 (level=0)**：包含 `instance_id` 字段，用于实时任务处理和事件总线通信
- **离线任务 (level=1)**：包含 `batch_id` 和 `trace_id` 字段，用于批处理任务追踪和管理

