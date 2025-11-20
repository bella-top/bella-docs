# 创建批处理任务

**POST** `http(s)://{{Host}}/v1/batches`

## 示例

**请求**

```bash
curl -X POST "https://${Host}/v1/batches" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${apikey}" \
  -H "X-BELLA-QUEUE-NAME: test-queue" \
  -d '{
    "input_file_id": "file-XXXXXXXXXXXXXXXXXXXXXXX-XXXXXXXXXX",
    "endpoint": "/v1/chat/completions", 
    "completion_window": "24h",
    "metadata": {
      "description": "Customer support chat completions batch"
    }
  }'
```

**响应**

```json
{
  "id": "BATCH-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
  "object": "batch",
  "endpoint": "/v1/chat/completions",
  "input_file_id": "file-XXXXXXXXXXXXXXXXXXXXXXX-XXXXXXXXXX",
  "completion_window": "24h",
  "created_at": 1762921219017,
  "expired_at": 1763007619015,
  "request_counts": {
    "total": 0,
    "completed": 0,
    "failed": 0
  }
}
```

## Request Headers

| 参数                   | 类型     | 必需       | 说明          |
|----------------------|--------|----------|-------------|
| `X-BELLA-QUEUE-NAME` | string | Optional | 指定处理批次的队列名称 |

## Request Body Parameters

| 参数                  | 类型     | 必需       | 说明                                                                                   |
|---------------------|--------|----------|--------------------------------------------------------------------------------------|
| `input_file_id`     | string | Required | 输入文件ID，包含批处理请求，使用File API上传，参考[文件上传文档](../../../bella-knowledge/api/files/upload.md) |
| `endpoint`          | string | Required | 处理任务的能力点                                                                             |
| `completion_window` | string | Required | 完成窗口，格式：数字+单位(m/h/d)，默认"24h"                                                         |
| `metadata`          | object | Optional | 批处理元数据，自定义键值对                                                                        |

## Completion Window (完成窗口)

支持的时间单位格式：

| 单位  | 说明 | 示例          |
|-----|----|-------------|
| `m` | 分钟 | `30m`(30分钟) |
| `h` | 小时 | `24h`(24小时) |
| `d` | 天  | `7d`(7天)    |

**默认值**: `24h`(24小时)

**格式**: 数字 + 单位，如 `30m`、`2h`、`1d`

**说明**: 指定批处理任务的最长完成时间窗口。如果提供的值格式不正确，系统会自动使用默认值24h。

## Returns

返回批处理对象，包含批次的完整信息和状态。

```json
{
  "id": "batchId",
  "object": "batch",
  "endpoint": "能力点",
  "input_file_id": "输入文件ID",
  "completion_window": "指定的完成时间",
  "created_at": "创建时间",
  "expired_at": "修改时间",
  "request_counts": {
    "total": "总任务数",
    "completed": "完成任务数",
    "failed": "失败任务数"
  }
}
```

## Batch任务生命周期

| 状态          | 描述                         |
|-------------|----------------------------|
| validating  | 批处理作业已创建，系统正在验证输入文件的格式和内容。 |
| in_progress | 输入文件验证通过，系统正在处理批处理中的请求。    |
| finalizing  | 所有请求已处理完毕，系统正在整理和准备输出文件。   |
| completed   | 批处理作业已成功完成，所有结果已准备就绪，可以下载。 |
| failed      | 批处理作业在处理过程中遇到错误，未能成功完成。    |
| cancelled   | 批处理作业已被用户取消。               |
| expired     | 批处理作业未能在时间窗口的时限内完成，已超时。    |

### 作业过期 (expired)

作业过期是批处理 API 的一个内置保护机制，旨在防止作业无限期地运行。每个批处理作业都有一个指定时间的完成窗口。

**重要提示**： 当作业过期时，所有尚未完成的请求将被取消，但已经完成的请求的结果仍然会被保存。用户只需要为那些已经成功完成的请求支付费用。

### 作业失败 (failed)

作业失败通常表示在处理过程中遇到了一个无法恢复的错误，导致作业无法继续进行。常见原因包括：

- 输入文件格式错误
- 请求参数无效
- 权限问题
- 系统内部错误

## 输入/输出文件格式

### 输入文件

**文件格式**: JSONL (JSON Lines)

输入文件是 Batch API 工作的基础，它包含了所有需要处理的 API 请求。为了确保批处理任务能够成功创建和执行，输入文件必须严格遵守规定的格式和要求。

**格式要求**: 每一行都是一个独立的、有效的 JSON 对象

**示例**:

```jsonl
{"custom_id": "request-1", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "deepseek-r1-20250401", "messages": [{"role": "user", "content": "What is the capital of France?"}]}}
{"custom_id": "request-2", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "deepseek-r1-20250401", "messages": [{"role": "user", "content": "Translate 'Hello' to Spanish."}]}}
```

**字段说明**:

- `custom_id`: 业务ID，用于关联输出结果
- `method`: HTTP方法，通常为"POST"
- `url`: API端点路径
- `body`: 请求体，包含具体的API参数，参考[openapi使用文档](../../../bella-openapi/core/chat-completions.md)

**重要限制**:

- 一个批处理任务中的所有请求都必须指向同一个端点和同一个模型，不能混合使用不同模型

### 输出文件

**文件格式**: JSONL (JSON Lines)

**示例**:

```jsonl
{"response":{"status_code":200,"request_id":"TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX","body":{"id":"chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","object":"chat.completion","created":1762912790,"model":"deepseek-r1-20250401","choices":[{"index":0,"message":{"role":"assistant","content":"xxx","tool_calls":[],"reasoning_content":"xxx"},"finish_reason":"stop"}],"usage":{"prompt_tokens":6295,"total_tokens":7524,"completion_tokens":1229}}},"custom_id":"XXXXXXXXXXXXXXXX_XXXXXX","id":"TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX"}
```

**字段说明**:

- `id`: 批次请求ID
- `custom_id`: 对应输入文件中的custom_id
- `response`: API响应结果

**注意事项**: 输出行的顺序可能与输入行的顺序不一致。不要依赖顺序来处理结果，而应使用输出文件中每一行都包含的 `custom_id`
字段，以便将输入中的请求与输出中的结果进行映射。

### 错误文件

**文件格式**: JSONL (JSON Lines)

**示例**:

```jsonl
{"id":"","error":{"code":"parse_error","message":"Failed to parse request data."},"customId":"0"}
```

**字段说明**:

- `id`: 批次请求ID
- `custom_id`: 对应输入文件中的custom_id
- `error`: 详细错误信息

### 文件下载与处理

通过查询任务接口输出的 `output_file_id` 和 `error_file_id`，分别到File
API上下载输出文件和错误文件。参考[File API使用文档](../../../bella-knowledge/api/files/content.md)。
