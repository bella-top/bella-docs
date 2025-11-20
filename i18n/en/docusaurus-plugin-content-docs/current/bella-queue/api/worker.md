# Worker Development Integration Guide

This document describes how to develop Worker services to integrate with the Bella-Queue system as downstream task processors.

## Worker Development Methods

The system supports two Worker development methods:

1. **Self-hosted Service Integration**: Independently developed HTTP services that interact with Bella-Queue through APIs
2. **Java SDK Integration**: Quick integration using the Java SDK provided by Bella-Queue

## 1. Prerequisites: Queue and Channel Configuration

Before developing Workers, you need to register queues and configure channel mappings in Bella-Queue.

### 1.1 Register Worker Queue

Register a queue for your Worker service:

```bash
curl -X POST "https://${Host}/v1/queue/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "queue": "deepseek-r1",
    "endpoint": "/v1/chat/completions"
  }'
```

**Parameter Description**

| Parameter | Type   | Required | Description                                                                 |
|-----------|--------|----------|-----------------------------------------------------------------------------|
| `queue`   | string | Required | Queue name (can only contain letters, numbers, underscores, separators, max 64 characters) |
| `endpoint`| string | Required | Task processing capability point                                             |

**Response**

```bash
"deepseek-r1"
```

### 1.2 Configure Model Channels

Create channels through OpenAPI to establish mapping relationships between model names and queues.

**Purpose**: When users use specific models, Bella-Queue will automatically route tasks to the corresponding queues based on channel configuration.

**For specific interfaces and parameters of channel configuration, please refer to the OpenAPI interface documentation.**

### 1.3 Task Routing Description

After configuration, Bella-Queue places tasks into corresponding queues through the following methods, and Workers pull tasks from queues for processing:

#### Direct Queue Specification (Task API)

```bash
curl -X POST "https://${Host}/v1/queue/put" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "queue": "deepseek-r1",
    "endpoint": "/v1/chat/completions",
    "level": 1,
    "data": {"k":"v"},
    "callback_url": "http://localhost:8081/test/callback",
  }'
```

#### Batch Task Routing (Batch API)

**Specify Queue**

```bash
curl -X POST "https://${Host}/v1/batches" \
  -H "Content-Type: application/json" \
  -H "X-BELLA-QUEUE-NAME: deepseek-r1" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "input_file_id": "file-XXXXXXXXXXXXXXXXXXXXXXX-XXXXXXXXXX",
    "endpoint": "/v1/chat/completions", 
    "completion_window": "24h",
    "metadata": {
      "description": "Customer support chat completions batch"
    }
  }'
```

**Automatic Routing**

```bash
curl -X POST "https://${Host}/v1/batches" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "input_file_id": "file-XXXXXXXXXXXXXXXXXXXXXXX-XXXXXXXXXX",
    "endpoint": "/v1/chat/completions", 
    "completion_window": "24h",
    "metadata": {
      "description": "Customer support chat completions batch"
    }
  }'
```

```jsonl
{"custom_id": "req-1", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "deepseek-r1", "messages": [...]}}
```

The system automatically finds channel configuration based on the `deepseek-r1` model and routes to the `deepseek-r1` queue.

## 2. Self-hosted Service Integration

Suitable for scenarios with existing inference services or requirements to use other technology stacks.

### 2.1 Worker Service Development

Your Worker service needs to implement the following core functions:

#### 2.1.1 Get System Configuration

Get EventBus configuration for real-time task communication:

```bash
curl -X GET "https://${Host}/v1/queue/eventbus" \
  -H "Authorization: Bearer ${apikey}"
```

**Response Example**

```json
{
  "url": "redis://localhost:6379",
  "topic": "bella:eventbus:"
}
```

#### 2.1.2 Pull Tasks

Regularly pull pending tasks from Bella-Queue:

```bash
curl -X POST "https://${Host}/v1/queue/take" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "queues": [
        "deepseek-r1:1"
    ],
    "size": 10,
    "strategy": "fifo"
  }'
```

**Response Example (Offline Queue - Batch/Callback Mode)**

```json
{
  "deepseek-r1:1": [
    {
      "ak": "xxx",
      "endpoint": "/v1/chat/completions",
      "queue": "test-queue",
      "level": 1,
      "data": {
        "model": "deepseek-r1",
        "messages": [
          {
            "role": "user",
            "content": "Hello"
          }
        ],
        "temperature": 0.7
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

**Response Example (Online Queue - Blocking/Streaming Mode)**

```json
{
  "deepseek-r1:0": [
    {
      "ak": "xxx",
      "endpoint": "/v1/chat/completions",
      "queue": "test-queue",
      "level": 0,
      "data": {
        "model": "deepseek-r1",
        "messages": [
          {
            "role": "user",
            "content": "你好"
          }
        ],
        "stream": false
      },
      "task_id": "TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
      "instance_id": "xx.xx.xx.xx:xxxx",
      "start_time": 1762950826730,
      "running_time": 0,
      "expire_time": 1762951126730,
      "completed_time": 0,
      "response_mode": "blocking"
    }
  ]
}
```

**instanceId Description**: Online tasks carry an `instance_id` field that identifies the client instance address (such as IP:port) that initiated the request. After processing, Workers need to send events to the corresponding instance via Redis Stream.

#### 2.1.3 Process Tasks and Return Results

Use different result return methods based on `response_mode`:

##### Callback/Batch Mode - HTTP Interface Return

```bash
curl -X POST "https://${Host}/v1/queue/{taskId}/complete" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "status_code": 200,
    "request_id": "TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
    "body": {
      // Worker processing result - chat completion response
      "id": "chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      "object": "chat.completion",
      "model": "deepseek-r1",
      "choices": [{
        "message": {
          "role": "assistant", 
          "content": "Hello! How can I help you today?"
        }
      }]
    }
  }'
```

##### Blocking/Streaming Mode - Redis Event Return

Online tasks carry an `instance_id` field. Workers need to send events to Redis Stream at: `{eventbus.topic}{instance_id}`

For example: eventbus.topic = "bella:eventbus:", instance_id = "192.168.1.100:8080"
Send to: `bella:eventbus:192.168.1.100:8080`

**Progress Event** (Optional, for streaming mode)

```json
{
  "name": "task-progress-event",
  "from": "",
  "payload": {
    "taskId": "TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
    "eventId": "progress-1",
    "eventName": "chunk",
    "eventData": {
      "delta": {
        "content": "Hello"
      }
    }
  },
  "context": ""
}
```

**Completion Event** (Required)

```json
{
  "name": "task-completion-event",
  "from": "",
  "payload": {
    "taskId": "TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
    "result": {
      "status_code": 200,
      "request_id": "TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
      "body": {
        "id": "chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        "object": "chat.completion",
        "choices": [
          {
            "message": {
              "role": "assistant",
              "content": "Hello! How can I help you today?"
            }
          }
        ]
      }
    }
  },
  "context": ""
}
```

**Key Notes**:
- Must use the `instance_id` from the task as the Redis Stream target
- `taskId` must exactly match the pulled task ID
- Completion events are required; progress events are optional only in streaming mode

## 3. Java SDK Integration

Suitable for Java technology stack applications, can be quickly integrated into Spring Boot projects.

### 3.1 Add Dependency

```xml
<dependency>
    <groupId>top.bella</groupId>
    <artifactId>openapi-spi</artifactId>
    <version>1.1.68</version>
</dependency>
```

### 3.2 Enable Worker

```java
@SpringBootApplication
@EnableWorker
public class WorkerApplication {
    public static void main(String[] args) {
        SpringApplication.run(WorkerApplication.class, args);
    }
}
```

### 3.3 Configure OpenAiService

```java
@Configuration
public class OpenAiConfig {
    
    @Value("${openai.base-url}")
    private String baseUrl;
    
    @Value("${openai.token}")
    private String token;
    
    @Bean
    public OpenAiService openAiService() {
        return new OpenAiService(token, baseUrl);
    }
}
```

### 3.4 Implement TaskExecutor

TaskExecutor is the core interface for Worker task processing, defining contracts for task submission, execution, and capacity management.

#### Interface Definition

```java
public interface TaskExecutor {
    /**
     * Submit task for processing
     * @param task Task wrapper containing task data and state management methods
     */
    void submit(TaskWrapper task);
    
    /**
     * Return the current number of tasks that can be processed
     * Worker can dynamically adjust the number of tasks pulled based on this parameter
     * @return Remaining capacity, no new tasks will be pulled when returns 0
     */
    Integer remainingCapacity();
}
```

#### TaskWrapper Method Description

- `getPayload()`: Get task data submitted from upstream (Map format)
- `markComplete(Object result)`: Mark task as complete, pass in processing result
- `markRetryLater()`: Mark task for retry later
- `emitProgress()`: Send progress events (streaming mode)

#### Implementation Example

```java
@Component
public class TaskExecutorImpl implements TaskExecutor {
    
    @Override
    public void submit(TaskWrapper task) {
        try {
            // Get task data
            Map<String, Object> data = task.getPayload();
            
            // Determine task type
            String responseMode = (String) data.get("responseMode");
            
            if ("streaming".equals(responseMode)) {
                // Streaming task processing
                Map<String, Object> result = Map.of("content", "Processing...");
                // Send progress event
                task.emitProgress("onProgress", "onProgress", result);
                // If completed, mark task as complete
                task.markComplete(Map.of());
            } else {
                // Other task processing
                Object result = Map.of("result", "success");
                // Mark task as complete
                task.markComplete(result);
            }
        } catch (Exception e) {
            // Processing failed
            if (shouldRetry(e)) {
                task.markRetryLater();
            } else {
                task.markComplete(Map.of(
                    "error", Map.of(
                        "message", e.getMessage(),
                        "type", "processing_error"
                    )
                ));
            }
        }
    }
    
    @Override
    public Integer remainingCapacity() {
        return 10;
    }
    
    private boolean shouldRetry(Exception e) {
        // Determine whether to retry
        return false;
    }
}
```

### 3.5 Configure Worker Scheduler

Default provides ScheduledWorker based on scheduled polling. Enable and configure scheduling parameters through configuration files.

#### Use Default ScheduledWorker

```yaml
bella:
  queue:
    worker:
      enabled: true
      scheduled:
        enabled: true
        take-strategy: fifo
        size: 10
        queues:
          - "my-task-queue:0"
          - "my-task-queue:1"
```

#### Configuration Parameter Description

- `enabled`: Whether to enable ScheduledWorker scheduler
- `queues`: List of queues to monitor, format "queue-name:priority", smaller numbers have higher priority, tasks will be pulled according to configuration order
- `size`: Maximum number of tasks to pull each time, actual number is the smaller value between TaskExecutor.remainingCapacity() and size
- `take-strategy`: Queue pull strategy
  - `fifo`: First-in-first-out, pull tasks according to queue entry time, earlier entries have higher priority, maximum 10 tasks can be pulled
  - `round_robin`: Round-robin mode, alternately pull from multiple queues
  - `active_passive`: Master-slave mode, prioritize pulling from master queue, pull from backup queue when master queue has no tasks
  - `sequential`: Global sequential execution, ensures only one task can run at a time per queue, avoiding concurrent competition

### 3.6 Custom Worker Scheduling Implementation

If the default ScheduledWorker doesn't meet requirements, you can reuse instantiated Worker components and customize task pulling and scheduling logic.

```java
@Component
public class CustomWorkerScheduler {

    @Autowired
    private Worker worker;

    @Scheduled(fixedDelay = 1000)
    public void pullAndProcessTasks() {
        // Custom task pulling and processing logic
        worker.pullAndProcess();
    }
}
```

## 4. Summary

1. **Worker is an independent service**: Acts as a downstream task processor for Bella-Queue
2. **Queue registration is prerequisite**: Workers need to register queues before receiving tasks
3. **Channel configuration establishes mapping**: Let the system know which model tasks should be distributed to your Worker
4. **Support multiple response modes**: Choose different result return methods according to user requirements
5. **Two development methods**: Self-hosted services or Java SDK, choose according to technology stack