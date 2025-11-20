# Worker 开发接入指南

本文档介绍如何开发Worker服务接入Bella-Queue系统，作为任务处理的下游服务。

## Worker开发方式

系统支持两种Worker开发方式：

1. **自部署服务接入**：独立开发的HTTP服务，通过API与Bella-Queue交互
2. **Java SDK接入**：使用Bella-Queue提供的Java SDK快速集成

## 1. 准备工作：队列和渠道配置

开发Worker前，需要先在Bella-Queue中注册队列并配置渠道映射。

### 1.1 注册Worker队列

为Worker服务注册一个队列：

```bash
curl -X POST "https://${Host}/v1/queue/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "queue": "deepseek-r1",
    "endpoint": "/v1/chat/completions"
  }'
```

**参数说明**

| 参数         | 类型     | 必需       | 说明                                |
|------------|--------|----------|-----------------------------------|
| `queue`    | string | Required | 队列名称（只能包含字母、数字、下划线、分隔符，长度不超过64字符） |
| `endpoint` | string | Required | 处理任务的能力点                          |

**响应**

```bash
"deepseek-r1"
```

### 1.2 配置模型渠道

通过OpenAPI创建渠道（Channel），建立模型名称与队列的映射关系。

**作用**：当用户使用特定模型时，Bella-Queue会根据渠道配置将任务自动路由到对应的队列。

**渠道配置的具体接口和参数请参考OpenAPI接口文档。**

### 1.3 任务路由说明

配置完成后，Bella-Queue通过以下方式将任务放入对应的队列，Worker从队列中拉取任务进行处理：

#### 直接指定队列（Task API）

```bash
curl -X POST "https://${Host}/v1/queue/put" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "queue": "deepseek-r1",
    "endpoint": "/v1/chat/completions",
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
    "callback_url": "http://localhost:8081/test/callback",
  }'
```

#### 批量任务路由（Batch API）

**指定队列**

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

**自动路由**

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

input_file中的每一行请求示例：

```jsonl
{"custom_id": "req-1", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "deepseek-r1", "messages": [...]}}
```

系统根据`deepseek-r1`模型自动查找渠道配置，路由到`deepseek-r1`队列。

## 2. 自部署服务接入

适合已有推理服务或需要使用其他技术栈的场景。

### 2.1 Worker服务开发

Worker服务需要实现以下核心功能：

#### 2.1.1 获取系统配置

获取EventBus配置，用于实时任务通信：

```bash
curl -X GET "https://${Host}/v1/queue/eventbus" \
  -H "Authorization: Bearer ${apikey}"
```

**响应示例**

```json
{
  "url": "redis://localhost:6379",
  "topic": "bella:eventbus:"
}
```

#### 2.1.2 拉取任务

定期从Bella-Queue拉取待处理任务：

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

**响应示例（离线队列 - Batch/Callback模式）**

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

**响应示例（在线队列 - Blocking/Streaming模式）**

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

**instanceId说明**：在线任务会携带`instance_id`字段，标识发起请求的客户端实例地址（如IP:端口），Worker处理完成后需要向Redis
Stream发送事件到对应的实例。

#### 2.1.3 处理任务并返回结果

根据`response_mode`采用不同的结果返回方式：

##### Callback/Batch模式 - HTTP接口返回

```bash
curl -X POST "https://${Host}/v1/queue/{taskId}/complete" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -d '{
    "status_code": 200,
    "request_id": "TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
    "body": {
      // Worker处理结果 - chat completion响应
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

##### Blocking/Streaming模式 - Redis事件返回

在线任务携带`instance_id`字段，Worker需要通过Redis Stream发送事件到：`{eventbus.topic}{instance_id}`

例如：eventbus.topic = "bella:eventbus:"，instance_id = "192.168.1.100:8080"
则发送到：`bella:eventbus:192.168.1.100:8080`

**进度事件**

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

**完成事件**

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

## 3. Java SDK接入

适合Java技术栈的应用，可以快速集成到Spring Boot项目中。

### 3.1 添加依赖

```xml

<dependency>
    <groupId>top.bella</groupId>
    <artifactId>openapi-spi</artifactId>
    <version>1.1.68</version>
</dependency>
```

### 3.2 启用Worker

```java

@SpringBootApplication
@EnableWorker
public class WorkerApplication {
    public static void main(String[] args) {
        SpringApplication.run(WorkerApplication.class, args);
    }
}
```

### 3.3 配置OpenAiService

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

### 3.4 实现TaskExecutor

TaskExecutor是Worker处理任务的核心接口，定义了任务提交执行和容量管理的契约。

#### 接口定义

```java
public interface TaskExecutor {
    /**
     * 提交任务处理
     * @param task 任务包装器，包含任务数据和状态管理方法
     */
    void submit(TaskWrapper task);

    /**
     * 返回当前可处理的任务数量
     * Worker可根据该参数动态调整拉取任务的数量
     * @return 剩余容量，返回0时不会拉取新任务
     */
    Integer remainingCapacity();
}
```

#### TaskWrapper方法说明

- `getPayload()`: 获取上游提交的任务数据（Map格式）
- `markComplete(Object result)`: 标记任务完成，传入处理结果
- `markRetryLater()`: 标记任务稍后重试
- `emitProgress()`: 发送进度事件（streaming模式）

#### 实现示例

```java

@Component
public class TaskExecutorImpl implements TaskExecutor {

    @Override
    public void submit(TaskWrapper task) {
        try {
            // 获取任务数据
            Map<String, Object> data = task.getPayload();

            // 判断任务类型
            String responseMode = (String) data.get("responseMode");

            if("streaming".equals(responseMode)) {
                // Streaming任务处理
                Map<String, Object> result = Map.of("content", "Processing...");
                // 发送进度事件
                task.emitProgress("onProgress", "onProgress", result);
                // 如果完成，标记任务完成
                task.markComplete(Map.of());
            } else {
                // 其他任务处理
                Object result = Map.of("result", "success");
                // 标记任务完成
                task.markComplete(result);
            }
        } catch (Exception e) {
            // 处理失败
            if(shouldRetry(e)) {
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
        // 判断是否应该重试
        return false;
    }
}
```

### 3.5 配置Worker调度执行器

默认提供基于定时轮询的ScheduledWorker，通过配置文件启用并配置调度参数。

#### 使用默认ScheduledWorker

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

#### 配置参数说明

- `enabled`: 是否启用ScheduledWorker调度器
- `queues`: 监听的队列列表，格式为"队列名:优先级"，数字越小优先级越高，会根据配置顺序拉取任务
- `size`: 每次拉取的最大任务数，实际数量取TaskExecutor.remainingCapacity()和size之间的小值
- `take-strategy`: 队列拉取策略
    - `fifo`: 先进先出，按照任务入队时间先后拉取，入队越早优先级越高，最多只能拉取10个
    - `round_robin`: 轮询模式，在多个队列间轮流拉取
    - `active_passive`: 主备模式，优先拉取主队列，主队列无任务时拉取备队列
    - `sequential`: 全局顺序执行，确保每个队列同一时间只能有一个任务在运行，每个队列只拉取一个任务

### 3.6 自定义Worker调度执行实现

如果默认的ScheduledWorker不满足需求，可以复用已实例化的Worker组件，自定义拉取任务调度执行逻辑。

```java

@Component
public class CustomWorkerScheduler {

    @Autowired
    private Worker worker;

    @Scheduled(fixedDelay = 1000)
    public void pullAndProcessTasks() {
        // 自定义任务拉取和处理逻辑
        worker.pullAndProcess();
    }
}
```
