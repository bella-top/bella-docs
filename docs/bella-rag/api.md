# RAG API接口协议

本文档详细介绍Bella-RAG系统的API接口规范，包括知识检索、检索增强生成等核心功能的接口协议。

## 🔗 API基础信息

### 接口地址
- **云端版本**: `https://rag.bella.top` 

### 认证方式
所有API接口都需要在请求头中提供认证信息：

```
Authorization: Bearer {OPEN_API_KEY}
```

### 通用请求头
```
Content-Type: application/json
Authorization: Bearer {OPEN_API_KEY}
X-BELLA-TRACE-ID: {链路追踪ID} (可选)
```

## 📄 文档索引接口

### 文档上传索引

**接口地址**: `POST /api/file/stream/indexing`

**请求头部**:
```
Content-Type: multipart/form-data
Authorization: Bearer {OPEN_API_KEY}
```

**请求参数**:
| 参数名称 | 类型 | 必需 | 描述 |
|---------|------|------|------|
| file_id | string | 是 | 文件唯一标识 |
| file_name | string | 是 | 文件名称 |
| user | string | 是 | 用户标识 |
| file | file | 是 | 上传的文件 |

**请求示例**:
```bash
curl --location 'http://localhost:8008/api/file/stream/indexing' \
  --header 'Authorization: Bearer {OPEN_API_KEY}' \
  --header 'Content-Type: multipart/form-data' \
  --form 'file_id="FILE_ID"' \
  --form 'file_name="document.pdf"' \
  --form 'user="user_001"' \
  --form 'file=@"/path/to/document.pdf"'
```

## 🔍 知识检索接口

### 基础检索

**接口地址**: `POST /api/rag/search`

**请求参数**:
| 参数名称 | 类型 | 必需 | 默认值 | 描述 |
|---------|------|------|-------|------|
| query | string | 是 | - | 检索查询 |
| scope | array | 是 | - | 检索范围 |
| scope.type | string | 是 | file | 范围类型：file、directory、space |
| scope.ids | array | 是 | - | 文件ID列表 |
| limit | integer | 否 | 3 | 检索数量限制 |
| user | string | 是 | - | 用户标识 |
| mode | string | 否 | normal | 检索模式 |

**检索模式说明**:
| 模式 | 描述 | 策略配置 |
|------|------|----------|
| fast | 轻量搜索：追求速度，精度要求不高 | 语义检索，无重排器，最大补全策略 |
| normal | 精准搜索：平衡速度和质量 | 语义检索，有重排器，最大补全策略 |
| ultra | 全能搜索：高精度需求，支持图片理解 | 混合检索（向量+关键词），有重排器，上下文补全策略 |

**请求示例**:
```json
{
    "query": "机器学习的主要算法有哪些？",
    "scope": [{
        "type": "file",
        "ids": ["file_123", "file_456"]
    }],
    "limit": 5,
    "user": "user_00000000",
    "mode": "normal"
}
```

**响应数据**:
| 字段名称 | 类型 | 描述 |
|---------|------|------|
| code | number | 响应状态码 |
| message | string | 响应消息 |
| data.total | number | 结果总数 |
| data.docs | array | 检索结果列表 |
| data.docs[].type | string | 内容类型（默认text） |
| data.docs[].text | string | 检索到的文本内容 |
| data.docs[].score | number | 相关度得分 |
| data.docs[].annotation | object | 文件元信息 |

**响应示例**:
```json
{
  "code": 0,
  "message": "Success",
  "data": {
    "total": 10,
    "docs": [
      {
        "type": "text",
        "text": "召回文本内容...",
        "score": 0.92,
        "annotation": {
          "file_id": "12345",
          "file_name": "example_document.txt",
          "paths": [[1, 12, 1], [1, 12, 2]]
        }
      }
    ]
  }
}
```

## 💬 检索增强生成接口

### RAG问答

**接口地址**: `POST /api/rag/chat`

**请求参数**:
| 参数名称 | 类型 | 必需 | 默认值 | 描述 |
|---------|------|------|-------|------|
| query | string | 是 | - | 用户问题 |
| scope | array | 是 | - | 检索范围 |
| user | string | 是 | - | 用户标识 |
| response_type | string | 否 | blocking | 响应类型：blocking、stream |
| timeout | number | 否 | - | 超时时间（秒） |
| model | string | 否 | - | 生成模型 |
| mode | string | 否 | normal | 检索模式 |

**检索模式扩展**:
| 模式 | 描述 | 特点 |
|------|------|------|
| fast | 轻量搜索 | 速度优先，资源消耗少 |
| normal | 精准搜索 | 平衡效果与性能 |
| ultra | 全能搜索 | 高精度，支持多模态 |
| deep | 智能Agent搜索 | Deep RAG模式，支持复杂推理 |

**请求示例**:
```json
{
    "query": "机器学习的主要算法有哪些？",
    "scope": [{
        "type": "file",
        "ids": ["file_123", "file_456"]
    }],
    "user": "user_00000000",
    "response_type": "stream",
    "model": "gpt-4o",
    "mode": "deep"
}
```

## 📡 流式响应协议

### 响应类型

流式响应使用Server-Sent Events (SSE)格式，支持以下事件类型：

#### 1. retrieval.completed - 检索完成
```json
{
    "id": "session_id",
    "object": "retrieval.doc",
    "doc": [
        {
            "type": "text",
            "text": "检索到的文档内容...",
            "annotation": {
                "file_id": "file-123",
                "file_name": "document.pdf",
                "paths": [1, 2, 3]
            },
            "score": 0.85
        }
    ]
}
```

#### 2. message.delta - 消息增量
```json
{
    "id": "session_id",
    "object": "message.delta",
    "delta": {
        "content": [
            {
                "type": "text",
                "text": [
                    {
                        "value": "增量生成的文本内容",
                        "annotations": []
                    }
                ]
            }
        ]
    }
}
```

#### 3. error - 错误事件
```json
{
    "id": "session_id",
    "object": "error",
    "error": {
        "code": "unauthorized",
        "type": "unauthorized", 
        "message": "ak is invalid"
    }
}
```

#### 4. message.sensitives - 敏感词检测
```json
{
    "id": "session_id",
    "object": "message.sensitives",
    "sensitives": [
        {
            "count": 1,
            "detail": [
                {
                    "offset": 60,
                    "length": "11",
                    "word": "敏感词",
                    "secTag": "aigc_phone",
                    "templateId": "aigc"
                }
            ],
            "type": "dataSec"
        }
    ]
}
```

## 🤖 Deep RAG模式专有事件

### Deep模式流式事件

#### 1. plan.create - 计划创建
```json
{
    "id": "session_id",
    "object": "plan.create",
    "plan": [
        {
            "order": 1,
            "description": "使用file_search工具查询相关文件",
            "dependencies": []
        }
    ],
    "reasoning_content": "规划推理过程"
}
```

#### 2. plan.step.start - 步骤开始
```json
{
    "id": "session_id",
    "object": "plan.step.start",
    "step": {
        "order": 1,
        "actions": [
            {
                "name": "file_search",
                "params": {"question": "用户问题", "page": 1}
            }
        ]
    }
}
```

#### 3. plan.step.complete - 步骤完成
```json
{
    "id": "session_id",
    "object": "plan.step.complete",
    "step": {
        "step_order": 1,
        "actions": [],
        "status": "success",
        "step_result": "执行结果"
    }
}
```

#### 4. plan.update - 计划更新
```json
{
    "id": "session_id",
    "object": "plan.update",
    "plan": [
        {
            "order": 1,
            "description": "更新后的任务描述",
            "status": 1,
            "dependencies": []
        }
    ]
}
```

#### 5. plan.complete - 计划完成
```json
{
    "id": "session_id",
    "object": "plan.complete",
    "plan": [
        {
            "description": "已完成的任务",
            "status": 1,
            "order": 1,
            "result": "执行结果"
        }
    ]
}
```

#### 6. heartbeat - 心跳包
```json
{
    "id": "session_id",
    "object": "heartbeat"
}
```

**心跳包说明**:
- 每10秒自动发送一次
- 防止长时间计算导致连接超时
- 客户端可以忽略或用于连接监控

## 📝 非流式响应格式

### 普通模式响应
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "content": [
            {
                "type": "text",
                "text": [
                    {
                        "value": "回答内容",
                        "annotations": [
                            {
                                "type": "file_citation",
                                "file_citation": {
                                    "paths": [1, 2, 3],
                                    "file_id": "file-123",
                                    "file_name": "example.docx"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
```

### Deep模式响应
```json
{
    "content": [
        {
            "type": "text", 
            "text": [
                {
                    "value": "基于规划执行的回答内容",
                    "annotations": []
                }
            ]
        }
    ],
    "plan": {
        "steps": [
            {
                "description": "执行的步骤描述",
                "status": 1,
                "order": 1,
                "result": "步骤执行结果"
            }
        ]
    }
}
```

## ⚠️ 错误码说明

| 错误码 | 类型 | 描述 | 解决方案 |
|-------|------|------|----------|
| 401 | unauthorized | API密钥无效 | 检查Authorization头部 |
| 400 | bad_request | 请求参数错误 | 验证请求参数格式 |
| 404 | not_found | 文件不存在 | 确认文件ID正确 |
| 500 | internal_error | 服务器内部错误 | 联系技术支持 |
| 429 | rate_limit | 请求频率超限 | 降低请求频率 |

## 🔧 集成示例

### Python示例
```python
import requests
import json

# 基础检索
def search_knowledge(query, file_ids):
    url = "http://localhost:8008/api/rag/search"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    data = {
        "query": query,
        "scope": [{"type": "file", "ids": file_ids}],
        "user": "user_001",
        "mode": "ultra"
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# 流式问答
def chat_stream(query, file_ids):
    url = "http://localhost:8008/api/rag/chat"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    data = {
        "query": query,
        "scope": [{"type": "file", "ids": file_ids}],
        "user": "user_001",
        "response_type": "stream",
        "mode": "deep"
    }
    
    response = requests.post(url, headers=headers, json=data, stream=True)
    for line in response.iter_lines():
        if line:
            event_data = line.decode('utf-8')
            if event_data.startswith('data: '):
                try:
                    data = json.loads(event_data[6:])
                    print(f"Event: {data.get('object')}")
                    yield data
                except json.JSONDecodeError:
                    continue
```

### JavaScript示例
```javascript
// 基础检索
async function searchKnowledge(query, fileIds) {
    const response = await fetch('http://localhost:8008/api/rag/search', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            scope: [{ type: 'file', ids: fileIds }],
            user: 'user_001',
            mode: 'ultra'
        })
    });
    
    return await response.json();
}

// 流式问答
async function chatStream(query, fileIds) {
    const response = await fetch('http://localhost:8008/api/rag/chat', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_API_KEY', 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            scope: [{ type: 'file', ids: fileIds }],
            user: 'user_001',
            response_type: 'stream',
            mode: 'deep'
        })
    });
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const data = JSON.parse(line.slice(6));
                    console.log('Event:', data.object);
                    // 处理不同类型的事件
                } catch (e) {
                    // 忽略解析错误
                }
            }
        }
    }
}
```

## 🔗 相关文档

- [使用指南](./usage.md) - 快速开始和基本使用
- [Deep RAG介绍](./deep-rag.md) - 了解Deep RAG智能模式  
- [项目主页](./intro.md) - 返回项目概览

---
