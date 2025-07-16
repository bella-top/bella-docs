# SPI接入登录服务使用指南

## 项目架构概述

Bella OpenAPI是一个企业级AI能力网关，提供了完整的SPI机制来集成登录服务。项目采用模块化设计，SPI模块位于api/spi，提供了统一的登录服务接口。

## SPI登录服务支持的认证方式

### OAuth 2.0 登录

- 支持提供商: GitHub、Google (可扩展其他提供商)
- 配置路径: bella.oauth
- 实现位置: api/spi/src/main/java/com/ke/bella/openapi/login/oauth/

### CAS 单点登录

- 协议版本: CAS 3.0
- 配置路径: bella.cas
- 实现位置: api/spi/src/main/java/com/ke/bella/openapi/login/cas/

### 客户端模式登录

- 适用场景: 独立前端应用
- 配置路径: bella.login.type=client
- 特点: 基于HTTP会话管理

### API Key 认证

- 认证方式: Header中的Authorization字段
- 配置路径: bella.login.authorization-header

## 快速接入步骤

### 第一步：启用SPI登录功能

在你的Spring Boot应用中添加注解：

```java
@SpringBootApplication
@EnableBellaLogin  // 启用Bella登录SPI
public class YourApplication {
    public static void main(String[] args) {
        SpringApplication.run(YourApplication.class, args);
    }
}
```

### 第二步：配置登录方式

#### OAuth登录配置示例：

```yaml
bella:
  login:
    type: oauth                                    # 启用OAuth登录
    login-page-url: http://localhost:3000/login   # 登录页面URL
  session:
    cookie-name: bella_openapi_sessionId
    max-inactive-interval: 3600                   # 会话超时时间(秒)
    cookie-domain: localhost
  oauth:
    client-index: http://localhost:3000           # 客户端首页URL
    redirect: http://localhost:8080               # OAuth回调基础URL
    providers:
      github:                                     # GitHub OAuth配置
        enabled: true
        client-id: ${GITHUB_CLIENT_ID}
        client-secret: ${GITHUB_CLIENT_SECRET}
        scope: read:user user:email
        auth-uri: https://github.com/login/oauth/authorize
        token-uri: https://github.com/login/oauth/access_token
        user-info-uri: https://api.github.com/user
      google:                                     # Google OAuth配置
        enabled: true
        client-id: ${GOOGLE_CLIENT_ID}
        client-secret: ${GOOGLE_CLIENT_SECRET}
        scope: profile email
        auth-uri: https://accounts.google.com/o/oauth2/v2/auth
        token-uri: https://oauth2.googleapis.com/token
        user-info-uri: https://www.googleapis.com/oauth2/v3/userinfo
```

#### CAS登录配置示例：

```yaml
bella:
  login:
    type: cas                                     # 启用CAS登录
    login-page-url: http://localhost:3000/login
  session:
    cookie-name: bella_openapi_sessionId
    max-inactive-interval: 3600
  cas:
    server-url-prefix: https://your-cas-server.com/        # CAS服务器URL
    server-login-url: https://your-cas-server.com/login    # CAS登录URL
    client-host: http://localhost:8080                     # 当前应用地址
    client-support: true                                   # 支持SPA应用
    client-index-url: http://localhost:3000               # 前端首页URL
    use-cas-user-id: true                                 # 使用CAS用户ID
    id-attribute: ucid                                    # 用户ID属性名
    name-attribute: displayName                           # 用户名属性名
    email-attribute: email                                # 邮箱属性名
```


#### 客户端模式配置示例：

```yaml
bella:
  login:
    type: client                                  # 客户端模式
    openapi-base: http://localhost:8080          # API服务地址
    login-page-url: http://localhost:3000/login
  session:
    cookie-name: bella_openapi_sessionId
    max-inactive-interval: 3600
```

### 第三步：添加依赖

在你的pom.xml中添加SPI依赖：
```xml
  <dependency>
      <groupId>com.ke.bella</groupId>
      <artifactId>bella-openapi-spi</artifactId>
      <version>${bella.version}</version>
  </dependency>
```

### 第四步：实现用户仓库接口（可选）

如果需要自定义用户管理，实现IUserRepo接口：

```java
@Component
public class CustomUserRepo implements IUserRepo {

      @Override
      public Operator getBySecret(String secret) {
          // 根据密钥获取用户信息
          // 用于API Key登录方式
          return null;
      }
}
```

## 登录流程说明

### OAuth登录流程：

1. 前端调用/openapi/oauth/config获取OAuth提供商配置
2. 用户选择提供商，跳转到OAuth授权页面
3. 授权成功后回调到/openapi/oauth/callback/\{provider}
4. 系统验证授权码，获取用户信息，创建会话
5. 重定向到目标页面

### CAS登录流程：

1. 用户访问受保护资源，系统检查会话
2. 无会话时重定向到CAS服务器登录
3. CAS认证成功后带ticket回调应用
4. 系统验证ticket，提取用户信息，创建会话
5. 重定向到目标页面

## 前端集成

### 获取用户信息：

```javascript
// 获取当前用户信息
fetch('/openapi/userInfo')
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            console.log('用户信息:', data.data);
        } else {
            // 用户未登录
            window.location.href = '/login';
        }
    });
```

### OAuth登录：

用于接入方前端独立实现登录页面。

```javascript
// 获取OAuth配置
fetch('/openapi/oauth/config?redirect=' + encodeURIComponent(window.location.href))
    .then(response => response.json())
    .then(data => {
            // data.data 包含可用的OAuth提供商和授权URL
            data.data.forEach(provider => {
            // 创建登录按钮，点击时跳转到 provider.authUrl
        });
    });
```

### 退出登录：

```javascript
// 退出登录
fetch('/openapi/logout', { method: 'POST' })
    .then(() => {
        window.location.href = '/login';
    });
```

## 会话管理

系统支持两种会话存储方式：

1. Redis会话 (推荐生产环境)：
    - 支持分布式部署
    - 会话数据存储在Redis中
    - 需要配置Redis连接
2. HTTP会话 (适用客户端模式)：
    - 基于浏览器Cookie
    - 适用于单实例部署

### 安全特性

- CSRF防护: OAuth使用state参数防止CSRF攻击
- 会话管理: 支持会话超时和自动续期
- 域名限制: 支持配置允许的重定向域名
- 头部认证: 支持Authorization头部认证方式

## 扩展新的OAuth提供商

### 1. 继承AbstractOAuthService类：

```java
@Component
public class CustomOAuthService extends AbstractOAuthService {

      @Override
      public String getProviderType() {
          return "custom";
      }

      @Override
      protected Operator getUserInfo(String accessToken) {
          // 实现获取用户信息的逻辑
          return Operator.builder()
                  .userId(-1L)
                  .userName("用户名")
                  .email("邮箱")
                  .source("custom")
                  .sourceId("提供商用户ID")
                  .build();
      }
}
```

2. 添加条件装配注解：

```
@Bean
@ConditionalOnProperty(prefix = "bella.oauth.providers.custom", name = "enabled", havingValue = "true")
public CustomOAuthService customOAuthService(OAuthProperties properties) {
    return new CustomOAuthService(properties);
}
```
