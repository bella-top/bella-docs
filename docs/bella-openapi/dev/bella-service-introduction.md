# BellaService 接入攻略

## 概述

`BellaService` 是 Bella OpenAPI 体系中为能力点服务提供的 Spring Boot 集成框架。它通过一个简单的注解为您的服务自动配置与 Bella OpenAPI 网关的集成能力，包括用户认证、请求追踪、上下文管理等核心功能。

## 核心功能

### 1. 自动化配置
- **零配置集成**：通过 `@BellaService` 注解自动配置所有必要的组件
- **请求过滤器**：自动注册 `BellaRequestFilter`，处理请求头和用户认证
- **拦截器链**：自动配置认证拦截器和并发控制拦截器
- **HTTP 客户端优化**：自动启用 Bella 专用的 HTTP 拦截器

### 2. 双重客户端模式
BellaService 提供两种不同定位的客户端：

#### OpenapiClient（管理类接口）
- **用途**：服务管理、元数据查询、日志记录等管理功能
- **使用限制**：Bella体系下的能力点服务
- **认证方式**：使用配置的服务 AK（Service Access Key）
- **主要功能**：
  - 验证用户 API Key：`whoami(apikey)`, `validate(apikey)`
  - 权限检查：`hasPermission(apikey, url)`
  - 模型信息查询：`getModelInfo(modelName)`
  - 请求路由：`route(endpoint, model, queueMode, userApikey)`
  - 日志记录：`log(processData)`

#### OpenAiService（能力点接口）
- **用途**：调用 AI 能力接口（聊天、嵌入、TTS、ASR 等）
- **认证方式**：使用请求上下文中的用户 AK
- **主要特点**：
  - 自动获取当前请求的用户认证信息
  - 支持自定义超时配置
  - 完全兼容 OpenAI SDK 接口
  - 自动注入 Bella 请求上下文

### 3. 请求上下文管理
- **BellaContext**：ThreadLocal 上下文，自动管理请求级别的信息
- **自动追踪**：每个请求自动生成 TraceID 和 RequestID
- **用户信息**：自动解析和缓存用户 API Key 信息
- **请求头传递**：自动处理 `X-BELLA-*` 系列请求头

### 4. 内置拦截器
BellaService 自动配置了两个关键拦截器：

#### AuthorizationInterceptor（认证拦截器）
- **作用路径**：`/console/**` 和 `/v*/**`（所有版本化API路径）
- **执行优先级**：100
- **主要功能**：
  - 验证请求中的用户认证信息（API Key）
  - 如果没有有效的 Authorization 头，抛出 `AuthorizationException`
  - 支持通过 `ucid` 请求头设置用户操作者信息
  - 自动跳过异步请求的重复认证检查

#### ConcurrentStartInterceptor（并发处理拦截器）
- **作用范围**：全局所有请求
- **主要功能**：
  - 处理 Spring MVC 的异步并发请求
  - 在异步处理开始时标记请求，避免认证拦截器重复执行
  - 确保异步场景下的请求上下文正确传递

## 快速开始

### 1. 添加依赖

在您的 `pom.xml` 中添加 Bella OpenAPI SPI 依赖：

```xml
<dependency>
    <groupId>top.bella</groupId>
    <artifactId>openapi-spi</artifactId>
    <version>{bella-openapi.version}</version>
</dependency>
```

**获取最新版本号：**
- 访问 Maven 中央仓库：https://repo1.maven.org/maven2/top/bella/openapi-spi/
- 选择最新的版本目录即可获取当前可用的最新版本号

**版本兼容性：**
- 推荐使用最新版本以获得最佳功能和安全更新
- 1.2.x 系列版本基于 Spring Boot 2.3.12，适用于大多数 Spring Boot 2.x 项目
- 如果您的项目使用不同的 Spring Boot 版本，请注意依赖兼容性

**对于 Gradle 项目：**

在您的 `build.gradle` 中添加依赖：

```gradle
dependencies {
    implementation 'top.bella:openapi-spi:1.2.6'
}
```

或在 Kotlin DSL (`build.gradle.kts`) 中：

```kotlin
dependencies {
    implementation("top.bella:openapi-spi:1.2.6")
}
```

### 2. 启用 BellaService

在您的 Spring Boot 主类上添加 `@BellaService` 注解：

```java
@SpringBootApplication
@BellaService  // 启用 Bella 服务集成
public class YourServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(YourServiceApplication.class, args);
    }
}
```

### 3. 配置属性

在 `application.yml` 中添加必要的配置：

```yaml
bella:
  openapi:
    # Bella OpenAPI 网关地址
    host: https://your-bella-gateway.com
    # 您的服务标识
    service: your-service-name
    # 服务访问密钥（用于管理接口调用）
    service-ak: your-service-access-key
```
**注意事项**
- service-ak 需要申请console级别的apikey，只对bella体系下的能力点服务开放申请，其他服务接入无需配置
- service 为必填项，会根据服务标识，在请求进入时，自动生成Bella-TraceId，所有使用spi包下进行服务调用都会携带该traceId，用于日志链路追踪

## 使用示例

### 1. 使用 OpenapiClient（管理接口）

```java
@RestController
public class ManagementController {

    @Autowired
    private OpenapiClient openapiClient;

    @GetMapping("/validate-user")
    public ResponseEntity<?> validateUser(@RequestParam String apikey) {
        // 验证用户 API Key
        boolean isValid = openapiClient.validate(apikey);
        if (!isValid) {
            return ResponseEntity.status(401).body("Invalid API Key");
        }

        // 获取用户信息
        ApikeyInfo userInfo = openapiClient.whoami(apikey);
        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("/model/{modelName}")
    public ResponseEntity<Model> getModelInfo(@PathVariable String modelName) {
        // 查询模型信息
        Model model = openapiClient.getModelInfo(modelName);
        return ResponseEntity.ok(model);
    }

    @PostMapping("/route")
    public ResponseEntity<RouteResult> routeRequest(
            @RequestParam String endpoint,
            @RequestParam String model,
            @RequestHeader("Authorization") String authorization) {

        String userApikey = authorization.substring("Bearer ".length());

        // 路由请求到最佳渠道
        RouteResult result = openapiClient.route(endpoint, model, null, userApikey);
        return ResponseEntity.ok(result);
    }
}
```

### 2. 使用 OpenAiService（能力接口）

```java
@RestController
public class AiCapabilityController {

    @Autowired
    private OpenAiServiceFactory openAiServiceFactory;

    @PostMapping("/chat")
    public ResponseEntity<?> chatCompletion(@RequestBody ChatCompletionRequest request) {
        try {
            // 创建使用当前用户上下文的 OpenAI 服务实例
            OpenAiService openAiService = openAiServiceFactory.create();

            // 调用聊天完成接口
            ChatCompletionResult result = openAiService.createChatCompletion(request);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/embeddings")
    public ResponseEntity<?> createEmbeddings(@RequestBody EmbeddingRequest request) {
        // 使用自定义超时的服务实例
        OpenAiService openAiService = openAiServiceFactory.create(30, 300); // 30s连接，300s读取

        EmbeddingResult result = openAiService.createEmbeddings(request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/chat/stream")
    public ResponseEntity<StreamingResponseBody> chatCompletionStream(
            @RequestBody ChatCompletionRequest request) {

        OpenAiService openAiService = openAiServiceFactory.create();

        StreamingResponseBody stream = outputStream -> {
            openAiService.streamChatCompletion(request)
                .doOnNext(chunk -> {
                    try {
                        outputStream.write(("data: " + chunk + "\n\n").getBytes());
                        outputStream.flush();
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .blockingSubscribe();
        };

        return ResponseEntity.ok()
                .header("Content-Type", "text/event-stream")
                .body(stream);
    }
}
```

### 3. 访问请求上下文

```java
@Service
public class ContextAwareService {

    public void processRequest() {
        // 获取当前请求的用户信息
        ApikeyInfo userApikey = BellaContext.getApikey();
        System.out.println("Current user: " + userApikey.getOwnerCode());

        // 获取追踪ID
        String traceId = BellaContext.getTraceId();
        System.out.println("Trace ID: " + traceId);

        // 获取请求ID
        String requestId = BellaContext.getRequestId();
        System.out.println("Request ID: " + requestId);

        // 检查是否为模拟请求
        boolean isMock = BellaContext.isMock();
        if (isMock) {
            System.out.println("This is a mock request");
        }

        // 获取自定义请求头
        String customHeader = BellaContext.getHeader("X-BELLA-CUSTOM");

        // 获取操作者信息（通过 ucid 请求头设置）
        Operator operator = BellaContext.getOperatorIgnoreNull();
        if (operator != null) {
            System.out.println("Operator: " + operator.getSourceId());
        }
    }
}
```

## 高级配置

### 1. 自定义拦截器顺序

BellaService 自动注册了以下拦截器：
- `AuthorizationInterceptor`：优先级 100，作用于 `/console/**` 和 `/v*/**`
- `ConcurrentStartInterceptor`：默认优先级，全局作用

如果需要添加自己的拦截器，请注意顺序：

```java
@Configuration
public class CustomWebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 在认证之前执行的拦截器（如日志记录）
        registry.addInterceptor(new LoggingInterceptor())
                .addPathPatterns("/v*/**")
                .order(50);

        // 在认证之后执行的拦截器（如业务逻辑检查）
        registry.addInterceptor(new BusinessInterceptor())
                .addPathPatterns("/v*/**")
                .order(200);
    }
}
```

### 1.1 拦截器执行顺序说明

拦截器执行顺序（数字越小优先级越高）：
1. **自定义前置拦截器**（order < 100）
2. **AuthorizationInterceptor**（order = 100）- 认证检查
3. **自定义后置拦截器**（order > 100）
4. **ConcurrentStartInterceptor**（默认优先级）- 异步处理标记

### 1.2 绕过认证的路径配置

如果某些路径不需要认证，可以通过自定义配置排除：

```java
@Configuration
public class CustomAuthConfig {

    @Bean
    @Primary
    public AuthorizationInterceptor customAuthorizationInterceptor() {
        return new AuthorizationInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest request,
                                   HttpServletResponse response,
                                   Object handler) {
                String requestPath = request.getRequestURI();

                // 跳过健康检查和公开API
                if (requestPath.startsWith("/health") ||
                    requestPath.startsWith("/v1/public")) {
                    return true;
                }

                return super.preHandle(request, response, handler);
            }
        };
    }
}
```

### 2. 请求过滤器定制

默认的 `BellaRequestFilter` 优先级最高。如果需要在其之前处理请求：

```java
@Bean
public FilterRegistrationBean<YourCustomFilter> yourCustomFilter() {
    FilterRegistrationBean<YourCustomFilter> bean = new FilterRegistrationBean<>();
    bean.setFilter(new YourCustomFilter());
    bean.setOrder(Ordered.HIGHEST_PRECEDENCE - 1); // 比 Bella 过滤器更高优先级
    return bean;
}
```

## 最佳实践

### 1. 异常处理

```java
@ControllerAdvice
public class BellaExceptionHandler {

    @ExceptionHandler(ChannelException.class)
    public ResponseEntity<?> handleChannelException(ChannelException e) {
        // 处理渠道异常
        return ResponseEntity.status(e.getCode())
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleValidationError(IllegalArgumentException e) {
        // 处理参数验证异常（如 API Key 为空）
        return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid parameters: " + e.getMessage()));
    }
}
```

### 2. 日志记录

```java
@Service
public class RequestLoggingService {

    @Autowired
    private OpenapiClient openapiClient;

    public void logRequest(String endpoint, Object request, Object response,
                          long startTime, long endTime) {

        EndpointProcessData processData = new EndpointProcessData();
        processData.setEndpoint(endpoint);
        processData.setBellaTraceId(BellaContext.getTraceId());
        processData.setAkSha(hashApiKey(BellaContext.getApikey().getApikey()));
        processData.setStartTime(startTime);
        processData.setEndTime(endTime);
        processData.setRequestData(JacksonUtils.serialize(request));
        processData.setResponseData(JacksonUtils.serialize(response));

        // 异步记录日志
        CompletableFuture.runAsync(() -> {
            try {
                openapiClient.log(processData);
            } catch (Exception e) {
                log.warn("Failed to log request", e);
            }
        });
    }

    private String hashApiKey(String apikey) {
        // 对 API Key 进行 SHA-256 哈希
        return DigestUtils.sha256Hex(apikey);
    }
}
```

## 注意事项

1. **服务 AK 安全性**：服务 AK 具有管理权限，应妥善保管，建议通过环境变量或配置中心管理
2. **用户 AK 验证**：所有需要用户认证的接口都会自动验证 Authorization 头中的 Bearer Token
3. **请求上下文**：BellaContext 是 ThreadLocal 的，在异步操作中需要手动传递上下文
4. **缓存机制**：OpenapiClient 内置了用户信息和模型信息的缓存，默认过期时间 10 分钟
5. **并发控制**：系统会自动处理并发限制，无需手动实现

## 故障排查

### 常见问题

1. **API Key 验证失败**
   - 检查 `bella.openapi.service-ak` 配置是否正确
   - 确认网关地址 `bella.openapi.host` 可访问

2. **用户认证异常**
   - 检查请求是否包含正确的 `Authorization: Bearer <user-api-key>` 头
   - 确认用户 API Key 有效且有相应权限

3. **请求上下文为空**
   - 确保在 HTTP 请求处理线程中访问 BellaContext
   - 异步操作需要手动传递上下文：`BellaContext.snapshot()` 和 `BellaContext.replace()`

4. **OpenAI 接口调用失败**
   - 检查模型名称是否正确
   - 确认用户 API Key 有对应模型的访问权限
   - 查看网关日志获取详细错误信息

5. **拦截器相关问题**
   - **认证失败 (AuthorizationException)**：
     - 确保请求包含有效的 `Authorization: Bearer <api-key>` 头
     - 检查请求路径是否匹配 `/console/**` 或 `/v*/**` 模式
     - 确认 API Key 已通过 BellaRequestFilter 成功验证

   - **异步请求处理异常**：
     - ConcurrentStartInterceptor 会自动处理异步请求标记
     - 如果自定义拦截器出现异常，检查是否正确处理了异步场景

   - **自定义拦截器不生效**：
     - 检查拦截器的 order 优先级设置
     - 确认路径匹配模式 `.addPathPatterns()` 配置正确
     - 验证拦截器是否正确注册到 Spring 容器

6. **ucid 请求头处理**
   - 如需设置操作者信息，在请求中添加 `ucid` 头
   - 通过 `BellaContext.getOperator()` 获取操作者信息
   - 注意 ucid 仅在通过认证拦截器的请求中生效

通过以上配置和使用方式，您的服务就能够完全集成到 Bella OpenAPI 体系中，享受统一的用户认证、请求追踪、负载均衡等企业级功能。
