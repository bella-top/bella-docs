# Response API SDK使用说明

bella-openai4j 库完整支持 OpenAI Response API，包括流式（SSE）和非流式两种模式。

## 目录

- [快速开始](#快速开始)
- [非流式模式](#非流式模式)
- [流式模式](#流式模式)
- [高级用法](#高级用法)
- [事件处理](#事件处理)
- [示例代码](#示例代码)

## 快速开始

### Maven 依赖

```xml
<dependency>
   <groupId>top.bella</groupId>
   <artifactId>openai-service</artifactId>
   <version>${bella-openai.version}</version>
</dependency>
```

**获取最新版本号：**
- 访问 Maven 中央仓库：https://repo1.maven.org/maven2/top/bella/openai-service/
- 选择最新的版本目录即可获取当前可用的最新版本号
- 0.23.83之后的版本支持response api client

### 初始化

```java
import com.theokanning.openai.service.OpenAiService;

// 从环境变量读取 API Key
OpenAiService service = new OpenAiService();

// 或者直接指定 API Key
OpenAiService service = new OpenAiService("your-api-key");

// 自定义超时时间
OpenAiService service = new OpenAiService(Duration.ofSeconds(60));
```

## 非流式模式

### 基本用法

```java
import com.theokanning.openai.response.*;

// 创建请求
CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("Hello, how are you?"))
    .build();

// 发送请求并获取完整响应
Response response = service.createResponse(request);

// 获取响应内容
System.out.println("Response ID: " + response.getId());
System.out.println("Status: " + response.getStatus());
System.out.println("Output: " + response.getOutput());
```

### 带指令的请求

```java
CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("What is 2+2?"))
    .instructions("You are a helpful math teacher. Be concise.")
    .temperature(0.7)
    .maxOutputTokens(100)
    .build();

Response response = service.createResponse(request);
```

### 对话上下文

#### 使用previous_response_id
```java
// 第一轮对话
CreateResponseRequest request1 = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("My name is Alice"))
    .build();

Response response1 = service.createResponse(request1);

// 第二轮对话 - 引用前一个 response
String previousId = response1.getId();
CreateResponseRequest request2 = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("What is my name?"))
    .previousResponseId(previousId)
    .build();

Response response2 = service.createResponse(request2);
```

#### 使用conversationId
```java
// 第一轮对话
CreateResponseRequest request1 = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("My name is Alice"))
    .build();

Response response1 = service.createResponse(request1);

// 第二轮对话 - 引用前一个 response
String conversationId = response1.getConversation().getStringValue();
CreateResponseRequest request2 = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("What is my name?"))
    .conversation(ConversationValue.of(conversationId))
    .build();

Response response2 = service.createResponse(request2);
```

### 获取已创建的 Response

```java
String responseId = "resp_xxxxx";
Response response = service.getResponse(responseId);
```

### 添加元数据

```java
CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("Hello"))
    .metadata(Map.of(
        "user_id", "user123",
        "session", "session456"
    ))
    .build();

Response response = service.createResponse(request);
```

### 存储控制

Response API支持两种存储模式，通过`store`参数控制：

#### Store模式（默认，store = true）

对话历史会持久化到数据库，响应中包含`conversation`字段，支持续接对话：

```java
CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("北京天气怎么样？"))
    .store(true)  // 默认值，可以省略
    .build();

Response response = service.createResponse(request);

// 响应中包含conversation
String conversationId = response.getConversation().getStringValue();
System.out.println("Conversation ID: " + conversationId);
```

**适用场景**：
- 多轮对话应用
- 需要查看历史记录
- 会话管理和分析

#### 非Store模式（store = false）

对话不会持久化，适合单次查询和隐私敏感场景：

```java
CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("翻译成英文：你好世界"))
    .store(false)  // 不保存对话历史
    .build();

Response response = service.createResponse(request);
// response.getConversation() 将返回null
```

**适用场景**：
- 单次查询（翻译、格式转换等）
- 隐私敏感场景
- 客户端自行管理上下文

**重要限制**：非store模式不能使用`previousResponseId`或`conversation`续接对话，否则会抛出异常：

```java
// ❌ 错误示例：非store模式不能续接对话
CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("继续上面的话题"))
    .previousResponseId("resp_xxx")  // 错误：与store=false冲突
    .store(false)
    .build();
// 抛出异常: "store can not be set `false` when you request with previous_response_id or conversation"

// ✅ 正确示例：store模式可以续接
CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("继续上面的话题"))
    .previousResponseId("resp_xxx")
    .store(true)  // 必须为true
    .build();
```

#### 客户端管理对话示例

如果在客户端自己管理对话历史，可以使用非store模式：

```java
List<Message> conversationHistory = new ArrayList<>();

// 第一轮对话
conversationHistory.add(createUserMessage("第一个问题"));
CreateResponseRequest request1 = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of(conversationHistory))
    .store(false)
    .build();

Response response1 = service.createResponse(request1);
conversationHistory.add(extractAssistantMessage(response1));

// 第二轮对话
conversationHistory.add(createUserMessage("第二个问题"));
CreateResponseRequest request2 = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of(conversationHistory))
    .store(false)  // 仍然不存储
    .build();

Response response2 = service.createResponse(request2);
```

## 流式模式

### 基本流式处理

```java
import io.reactivex.Flowable;
import com.theokanning.openai.service.response_stream.ResponseSSE;

CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("Write a poem about coding"))
    .stream(true)  // 开启流式模式
    .build();

// 获取流式响应
Flowable<ResponseSSE> stream = service.createResponseStream(request);

// 订阅并处理事件
stream.subscribe(
    sse -> {
        System.out.println("Event type: " + sse.getType());
        BaseStreamEvent event = sse.getEvent();
        // 处理事件
    },
    error -> System.err.println("Error: " + error.getMessage()),
    () -> System.out.println("Stream completed")
);
```

### 使用 ResponseStreamManager

`ResponseStreamManager` 提供了更高级的流式处理能力，包括事件分发、文本累积等。

#### 异步模式

```java
import com.theokanning.openai.service.response_stream.*;
import com.theokanning.openai.response.stream.*;

CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("Explain quantum computing"))
    .stream(true)
    .build();

// 创建事件处理器
ResponseEventHandler handler = new ResponseEventHandler() {
    @Override
    public void onResponseCreated(ResponseCreatedEvent event) {
        System.out.println("Response created");
    }

    @Override
    public void onOutputTextDelta(OutputTextDeltaEvent event) {
        // 实时输出文本增量
        System.out.print(event.getDelta());
    }

    @Override
    public void onResponseCompleted(ResponseCompletedEvent event) {
        System.out.println("\n\nResponse completed!");
    }

    @Override
    public void onError(Throwable error) {
        System.err.println("Error: " + error.getMessage());
    }
};

// 启动异步流管理器
ResponseStreamManager manager = ResponseStreamManager.start(
    service.createResponseStream(request),
    handler
);

// 等待完成
manager.waitForCompletion();

// 获取累积的文本
String fullText = manager.getAccumulatedText().orElse("");
System.out.println("Final text: " + fullText);
```

#### 同步模式

```java
// 同步模式会阻塞直到流处理完成
ResponseStreamManager manager = ResponseStreamManager.syncStart(
    service.createResponseStream(request),
    handler
);

// 执行到这里时，流已经完全处理完毕
System.out.println("Stream completed synchronously");
String fullText = manager.getAccumulatedText().orElse("");
```

### 简化的事件处理

如果只需要获取文本输出：

```java
StringBuilder output = new StringBuilder();

ResponseStreamManager.start(
    service.createResponseStream(request),
    new ResponseEventHandler() {
        @Override
        public void onOutputTextDelta(OutputTextDeltaEvent event) {
            output.append(event.getDelta());
        }
    }
).waitForCompletion();

System.out.println("Complete output: " + output.toString());
```

## 高级用法

### 工具调用（Function Calling）

```java
import com.theokanning.openai.response.tool.definition.*;

// 定义工具
ToolDefinition weatherTool = ToolDefinition.builder()
    .type("function")
    .function(FunctionDefinition.builder()
        .name("get_weather")
        .description("Get the current weather")
        .parameters(/* ... */)
        .build())
    .build();

CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("What's the weather in Tokyo?"))
    .tools(List.of(weatherTool))
    .build();

Response response = service.createResponse(request);
```

### 推理模型配置

```java
CreateResponseRequest request = CreateResponseRequest.builder()
    .model("o1-preview")
    .input(InputValue.of("Solve this complex problem..."))
    .reasoning(CreateResponseRequest.ReasoningConfig.builder()
        .effort("high")
        .summary("detailed")
        .build())
    .build();

// 流式处理推理输出
ResponseStreamManager.start(
    service.createResponseStream(request),
    new ResponseEventHandler() {
        @Override
        public void onReasoningTextDelta(ReasoningTextDeltaEvent event) {
            System.out.print("[Reasoning] " + event.getDelta());
        }

        @Override
        public void onOutputTextDelta(OutputTextDeltaEvent event) {
            System.out.print("[Output] " + event.getDelta());
        }
    }
).waitForCompletion();
```

### 响应格式控制

```java
import com.theokanning.openai.completion.chat.ChatResponseFormat;

CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("Generate a JSON user profile"))
    .text(CreateResponseRequest.TextConfig.builder()
        .format(ChatResponseFormat.JSON_OBJECT)
        .verbosity("detailed")
        .build())
    .build();

Response response = service.createResponse(request);
```

### 截断策略

```java
import com.theokanning.openai.assistants.run.TruncationStrategy;

CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("Very long input..."))
    .truncation("auto")  // 或 "disabled"
    .maxOutputTokens(1000)
    .build();
```

## 事件处理

Response API 支持丰富的流式事件类型。

### 主要事件类型

| 事件类型 | 描述 | Handler 方法 |
|---------|------|-------------|
| `response.created` | Response 创建 | `onResponseCreated()` |
| `response.in_progress` | Response 处理中 | `onResponseInProgress()` |
| `response.completed` | Response 完成 | `onResponseCompleted()` |
| `response.failed` | Response 失败 | `onResponseFailed()` |
| `response.output_item.added` | 输出项添加 | `onOutputItemAdded()` |
| `response.output_text.delta` | 文本增量 | `onOutputTextDelta()` |
| `response.output_text.done` | 文本完成 | `onOutputTextDone()` |
| `response.function_call_arguments.delta` | 函数参数增量 | `onFunctionCallArgumentsDelta()` |
| `response.reasoning_text.delta` | 推理文本增量 | `onReasoningTextDelta()` |

### 完整的事件处理示例

```java
ResponseEventHandler handler = new ResponseEventHandler() {
    @Override
    public void onResponseCreated(ResponseCreatedEvent event) {
        System.out.println("=== Response Created ===");
    }

    @Override
    public void onOutputItemAdded(OutputItemAddedEvent event) {
        System.out.println("New output item added");
    }

    @Override
    public void onOutputTextDelta(OutputTextDeltaEvent event) {
        System.out.print(event.getDelta());
    }

    @Override
    public void onFunctionCallArgumentsDelta(FunctionCallArgumentsDeltaEvent event) {
        System.out.println("Function args: " + event.getDelta());
    }

    @Override
    public void onReasoningTextDelta(ReasoningTextDeltaEvent event) {
        System.out.println("[Reasoning] " + event.getDelta());
    }

    @Override
    public void onFileSearchSearching(FileSearchSearchingEvent event) {
        System.out.println("Searching files...");
    }

    @Override
    public void onWebSearchSearching(WebSearchSearchingEvent event) {
        System.out.println("Searching web...");
    }

    @Override
    public void onCodeInterpreterInterpreting(CodeInterpreterInterpretingEvent event) {
        System.out.println("Executing code...");
    }

    @Override
    public void onResponseCompleted(ResponseCompletedEvent event) {
        System.out.println("\n=== Response Completed ===");
    }

    @Override
    public void onResponseFailed(ResponseFailedEvent event) {
        System.err.println("Response failed!");
    }

    @Override
    public void onError(Throwable error) {
        System.err.println("Error: " + error.getMessage());
    }
};
```

## 示例代码

### 示例 1: 简单聊天

```java
OpenAiService service = new OpenAiService();

CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("Tell me a joke"))
    .build();

Response response = service.createResponse(request);
System.out.println(response.getOutputText());
```

### 示例 2: 流式打字机效果

```java
CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("Write a short story"))
    .stream(true)
    .build();

ResponseStreamManager.start(
    service.createResponseStream(request),
    new ResponseEventHandler() {
        @Override
        public void onOutputTextDelta(OutputTextDeltaEvent event) {
            System.out.print(event.getDelta());
            System.out.flush();
            try {
                Thread.sleep(50); // 模拟打字机效果
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
).waitForCompletion();
```

### 示例 3: 带上下文的多轮对话

```java
String conversationId = "conv-" + UUID.randomUUID();
String previousResponseId = null;

// 对话循环
Scanner scanner = new Scanner(System.in);
while (true) {
    System.out.print("You: ");
    String userInput = scanner.nextLine();

    if ("exit".equalsIgnoreCase(userInput)) {
        break;
    }

    CreateResponseRequest.CreateResponseRequestBuilder builder =
        CreateResponseRequest.builder()
            .model("gpt-4o-mini")
            .input(InputValue.of(userInput))
            .conversation(ConversationValue.of(conversationId))
            .stream(true);

    if (previousResponseId != null) {
        builder.previousResponseId(previousResponseId);
    }

    System.out.print("AI: ");

    StringBuilder response = new StringBuilder();
    ResponseStreamManager manager = ResponseStreamManager.start(
        service.createResponseStream(builder.build()),
        new ResponseEventHandler() {
            @Override
            public void onOutputTextDelta(OutputTextDeltaEvent event) {
                String delta = event.getDelta();
                System.out.print(delta);
                response.append(delta);
            }

            @Override
            public void onResponseCreated(ResponseCreatedEvent event) {
                previousResponseId = event.getResponse().getId();
            }
        }
    );

    manager.waitForCompletion();
    System.out.println("\n");
}
```

### 示例 4: 错误处理

```java
CreateResponseRequest request = CreateResponseRequest.builder()
    .model("gpt-4o-mini")
    .input(InputValue.of("Hello"))
    .stream(true)
    .build();

try {
    ResponseStreamManager manager = ResponseStreamManager.start(
        service.createResponseStream(request),
        new ResponseEventHandler() {
            @Override
            public void onError(Throwable error) {
                if (error instanceof OpenAiHttpException) {
                    OpenAiHttpException httpError = (OpenAiHttpException) error;
                    System.err.println("API Error: " + httpError.getMessage());
                    System.err.println("Status: " + httpError.statusCode);
                } else {
                    System.err.println("Error: " + error.getMessage());
                }
            }
        }
    );

    manager.waitForCompletion();

} catch (Exception e) {
    System.err.println("Failed to start stream: " + e.getMessage());
}
```

## 注意事项

1. **流式结束标记**: Response API 不使用 `[DONE]` 标记，而是通过 `response.completed`、`response.failed` 或 `response.incomplete` 事件表示结束。

2. **超时设置**: 对于长时间运行的请求，建议设置较长的超时时间：
   ```java
   OpenAiService service = new OpenAiService(Duration.ofMinutes(5));
   ```

3. **资源管理**: `ResponseStreamManager` 提供 `shutDown()` 方法用于提前终止流：
   ```java
   ResponseStreamManager manager = ResponseStreamManager.start(stream, handler);
   // ... 某些条件下提前终止
   manager.shutDown();
   ```

4. **线程安全**: `ResponseStreamManager` 内部使用同步集合，可以安全地在多线程环境中使用。

5. **错误重试**: 对于网络错误，建议实现重试逻辑：
   ```java
   int maxRetries = 3;
   for (int i = 0; i < maxRetries; i++) {
       try {
           Response response = service.createResponse(request);
           break;
       } catch (OpenAiHttpException e) {
           if (i == maxRetries - 1) throw e;
           Thread.sleep(1000 * (i + 1));
       }
   }
   ```

## 相关链接

- [OpenAI Response API 官方文档](https://platform.openai.com/docs/api-reference/response)
- [bella-openai4j GitHub](https://github.com/LianjiaTech/bella-openai4j)
- [更多示例](https://github.com/LianjiaTech/bella-openai4j/blob/main/example/src/main/java/example/ResponseApiExample.java)

