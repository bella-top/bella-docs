# Response API 完整使用文档

## 概述

Response API 是一个轻量、灵活的对话接口，支持多模态输入、多种内置工具调用、推理模式等高级特性。
> 完整的请求协议见：https://platform.openai.com/docs/api-reference/responses/create

> 完整的响应协议见：https://platform.openai.com/docs/api-reference/responses/object

> 全部流式事件见：https://platform.openai.com/docs/api-reference/responses-streaming

> 文件输入以及file_search工具需要的file-id，以 `purpose`为`assistants`的方式，上传到`file-api`，见 [文件上传](../../bella-knowledge/api/files/upload.md)

## 为什么选择Response API?

### 完全覆盖chat-completion
支持chat-completion的所有功能，非store模式可以理解为功能更丰富的chat-completion接口

### 使用便捷
相比assistant api使用更方便，无需创建智能体

### 丰富的多模态输入
- 全模型支持File Input，以 `purpose`为`assistants`的方式，上传到`file-api`后，可以直接使用File Input，LLM将根据文件内容生成响应
- 全模型支持Audio Input，支持直接以语音作为输入
- 兼容chat-completion的图片识别能力，后续会扩展为全模型支持

### 强大的内置工具
- 支持集成私有知识库，私有知识的上下文组织是使用LLM的痛点之一，response-api提供了file-search工具，结合`bella-knowledge`使用，添加私有知识极其简单
- 支持网络搜索，原生支持web search工具，使用简单，可以减少模型幻觉，更新LLM的知识库
- 支持MCP工具，可以让LLM与应用服务进行交互，获得私有知识或者执行你的既定流程 
- MCP工具支持审批执行，Client在实现与用户交互时更方便
- 内置自主生成代码/工具/子Agent的工具来解决问题，完成复杂任务（敬请期待）

### 支持 `store`和`非store`双模式

#### `store`模式
- `store`模式更可直接，使用response-api为客户端提供上下文管理的能力
- `store`模式，进行请求只需要携带`previous_response_id`或`conversation`即可在请求LLM时保留对话上下文
- `store`模式便于轻量级应用的快速搭建

#### `非store`模式
- `非store`模式拥有更高的性能和安全性，在response-api的服务端完全不留痕
- 适用于客户端自行管理上下文的场景
- 使用chat-completion搭建的应用可以此模式快速迁移
- 相当于chat-completion的扩展，可使用response-api的全部工具和多模态输入能力

### 可重复使用的 `previous_response_id`
- 同一`previous_response_id`支持并发使用/重复使用
- 如果某一次输入错误，可以使用上一次响应的`response_id`作为`previous_response_id`，防止污染上下文
- 这意味着用户某一次回答不满意时，Client端可以基于此特性非常简单地实现删除某条消息的操作
- 可以在同一对话中进行不同提示词的A/B Test等实验性操作，上下文互不干扰
- 不同的用户也可以基于同一会话并发地进行请求，且上下文互不干扰，Client端可以基于此实现用户对某次会话的分享

### 更多高级特性
- 根据文件、网页生成的回答，提供信息的引用来源
- 支持Local Shell Tool，可以借此搭建应用，让LLM操作你的电脑
- 支持Custom Tool，可以理解为Response Format的平替，支持regex和lark语法，更方便地实现参数的提取
- 后台执行模式（敬请期待）

### 全面且严谨的协议规范
- 协议的设计考虑了开发者搭建Agent需要的方方面面
- 可扩展性强，此协议可伴随着未来AI能力的发展，不断扩展新功能

## 核心端点

### 创建响应
**端点**: `POST /v1/responses`  
**认证**: Bearer Token

### 获取响应详情
**端点**: `GET /v1/responses/{response_id}`  
**认证**: Bearer Token

## 核心功能详解

### 1. 基础对话

#### 简单文本对话
```json
{
  "model": "gpt-5-nano",
  "input": "How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
  "stream": true
}
```

#### 带推理模式的对话
```json
{
  "model": "gpt-5-nano",
  "input": [{
    "role": "user",
    "content": "复杂问题..."
  }],
  "store": true,
  "reasoning": {
    "effort": "medium",
    "summary": "auto"
  },
  "stream": true
}
```

### 2. 会话管理

#### 续接上次对话
```json
{
  "model": "gpt-5-nano",
  "previous_response_id": "resp_1000012001",
  "input": "继续上面的话题...",
  "store": true,
  "stream": true
}
```

#### 基于历史会话
```json
{
  "model": "gpt-5-nano",
  "conversation": "conv_xxx",
  "input": "基于之前的讨论...",
  "store": true
}
```

### 3. 多模态输入

Response API支持多种输入模态的组合使用：
- **文本**（input_text）
- **图片**（input_image）
- **音频**（input_audio）
- **文件**（input_file）

#### 文件输入
```json
{
  "model": "gpt-5-nano",
  "input": [{
    "role": "user",
    "content": [
      {
        "type": "input_file",
        "file_id": "file-2509221659180022489862-1989906366"
      },
      {
        "type": "input_text",
        "text": "他的学历是什么？"
      }
    ]
  }],
  "store": false,
  "stream": true
}
```

#### 图片输入（Base64）
```json
{
  "model": "gpt-5-nano",
  "input": [{
    "role": "user",
    "content": [
      {
        "type": "input_image",
        "image_url": "data:image;base64,/9j/4AAQSkZJRgAB..."
      },
      {
        "type": "input_text",
        "text": "描述这张图片"
      }
    ]
  }],
  "stream": true
}
```

#### 音频输入
```json
{
  "model": "gpt-5-nano",
  "input": [{
    "role": "user",
    "content": [
      {
        "type": "input_audio",
        "input_audio": {
          "format": "wav",
          "data": "UklGRv////9XQVZFZm10..."
        }
      },
      {
        "type": "input_text",
        "text": "这段语音是什么内容？"
      }
    ]
  }],
  "reasoning": {
    "effort": "medium",
    "summary": "auto"
  },
  "stream": true
}
```

### 4. 工具调用

#### 函数工具（Function Tools）

##### 基础函数定义
```json
{
  "model": "gpt-5",
  "input": [{
    "type": "message",
    "role": "user",
    "content": "北京和上海现在的天气怎么样？"
  }],
  "tools": [{
    "type": "function",
    "name": "get_weather",
    "description": "Retrieves current weather for the given location.",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "object",
          "properties": {
            "x": {"type": "string"},
            "y": {"type": "string"}
          },
          "required": ["x", "y"]
        },
        "units": {
          "type": "string",
          "enum": ["celsius", "fahrenheit"]
        }
      },
      "required": ["location", "units"]
    },
    "strict": true
  }]
}
```

##### 包含函数调用历史的对话
```json
{
  "model": "gpt-5-nano",
  "input": [
    {
      "type": "message",
      "role": "user",
      "content": "北京现在的天气怎么样？"
    },
    {
      "type": "function_call",
      "status": "completed",
      "call_id": "call_weather456",
      "name": "get_weather",
      "arguments": "{\"city\": \"北京\", \"unit\": \"celsius\"}"
    },
    {
      "status": "completed",
      "type": "function_call_output",
      "call_id": "call_weather456",
      "output": "{\"temperature\": 15, \"condition\": \"晴朗\"}"
    },
    {
      "type": "message",
      "role": "user",
      "content": "比较一下上海的天气"
    }
  ],
  "tools": [{
    "type": "function",
    "name": "get_weather",
    "description": "Retrieves current weather for the given location.",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "object",
          "properties": {
            "x": {"type": "string"},
            "y": {"type": "string"}
          },
          "required": ["x", "y"]
        },
        "units": {
          "type": "string",
          "enum": ["celsius", "fahrenheit"]
        }
      },
      "required": ["location", "units"]
    },
    "strict": true
  }]
}
```

#### 网络搜索工具（Web Search）
```json
{
  "model": "gpt-5-nano",
  "input": [{
    "type": "message",
    "role": "user",
    "content": "使用网络搜索分别查询今年的房价和贝壳的股价"
  }],
  "tools": [{
    "type": "web_search_preview"
  }],
  "reasoning": {
    "effort": "medium"
  },
  "store": true,
  "stream": true
}
```

#### 图像生成工具
```json
{
  "model": "gpt-5-nano",
  "input": [{
    "type": "message",
    "role": "user",
    "content": "生成一张夏日午后森林的图片和一张冬天雪后森林的图片"
  }],
  "tools": [{
    "type": "image_generation",
    "model": "doubao-seedream-3-0-t2i"
  }],
  "stream": true
}
```

#### 文件搜索工具
```json
{
  "model": "gpt-5-nano",
  "input": [{
    "type": "message",
    "role": "user",
    "content": "他的技能有哪些？"
  }],
  "tools": [{
    "type": "file_search",
    "vector_store_ids": ["file-2509221659180022489862-1989906366"]
  }],
  "stream": true
}
```

#### 本地Shell工具
```json
{
  "model": "gpt-5-nano",
  "input": "使用local_shell工具，列出当前目录下所有以'test_'开头的txt文件",
  "tools": [{
    "type": "local_shell"
  }],
  "store": false,
  "stream": true
}
```

#### MCP工具（Model Context Protocol）

MCP (Model Context Protocol) 是一个开放协议，允许AI模型通过标准化接口与外部工具和数据源交互。Response API支持动态连接MCP服务器，自动发现和调用服务器提供的工具。

##### 基础MCP配置
```json
{
  "model": "gpt-5-nano",
  "input": [{
    "type": "message",
    "role": "user",
    "content": "使用Context7查询React文档"
  }],
  "tools": [{
    "type": "mcp",
    "server_label": "context7",
    "server_url": "https://mcp.context7.com/mcp",
    "server_description": "Context7 documentation search service"
  }],
  "stream": true
}
```

**核心字段说明**：
- `type`: 固定为 `"mcp"`
- `server_label`: MCP服务器的唯一标识符（必需）
- `server_url`: MCP服务器的HTTP端点URL（与`connector_id`二选一）
- `connector_id`: 预定义的连接器ID（与`server_url`二选一）
- `server_description`: 服务器描述，帮助模型理解服务器用途
- `authorization`: OAuth令牌（可选，格式：`"Bearer token123"`）
- `headers`: 自定义HTTP请求头（可选）

##### 带认证的MCP服务器
```json
{
  "model": "gpt-5-nano",
  "input": "查询私有仓库的代码文档",
  "tools": [{
    "type": "mcp",
    "server_label": "github_private",
    "server_url": "https://api.github.com/mcp",
    "authorization": "Bearer ghp_xxxxxxxxxxxx",
    "headers": {
      "X-GitHub-Api-Version": "2022-11-28"
    },
    "server_description": "GitHub private repository access"
  }]
}
```

##### 工具过滤和访问控制

**允许特定工具**
```json
{
  "tools": [{
    "type": "mcp",
    "server_label": "db_server",
    "server_url": "https://db.example.com/mcp",
    "server_description": "Database query service",
    "allowed_tools": ["query_users", "query_orders"]
  }]
}
```

##### 工具审批机制

**所有工具都需要审批**
```json
{
  "tools": [{
    "type": "mcp",
    "server_label": "admin_tools",
    "server_url": "https://admin.example.com/mcp",
    "require_approval": "always"
  }]
}
```

**特定工具需要审批**
```json
{
  "tools": [{
    "type": "mcp",
    "server_label": "system_tools",
    "server_url": "https://system.example.com/mcp",
    "require_approval": {
      "always": {
        "tool_names": ["delete_file", "restart_service"]
      }
    }
  }]
}
```

**审批请求流式事件**
```json
{
  "type": "mcp_approval_request",
  "id": "mcp_approve_req_123",
  "server_label": "system_tools",
  "name": "delete_file",
  "arguments": "{\"path\": \"/data/temp.txt\"}"
}
```

**审批响应输入**
```json
{
  "input": [{
    "type": "mcp_approval_response",
    "approval_request_id": "mcp_approve_req_123",
    "approve": true,
    "reason": "Temporary file deletion approved"
  }]
}
```

##### MCP工具调用流程

**1. 工具列表获取**

当模型首次访问MCP服务器时，会自动获取可用工具列表：

流式事件：
```json
{
  "type": "mcp_list_tools",
  "event": "in_progress",
  "server_label": "context7"
}
```
```json
{
  "type": "mcp_list_tools",
  "event": "completed",
  "server_label": "context7",
  "tools": [
    {
      "name": "resolve-library-id",
      "description": "Resolve library name to Context7 ID",
      "input_schema": {
        "type": "object",
        "properties": {
          "libraryName": {"type": "string"}
        },
        "required": ["libraryName"]
      }
    },
    {
      "name": "get-library-docs",
      "description": "Fetch library documentation",
      "input_schema": {
        "type": "object",
        "properties": {
          "context7CompatibleLibraryID": {"type": "string"},
          "topic": {"type": "string"},
          "tokens": {"type": "number"}
        },
        "required": ["context7CompatibleLibraryID"]
      }
    }
  ]
}
```

**2. 工具调用执行**

模型自动调用MCP服务器上的工具：

流式事件序列：
```json
{
  "type": "mcp_call",
  "event": "in_progress",
  "id": "call_mcp_001",
  "server_label": "context7",
  "name": "resolve-library-id"
}
```
```json
{
  "type": "mcp_call",
  "event": "arguments_delta",
  "id": "call_mcp_001",
  "delta": "{\"libraryName\": "
}
```
```json
{
  "type": "mcp_call",
  "event": "arguments_done",
  "id": "call_mcp_001",
  "arguments": "{\"libraryName\": \"bella-openapi\"}"
}
```
```json
{
  "type": "mcp_call",
  "event": "completed",
  "id": "call_mcp_001",
  "server_label": "context7",
  "name": "resolve-library-id",
  "arguments": "{\"libraryName\": \"bella-openapi\"}",
  "output": "[{\"id\": \"/ke/bella-openapi\", \"name\": \"bella-openapi\", \"description\": \"...\"}]"
}
```

**3. 对话中引用MCP调用历史**
```json
{
  "model": "gpt-5-nano",
  "input": [
    {
      "type": "message",
      "role": "user",
      "content": "查询React hooks文档"
    },
    {
      "type": "mcp_call",
      "id": "call_001",
      "server_label": "context7",
      "name": "resolve-library-id",
      "arguments": "{\"libraryName\": \"react\"}",
      "output": "[{\"id\": \"/facebook/react\"}]"
    },
    {
      "type": "mcp_call",
      "id": "call_002",
      "server_label": "context7",
      "name": "get-library-docs",
      "arguments": "{\"context7CompatibleLibraryID\": \"/facebook/react\", \"topic\": \"hooks\"}",
      "output": "# React Hooks\n\nHooks are functions that..."
    },
    {
      "type": "message",
      "role": "user",
      "content": "useState和useEffect的区别是什么？"
    }
  ],
  "tools": [{
    "type": "mcp",
    "server_label": "context7",
    "server_url": "https://mcp.context7.com/mcp"
  }]
}
```

##### 实际应用示例

**文档查询助手**
```json
{
  "model": "gpt-5-nano",
  "input": "如何在Next.js中使用服务端组件？",
  "tools": [{
    "type": "mcp",
    "server_label": "context7",
    "server_url": "https://mcp.context7.com/mcp",
    "server_description": "Technical documentation search"
  }],
  "stream": true
}
```

**数据库查询工具**
```json
{
  "model": "gpt-5",
  "input": "查询销售额最高的前10个商品",
  "tools": [{
    "type": "mcp",
    "server_label": "analytics_db",
    "connector_id": "postgres_readonly",
    "server_description": "Analytics database (read-only)",
    "allowed_tools": {
      "read_only": true
    }
  }]
}
```

**文件系统操作（需审批）**
```json
{
  "model": "gpt-5-nano",
  "input": "清理/tmp目录下的过期日志文件",
  "tools": [{
    "type": "mcp",
    "server_label": "filesystem",
    "server_url": "https://fs.internal.com/mcp",
    "authorization": "Bearer internal_token",
    "require_approval": {
      "always": {
        "tool_names": ["delete_file", "delete_directory"]
      }
    }
  }]
}
```

##### MCP最佳实践

1. **服务器标识**：使用清晰的`server_label`，便于在日志和审计中追踪
2. **安全认证**：敏感服务器必须配置`authorization`或`headers`进行身份验证
3. **工具白名单**：使用`allowed_tools`限制模型只能访问必要的工具
4. **审批机制**：对危险操作（删除、修改、执行）启用`require_approval`
5. **错误处理**：MCP调用失败会在流式响应中包含详细错误信息
6. **并行调用**：多个MCP服务器工具可自动并行执行，提升效率
7. **描述准确**：`server_description`应准确描述服务器能力，帮助模型正确选择工具


### 5. 自定义工具（Custom Tools）

#### 文本格式工具
```json
{
  "model": "gpt-5-nano",
  "input": [{
    "type": "message",
    "role": "user",
    "content": "人工智能技术在过去十年中取得了显著进展..."
  }],
  "instructions": "使用text_summarizer对用户信息进行摘要",
  "tools": [{
    "name": "text_summarizer",
    "type": "custom",
    "description": "对输入的长文本进行智能摘要",
    "format": {
      "type": "text"
    }
  }]
}
```

#### 正则表达式格式工具
```json
{
  "model": "gpt-5-nano",
  "input": [{
    "type": "message",
    "role": "user",
    "content": "张三，电话：13800138000，国家：中国，邮箱：zhangsan@ke.com"
  }],
  "instructions": "根据提供的信息，使用contact_info_generator工具生成特定格式的联系方式。",
  "tools": [{
    "name": "contact_info_generator",
    "type": "custom",
    "description": "生成符合特定格式的联系方式信息",
    "format": {
      "type": "grammar",
      "syntax": "regex",
      "definition": "^[A-Za-z\\s]{2,30}\\s*\\|\\s*\\+\\d{1,3}[-\\s]?\\d{3,4}[-\\s]?\\d{3,4}[-\\s]?\\d{3,4}\\s*\\|\\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
    }
  }]
}
```

#### Lark语法格式工具
```json
{
  "model": "gpt-5-nano",
  "input": [{
    "type": "message",
    "role": "user",
    "content": "使用api_response_generator工具，随机生成一个符合要求的示例"
  }],
  "tools": [{
    "name": "api_response_generator",
    "type": "custom",
    "description": "生成符合特定JSON结构的API响应数据",
    "format": {
      "type": "grammar",
      "syntax": "lark",
      "definition": "start: response\n\nresponse: \"{\" \"\\\"status\\\":\" status \",\" \"\\\"code\\\":\" number \",\" \"\\\"data\\\":\" data_object \",\" \"\\\"message\\\":\" string \"}\"\n\nstatus: \"\\\"success\\\"\" | \"\\\"error\\\"\"\n\ndata_object: \"{\" \"\\\"id\\\":\" number \",\" \"\\\"name\\\":\" string \",\" \"\\\"items\\\":\" array \"}\"\n\narray: \"[\" [item (\",\" item)*] \"]\"\n\nitem: \"{\" \"\\\"title\\\":\" string \",\" \"\\\"count\\\":\" number \"}\"\n\nstring: \"\\\"\" /[^\"]*/ \"\\\"\"\n\nnumber: /\\d+/\n\n%import common.WS\n%ignore WS"
    }
  }]
}
```

### 6. 高级特性

#### 推理链（Reasoning）
```json
{
  "model": "gpt-5-nano",
  "input": "复杂推理问题...",
  "reasoning": {
    "effort": "high",
    "summary": "auto"
  }
}
```

#### 响应格式控制
```json
{
  "model": "gpt-5-nano",
  "input": "生成JSON格式的数据",
  "text": {
    "response_format": {
      "type": "json_schema",
      "json_schema": {
        "name": "response",
        "schema": {
          "type": "object",
          "properties": {
            "result": {"type": "string"},
            "confidence": {"type": "number"}
          },
          "required": ["result", "confidence"]
        }
      }
    }
  }
}
```

## 流式响应

启用流式响应后，响应以Server-Sent Events (SSE)格式返回：

```json
{
  "stream": true,
  "background": false
}
```

流式事件类型：
- `message_start`: 响应开始
- `content_block_start`: 内容块开始
- `content_block_delta`: 内容增量
- `content_block_stop`: 内容块结束
- `message_delta`: 消息元数据更新
- `message_stop`: 响应结束

## 存储控制

### 基本配置

```json
{
  "store": false
}
```

- `store: true`: 持久化存储对话（默认）
- `store: false`: 一次性对话，不保存

### Store模式详解

#### 1. Store模式（store: true）

**功能特性**：
- 对话历史会持久化到数据库（Thread和Message表）
- 响应中会返回`conversation`字段，包含thread_id
- 支持使用`previous_response_id`或`conversation`续接对话
- 可以通过`GET /v1/responses/{response_id}`查询历史响应

**适用场景**：
- **多轮对话应用**：需要保持对话上下文的聊天机器人
- **会话管理**：需要查看和管理历史对话记录
- **长期交互**：用户可能在不同时间段继续同一话题
- **合规审计**：需要保留完整的对话记录用于审计
- **对话分析**：需要分析用户对话模式和行为

**存储内容**：
- Thread（对话线程）
- Message（用户和助手的所有消息）
- Run（执行记录）
- RunStep（工具调用等详细步骤）

**示例**：
```json
{
  "model": "gpt-5-nano",
  "input": "北京天气怎么样？",
  "store": true
}
```

**响应包含conversation**：
```json
{
  "id": "resp_xxx",
  "conversation": "thread_abc123",
  "output": []
}
```

#### 2. 非Store模式（store: false）

**功能特性**：
- 对话不会持久化到数据库
- 响应中不会包含`conversation`字段
- 不支持使用`previous_response_id`或`conversation`续接（会抛出异常）
- 执行完成后不保留任何对话记录
- 无法通过`GET /v1/responses/{response_id}`查询（response_id映射会存储，但message不存储）

**适用场景**：
- **单次查询**：一次性问答，不需要上下文
- **隐私敏感**：用户不希望对话被记录
- **高并发场景**：减少数据库写入压力，提升性能
- **临时任务**：文本翻译、格式转换等无需保存的任务
- **成本优化**：减少存储成本，避免冗余数据

**限制条件**：
```java
// 代码限制：非store模式不能使用previous_response_id或conversation
if(Boolean.FALSE == request.getStore() &&
   (request.getPreviousResponseId() != null || request.getConversation() != null)) {
    throw new BizParamCheckException(
        "store can not be set `false` when you request with previous_response_id or conversation"
    );
}
```

**示例**：
```json
{
  "model": "gpt-5-nano",
  "input": "翻译成英文：你好世界",
  "store": false
}
```

**响应不包含conversation**：
```json
{
  "id": "resp_xxx",
  "output": [{
    "type": "message",
    "role": "assistant",
    "content": "Hello World"
  }]
}
```

### Store模式对比

| 特性 | Store模式（true） | 非Store模式（false） |
|-----|------------------|-------------------|
| **数据持久化** | ✅ 完整保存到数据库 | ❌ 不保存对话记录 |
| **返回conversation** | ✅ 包含thread_id | ❌ 不返回 |
| **续接对话** | ✅ 支持previous_response_id和conversation | ❌ 不支持，会报错 |
| **历史查询** | ✅ 可通过API查询 | ⚠️ 仅保存response_id映射 |
| **性能** | 较低（需要数据库写入） | 高（无数据库写入） |
| **存储成本** | 高（保存所有消息） | 低（仅保存映射） |
| **隐私保护** | 一般 | 优秀 |
| **适用场景** | 多轮对话、会话管理 | 单次查询、隐私敏感 |

### 使用建议

1. **默认使用Store模式**：如果只是想想使用response-api丰富的内置工具，用于chat-completion接口的迁移，可以使用`store: false`，性能更优。

2. **客户端管理对话**：如果你在客户端（前端/移动端）自己管理对话历史，可以使用`store: false`：
   ```json
   {
     "model": "gpt-5-nano",
     "input": [
       {"role": "user", "content": "第一个问题"},
       {"role": "assistant", "content": "第一个回答"},
       {"role": "user", "content": "第二个问题"}
     ],
     "store": false
   }
   ```

3. **混合使用**：对于同一应用，可以根据场景灵活选择：
    - 主要对话流程：`store: true`
    - 快速查询、辅助功能：`store: false`

4. **注意previous_response_id限制**： 
❌ 常见错误：非store模式不能续接:
```json
   {
     "model": "gpt-5-nano",
     "input": "继续上面的话题",
     "previous_response_id": "resp_xxx",
     "store": false
   }
```

### 技术细节

在内部实现中：
- **Store模式**：`run.saveMessage = true`，消息会通过MessageService保存到数据库
- **非Store模式**：`run.saveMessage = false`，消息仅在执行期间存在于内存

## 错误处理

API使用标准HTTP状态码：
- `200 OK`: 成功
- `400 Bad Request`: 请求格式错误
- `401 Unauthorized`: 认证失败
- `429 Too Many Requests`: 速率限制
- `500 Internal Server Error`: 服务器错误

错误响应格式：
```json
{
  "error": {
    "message": "错误描述",
    "type": "error_type",
    "code": "error_code"
  }
}
```

## 最佳实践

1. **选择合适的模型**: 根据任务复杂度选择模型
2. **使用流式响应**: 提升用户体验，特别是长响应
3. **合理设置推理级别**: 简单任务用low，复杂推理用high
4. **工具并行调用**: 提高效率，减少延迟
5. **轻量级使用**: 如在client端实现对话管理，则使用`store: false`避免数据存储
6. **续接对话**: 使用`previous_response_id`保持上下文

## 示例场景

### 智能客服
```json
{
  "model": "gpt-5",
  "input": "查询我的订单状态",
  "tools": [{
    "type": "function",
    "name": "query_order",
    "description": "查询订单状态"
  }],
  "store": true,
  "stream": true
}
```

### 代码生成助手
```json
{
  "model": "gpt-5-nano",
  "input": "生成一个Python快速排序算法",
  "reasoning": {
    "effort": "medium"
  },
  "text": {
    "response_format": {
      "type": "code"
    }
  }
}
```

### 多模态分析
```json
{
  "model": "gpt-5",
  "input": [{
    "role": "user",
    "content": [
      {
        "type": "input_image",
        "image_url": "https://example.com/chart.png"
      },
      {
        "type": "input_text",
        "text": "分析这个图表的趋势"
      }
    ]
  }],
  "reasoning": {
    "effort": "high"
  }
}
```

## API vs Assistant API对比

| 特性 | Response API | Assistant API |
|-----|-------------|---------------|
| 使用场景 | 轻量对话、无状态交互 | 复杂智能体、有状态工作流 |
| 会话管理 | 灵活（可选持久化） | 强制Thread管理 |
| 配置方式 | 每次请求配置 | 预定义Assistant |
| 工具使用 | 即时定义 | 预配置+运行时覆盖 |
| 学习曲线 | 简单直接 | 需要理解Thread概念 |
| 性能 | 更轻量 | 额外管理开销 |
