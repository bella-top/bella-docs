# Bella OpenAPI SPI Login Service Integration Guide

## Project Architecture Overview

Bella OpenAPI is an enterprise-level AI capability gateway that provides a complete SPI mechanism for integrating login services. The project adopts a modular design, with the SPI module located in api/spi, providing a unified login service interface.

## Authentication Methods Supported by SPI Login Service

### 1. OAuth 2.0 Login

- Supported providers: GitHub, Google (extensible to other providers)
- Configuration path: bella.oauth
- Implementation location: api/spi/src/main/java/com/ke/bella/openapi/login/oauth/

### 2. CAS Single Sign-On

- Protocol version: CAS 3.0
- Configuration path: bella.cas
- Implementation location: api/spi/src/main/java/com/ke/bella/openapi/login/cas/

### 3. Client Mode Login

- Applicable scenario: Independent frontend applications
- Configuration path: bella.login.type=client
- Feature: Based on HTTP session management

### 4. API Key Authentication

- Authentication method: Authorization field in the Header
- Configuration path: bella.login.authorization-header

## Quick Integration Steps

### Step 1: Enable SPI Login Functionality

Add the annotation in your Spring Boot application:

```java
@SpringBootApplication
@EnableBellaLogin  // Enable Bella Login SPI
public class YourApplication {
    public static void main(String[] args) {
        SpringApplication.run(YourApplication.class, args);
    }
}
```

### Step 2: Configure Login Method

#### OAuth Login Configuration Example:

```yaml
bella:
  login:
    type: oauth                                    # Enable OAuth login
    login-page-url: http://localhost:3000/login   # Login page URL
  session:
    cookie-name: bella_openapi_sessionId
    max-inactive-interval: 3600                   # Session timeout (seconds)
    cookie-domain: localhost
  oauth:
    client-index: http://localhost:3000           # Client homepage URL
    redirect: http://localhost:8080               # OAuth callback base URL
    providers:
      github:                                     # GitHub OAuth configuration
        enabled: true
        client-id: ${GITHUB_CLIENT_ID}
        client-secret: ${GITHUB_CLIENT_SECRET}
        scope: read:user user:email
        auth-uri: https://github.com/login/oauth/authorize
        token-uri: https://github.com/login/oauth/access_token
        user-info-uri: https://api.github.com/user
      google:                                     # Google OAuth configuration
        enabled: true
        client-id: ${GOOGLE_CLIENT_ID}
        client-secret: ${GOOGLE_CLIENT_SECRET}
        scope: profile email
        auth-uri: https://accounts.google.com/o/oauth2/v2/auth
        token-uri: https://oauth2.googleapis.com/token
        user-info-uri: https://www.googleapis.com/oauth2/v3/userinfo
```

#### CAS Login Configuration Example:

```yaml
bella:
  login:
    type: cas                                     # Enable CAS login
    login-page-url: http://localhost:3000/login
  session:
    cookie-name: bella_openapi_sessionId
    max-inactive-interval: 3600
  cas:
    server-url-prefix: https://your-cas-server.com/        # CAS server URL
    server-login-url: https://your-cas-server.com/login    # CAS login URL
    client-host: http://localhost:8080                     # Current application address
    client-support: true                                   # Support for SPA applications
    client-index-url: http://localhost:3000               # Frontend homepage URL
    use-cas-user-id: true                                 # Use CAS user ID
    id-attribute: ucid                                    # User ID attribute name
    name-attribute: displayName                           # Username attribute name
    email-attribute: email                                # Email attribute name
```


#### Client Mode Configuration Example:

```yaml
bella:
  login:
    type: client                                  # Client mode
    openapi-base: http://localhost:8080          # API service address
    login-page-url: http://localhost:3000/login
  session:
    cookie-name: bella_openapi_sessionId
    max-inactive-interval: 3600
```

### Step 3: Add Dependencies

Add the SPI dependency in your pom.xml:
```xml
  <dependency>
      <groupId>com.ke.bella</groupId>
      <artifactId>bella-openapi-spi</artifactId>
      <version>${bella.version}</version>
  </dependency>
```

### Step 4: Implement User Repository Interface (Optional)

If you need to customize user management, implement the IUserRepo interface:

```java
@Component
public class CustomUserRepo implements IUserRepo {

      @Override
      public Operator getBySecret(String secret) {
          // Get user information based on the secret key
          // Used for API Key login method
          return null;
      }
}
```

## Login Process Description

### OAuth Login Process:

1. Frontend calls /openapi/oauth/config to get OAuth provider configuration
2. User selects a provider and is redirected to the OAuth authorization page
3. After successful authorization, callback to /openapi/oauth/callback/\{provider}
4. System verifies the authorization code, retrieves user information, creates a session
5. Redirects to the target page

### CAS Login Process:

1. User accesses a protected resource, system checks the session
2. When no session exists, redirects to the CAS server login
3. After successful CAS authentication, returns to the application with a ticket
4. System verifies the ticket, extracts user information, creates a session
5. Redirects to the target page

## Frontend Integration

### Getting User Information:

```javascript
// Get current user information
fetch('/openapi/userInfo')
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            console.log('User information:', data.data);
        } else {
            // User not logged in
            window.location.href = '/login';
        }
    });
```

### OAuth Login:

For integrators who want to implement their own login page.

```javascript
// Get OAuth configuration
fetch('/openapi/oauth/config?redirect=' + encodeURIComponent(window.location.href))
    .then(response => response.json())
    .then(data => {
            // data.data contains available OAuth providers and authorization URLs
            data.data.forEach(provider => {
            // Create login buttons that redirect to provider.authUrl when clicked
        });
    });
```

### Logout:

```javascript
// Logout
fetch('/openapi/logout', { method: 'POST' })
    .then(() => {
        window.location.href = '/login';
    });
```

## Session Management

The system supports two types of session storage:

1. Redis Session (Recommended for production):
    - Supports distributed deployment
    - Session data stored in Redis
    - Requires Redis connection configuration
2. HTTP Session (Suitable for client mode):
    - Based on browser cookies
    - Suitable for single instance deployment

### Security Features

- CSRF Protection: OAuth uses state parameter to prevent CSRF attacks
- Session Management: Supports session timeout and automatic renewal
- Domain Restriction: Supports configuration of allowed redirect domains
- Header Authentication: Supports Authorization header authentication method

## Extending New OAuth Providers

### 1. Extend the AbstractOAuthService class:

```java
@Component
public class CustomOAuthService extends AbstractOAuthService {

      @Override
      public String getProviderType() {
          return "custom";
      }

      @Override
      protected Operator getUserInfo(String accessToken) {
          // Implement logic to get user information
          return Operator.builder()
                  .userId(-1L)
                  .userName("username")
                  .email("email")
                  .source("custom")
                  .sourceId("provider user ID")
                  .build();
      }
}
```

2. Add conditional configuration annotation:

```
@Bean
@ConditionalOnProperty(prefix = "bella.oauth.providers.custom", name = "enabled", havingValue = "true")
public CustomOAuthService customOAuthService(OAuthProperties properties) {
    return new CustomOAuthService(properties);
}
```
