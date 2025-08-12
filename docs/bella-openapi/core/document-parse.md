# 文档解析接口用户手册

## 接口概述

`/v1/document/parse` 接口用于解析各种格式的文档，将文档内容转换为结构化的数据格式。该接口支持同步和异步两种处理模式，能够解析文档中的文本、图片、表格、标题等各种元素，并保持文档的层级结构。
当前只支持 `doc` 文档。

## 核心特性

- **多格式支持**：支持 PDF、Word、Excel、PowerPoint 等多种文档格式（暂时只支持 `doc` 文档）
- **结构化解析**：保持文档的层级结构和元素关系
- **智能识别**：自动识别标题、段落、表格、图片等元素类型
- **异步处理**：支持异步模式处理大文档，提供回调通知
- **同步模式**：支持阻塞模式，直接返回解析结果

## 请求参数

### HTTP 方法
```
POST /v1/document/parse
```

### 请求头
```
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

### 请求体参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|----|------|
| `file` | SourceFile | 是  | 文档文件信息 |
| `user` | string | 否  | 用户标识 |
| `model` | string | 是  | 解析模型名称 |
| `type` | string | 否  | 处理类型：`task`（异步，默认）或 `blocking`（同步） |
| `callbackUrl` | string | 否  | 异步模式下的回调地址 |
| `maxTimeoutMillis` | integer | 否  | 同步模式下的最大等待时间（毫秒，最小30000） |

#### SourceFile 对象

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `id` | string | 是 | 文件ID（通过文件上传接口获得） |
| `name` | string | 是 | 文件名 |
| `type` | string | 否 | 文件类型（如：pdf、docx） |
| `mime_type` | string | 否 | MIME类型（如：application/pdf） |

### 请求示例

#### 异步模式请求
```json
{
  "file": {
    "id": "file_abc123",
    "name": "document.pdf",
    "type": "pdf",
    "mime_type": "application/pdf"
  },
  "user": "user123",
  "type": "task",
  "callbackUrl": "https://your-domain.com/callback"
}
```

#### 同步模式请求
```json
{
  "file": {
    "id": "file_abc123",
    "name": "document.pdf",
    "type": "pdf",
    "mime_type": "application/pdf"
  },
  "user": "user123",
  "type": "blocking",
  "maxTimeoutMillis": 60000
}
```

## 响应格式

### 异步模式响应

#### 任务创建成功
```json
{
  "taskId": "channel_task123"
}
```

#### 回调通知格式
当文档解析完成后，系统会向指定的 `callbackUrl` 发送 POST 请求：

```json
{
  "result": {
    "source_file": {
      "id": "file_abc123",
      "name": "document.pdf",
      "type": "pdf",
      "mime_type": "application/pdf"
    },
    "summary": "文档摘要信息",
    "tokens": 1500,
    "path": [1],
    "element": {
      "type": "Title",
      "positions": [
        {
          "bbox": [90.1, 263.8, 101.8, 274.3],
          "page": 1
        }
      ],
      "text": "文档标题"
    },
    "children": [
      {
        "path": [1, 1],
        "element": {
          "type": "Text",
          "text": "段落内容..."
        },
        "children": []
      }
    ]
  },
  "status": "success",
  "message": "解析完成"
}
```

### 同步模式响应

同步模式直接返回解析结果，格式与回调通知中的内容相同。

## 数据结构详解

### DocParseResult 主要字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `source_file` | SourceFile | 源文件信息 |
| `summary` | string | 文档摘要 |
| `tokens` | integer | 预估token数量 |
| `path` | integer[] | 节点路径，如 [1,2,1] 表示第1章第2节第1段 |
| `element` | Element | 元素详细信息 |
| `children` | DocParseResult[] | 子节点列表 |

### Element 元素类型

| 类型 | 描述 | 特有字段 |
|------|------|----------|
| `Text` | 普通文本 | `text` |
| `Title` | 标题 | `text` |
| `List` | 列表 | `text` |
| `ListItem` | 列表项 | `text` |
| `Table` | 表格 | `name`, `description`, `rows` |
| `Figure` | 图片/图表 | `name`, `description`, `image` |
| `Formula` | 公式 | `text` |
| `Code` | 代码块 | `text` |
| `Catalog` | 目录 | `text` |

### 表格结构

表格元素包含 `rows` 字段，每行包含多个单元格：

```json
{
  "type": "Table",
  "name": "销售数据表",
  "description": "2023年销售统计",
  "rows": [
    {
      "cells": [
        {
          "path": [1, 1, 1, 1],
          "text": "产品名称"
        },
        {
          "path": [1, 1, 1, 2],
          "text": "销售额"
        }
      ]
    }
  ]
}
```

### 图片结构

图片元素的 `image` 字段支持三种格式：

```json
{
  "type": "Figure",
  "image": {
    "type": "image_url",
    "url": "https://example.com/image.jpg"
  }
}
```

```json
{
  "type": "Figure",
  "image": {
    "type": "image_base64",
    "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
  }
}
```

```json
{
  "type": "Figure",
  "image": {
    "type": "image_file",
    "file_id": "img_file123"
  }
}
```

## 错误处理

### 常见错误码

| 状态码 | 错误类型 | 描述 | 解决方案 |
|--------|----------|------|----------|
| 400 | 参数错误 | 请求参数不正确 | 检查请求参数格式和必填字段 |
| 401 | 认证失败 | API密钥无效 | 检查Authorization头中的API密钥 |
| 404 | 文件不存在 | 指定的文件ID不存在 | 确认文件已正确上传并获得有效ID |
| 408 | 请求超时 | 同步模式下处理超时 | 增加maxTimeoutMillis或使用异步模式 |
| 413 | 文件过大 | 文件大小超出限制 | 压缩文件或分段处理 |
| 415 | 格式不支持 | 文件格式不受支持 | 转换为支持的格式后重试 |
| 429 | 请求过频 | 超出API调用频率限制 | 降低请求频率或升级配额 |
| 500 | 服务器错误 | 内部处理错误 | 稍后重试或联系技术支持 |

### 错误响应格式

```json
{
  "error": {
    "code": 400,
    "message": "Invalid file format",
    "details": "Only PDF, DOCX, XLSX, PPTX formats are supported"
  }
}
```

## 使用示例

### Python 示例

```python
import requests
import json
import time

# 异步模式示例
def parse_document_async():
    url = "https://api.bella-openapi.com/v1/document/parse"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    
    data = {
        "file": {
            "id": "file_abc123",
            "name": "document.pdf",
            "type": "pdf",
            "mime_type": "application/pdf"
        },
        "user": "user123",
        "type": "task",
        "callbackUrl": "https://your-domain.com/callback"
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"任务ID: {result['taskId']}")
        return result['taskId']
    else:
        print(f"错误: {response.status_code} - {response.text}")
        return None

# 同步模式示例
def parse_document_sync():
    url = "https://api.bella-openapi.com/v1/document/parse"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    
    data = {
        "file": {
            "id": "file_abc123",
            "name": "document.pdf",
            "type": "pdf",
            "mime_type": "application/pdf"
        },
        "user": "user123",
        "type": "blocking",
        "maxTimeoutMillis": 60000
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        result = response.json()
        print("解析完成!")
        return result
    else:
        print(f"错误: {response.status_code} - {response.text}")
        return None

# 使用示例
if __name__ == "__main__":
    # 异步模式
    task_id = parse_document_async()
    
    # 同步模式
    result = parse_document_sync()
    if result:
        print(f"文档摘要: {result['result']['summary']}")
        print(f"预估tokens: {result['result']['tokens']}")
```

### JavaScript 示例

```javascript
// 异步模式
async function parseDocumentAsync() {
    const response = await fetch('https://api.bella-openapi.com/v1/document/parse', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            file: {
                id: 'file_abc123',
                name: 'document.pdf',
                type: 'pdf',
                mime_type: 'application/pdf'
            },
            user: 'user123',
            type: 'task',
            callbackUrl: 'https://your-domain.com/callback'
        })
    });
    
    if (response.ok) {
        const result = await response.json();
        console.log('任务ID:', result.taskId);
        return result.taskId;
    } else {
        console.error('错误:', response.status, await response.text());
        return null;
    }
}

// 同步模式
async function parseDocumentSync() {
    const response = await fetch('https://api.bella-openapi.com/v1/document/parse', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            file: {
                id: 'file_abc123',
                name: 'document.pdf',
                type: 'pdf',
                mime_type: 'application/pdf'
            },
            user: 'user123',
            type: 'blocking',
            maxTimeoutMillis: 60000
        })
    });
    
    if (response.ok) {
        const result = await response.json();
        console.log('解析完成!');
        return result;
    } else {
        console.error('错误:', response.status, await response.text());
        return null;
    }
}
```

### cURL 示例

```bash
# 异步模式
curl -X POST "https://api.bella-openapi.com/v1/document/parse" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "file": {
      "id": "file_abc123",
      "name": "document.pdf",
      "type": "pdf",
      "mime_type": "application/pdf"
    },
    "user": "user123",
    "type": "task",
    "callbackUrl": "https://your-domain.com/callback"
  }'

# 同步模式
curl -X POST "https://api.bella-openapi.com/v1/document/parse" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "file": {
      "id": "file_abc123",
      "name": "document.pdf",
      "type": "pdf",
      "mime_type": "application/pdf"
    },
    "user": "user123",
    "type": "blocking",
    "maxTimeoutMillis": 60000
  }'
```

## 最佳实践

### 1. 选择合适的处理模式

- **异步模式**：推荐用于大文件或批量处理场景
- **同步模式**：适用于小文件或需要立即获得结果的场景

### 2. 文件预处理

- 确保文件格式正确且未损坏
- 对于扫描版PDF，建议先进行OCR处理
- 压缩过大的文件以提高处理速度

### 3. 错误处理策略

```python
import time
import random

def parse_with_retry(file_info, max_retries=3):
    """带重试机制的文档解析"""
    for attempt in range(max_retries):
        try:
            response = requests.post(url, headers=headers, json=data)
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 429:
                # 请求过频，指数退避
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                time.sleep(wait_time)
                continue
            elif response.status_code >= 500:
                # 服务器错误，重试
                time.sleep(2 ** attempt)
                continue
            else:
                # 客户端错误，不重试
                raise Exception(f"Client error: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            if attempt == max_retries - 1:
                raise e
            time.sleep(2 ** attempt)
    
    raise Exception("Max retries exceeded")
```

### 4. 回调处理

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/callback', methods=['POST'])
def handle_callback():
    """处理文档解析完成回调"""
    try:
        data = request.json
        
        if data['status'] == 'success':
            result = data['result']
            # 处理解析结果
            process_parse_result(result)
            return jsonify({"status": "received"}), 200
        else:
            # 处理解析失败
            print(f"解析失败: {data['message']}")
            return jsonify({"status": "error"}), 400
            
    except Exception as e:
        print(f"回调处理错误: {str(e)}")
        return jsonify({"status": "error"}), 500

def process_parse_result(result):
    """处理解析结果的业务逻辑"""
    print(f"文档摘要: {result.get('summary', '')}")
    print(f"预估tokens: {result.get('tokens', 0)}")
    
    # 递归处理文档结构
    def process_node(node, level=0):
        indent = "  " * level
        element = node.get('element', {})
        element_type = element.get('type', 'Unknown')
        text = element.get('text', '')
        
        print(f"{indent}{element_type}: {text[:50]}...")
        
        # 处理子节点
        for child in node.get('children', []):
            process_node(child, level + 1)
    
    process_node(result)
```

### 5. 性能优化

- **并发控制**：避免同时发起过多请求
- **缓存结果**：对相同文件的解析结果进行缓存
- **分批处理**：大批量文件分批次处理

### 6. 安全建议

- 妥善保管API密钥，不要在客户端代码中暴露
- 使用HTTPS确保传输安全
- 定期轮换API密钥
- 对回调URL进行签名验证

## 常见问题

### Q1: 支持哪些文档格式？
A: 目前支持PDF、Word（.docx）、Excel（.xlsx）、PowerPoint（.pptx）等主流格式。具体支持的格式可能因渠道而异。

### Q2: 文件大小有限制吗？
A: 是的，通常单个文件不超过20MB。超大文件建议分段处理。

### Q3: 解析需要多长时间？
A: 处理时间取决于文件大小和复杂度，通常1-10分钟。简单文档可能只需几秒钟。

### Q4: 如何处理表格中的合并单元格？
A: 系统会自动识别合并单元格，在单元格的 `path` 字段中使用坐标范围表示，如 `[1, 2, 1, 3]` 表示从第1行第1列到第2行第3列的合并区域。

### Q5: 图片内容会被OCR识别吗？
A: 是的，图片中的文字会通过OCR技术自动识别并包含在 `text` 字段中。

### Q6: 异步模式下如何知道任务完成？
A: 有两种方式：1) 提供 `callbackUrl` 接收主动通知；2) 定期调用任务查询接口检查状态。

### Q7: 回调失败了怎么办？
A: 系统会自动重试回调，如果多次失败，建议检查回调URL的可达性和响应格式。
