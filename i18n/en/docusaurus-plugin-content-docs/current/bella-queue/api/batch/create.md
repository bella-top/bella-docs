# Create Batch Task

**POST** `http(s)://{{Host}}/v1/batches`

## Example

**Request**

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

**Response**

```json
{
  "id": "BATCH-X-X-XXXXXXXXXXXX-XXXX-XXXXXX",
  "object": "batch",
  "endpoint": "/v1/chat/completions",
  "input_file_id": "file-XXXXXXXXXXXXXXXXXXXXXXX-XXXXXXXXXX",
  "completion_window": "24h",
  "created_at": 1762867031064,
  "expired_at": 1762953431064,
  "request_counts": {
    "total": 0,
    "completed": 0,
    "failed": 0
  }
}
```

## Request Headers

| Parameter            | Type   | Required | Description                     |
|----------------------|--------|----------|---------------------------------|
| `X-BELLA-QUEUE-NAME` | string | Optional | Queue name for batch processing |

## Request Body Parameters

| Parameter           | Type   | Required | Description                                                                                                                                                    |
|---------------------|--------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `input_file_id`     | string | Required | Input file ID containing batch requests, upload using File API, refer to [File Upload Documentation](/docs/bella-knowledge/api/files/upload) (Chinese version) |
| `endpoint`          | string | Required | API endpoint for processing tasks                                                                                                                              |
| `completion_window` | string | Required | Completion window, format: number+unit(m/h/d), default "24h"                                                                                                   |
| `metadata`          | object | Optional | Batch metadata, custom key-value pairs                                                                                                                         |

## Completion Window

Supported time unit formats:

| Unit | Description | Example       |
|------|-------------|---------------|
| `m`  | Minutes     | `30m`(30 min) |
| `h`  | Hours       | `24h`(24 hrs) |
| `d`  | Days        | `7d`(7 days)  |

**Default**: `24h` (24 hours)

**Format**: number + unit, e.g., `30m`, `2h`, `1d`

**Description**: Specifies the maximum completion time window for batch tasks. If the provided value format is
incorrect, the system will automatically use the default value of 24h.

## Returns

Returns a batch object containing complete batch information and status.

```json
{
  "id": "batchId",
  "object": "batch",
  "endpoint": "API endpoint",
  "input_file_id": "Input file ID",
  "completion_window": "Specified completion time",
  "created_at": "Creation time",
  "expired_at": "Expiration time",
  "request_counts": {
    "total": "Total tasks",
    "completed": "Completed tasks",
    "failed": "Failed tasks"
  }
}
```

## Batch Task Lifecycle

| Status      | Description                                                              |
|-------------|--------------------------------------------------------------------------|
| validating  | Batch job created, system is validating input file format and content.   |
| in_progress | Input file validation passed, system is processing batch requests.       |
| finalizing  | All requests processed, system is organizing and preparing output files. |
| completed   | Batch job successfully completed, all results ready for download.        |
| failed      | Batch job encountered errors during processing, failed to complete.      |
| cancelled   | Batch job has been cancelled by user.                                    |
| expired     | Batch job failed to complete within time window limit, timed out.        |

### Job Expiration (expired)

Job expiration is a built-in protection mechanism of the Batch API, designed to prevent jobs from running indefinitely.
Each batch job has a designated completion window.

**Important Note**: When a job expires, all uncompleted requests will be cancelled, but the results of already completed
requests will still be saved. Users only pay for requests that have been successfully completed.

### Job Failure (failed)

Job failure typically indicates that an unrecoverable error was encountered during processing, preventing the job from
continuing. Common causes include:

- Input file format errors
- Invalid request parameters
- Permission issues
- Internal system errors

## Input/Output File Format

### Input File

**File Format**: JSONL (JSON Lines)

Input files are the foundation of Batch API operations, containing all API requests to be processed. To ensure batch
tasks can be successfully created and executed, input files must strictly follow the specified format and requirements.

**Format Requirements**: Each line is an independent, valid JSON object

**Example**:

```jsonl
{"custom_id": "request-1", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "deepseek-r1-20250401", "messages": [{"role": "user", "content": "What is the capital of France?"}]}}
{"custom_id": "request-2", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "deepseek-r1-20250401", "messages": [{"role": "user", "content": "Translate 'Hello' to Spanish."}]}}
```

**Field Description**:

- `custom_id`: Business ID for correlating output results
- `method`: HTTP method, usually "POST"
- `url`: API endpoint path
- `body`: Request body containing specific API parameters, refer
  to [OpenAPI documentation](../../../bella-openapi/core/chat-completions.md)

**Important Limitations**:

- All requests in a batch task must point to the same endpoint and same model; mixed models are not allowed

### Output File

**File Format**: JSONL (JSON Lines)

**Example**:

```jsonl
{"response":{"status_code":200,"request_id":"TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX","body":{"id":"chatcmpl-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","object":"chat.completion","created":1762912790,"model":"deepseek-r1-20250401","choices":[{"index":0,"message":{"role":"assistant","content":"xxx","tool_calls":[],"reasoning_content":"xxx"},"finish_reason":"stop"}],"usage":{"prompt_tokens":6295,"total_tokens":7524,"completion_tokens":1229}}},"custom_id":"XXXXXXXXXXXXXXXX_XXXXXX","id":"TASK-X-X-X-XXXXXXXXXXXX-XXXX-XXXXXX"}
```

**Field Description**:

- `id`: Batch request ID
- `custom_id`: Corresponding custom_id from input file
- `response`: API response result

**Note**: Output line order may not match input line order. Don't rely on order to process results; instead use the
`custom_id` field included in each output line to map input requests to output results.

### Error File

**File Format**: JSONL (JSON Lines)

**Example**:

```jsonl
{"id":"","error":{"code":"parse_error","message":"Failed to parse request data."},"customId":"0"}
```

**Field Description**:

- `id`: Batch request ID
- `custom_id`: Corresponding custom_id from input file
- `error`: Detailed error information

### File Download and Processing

Use the `output_file_id` and `error_file_id` from the query task interface to download output files and error files from
the File API. Refer to [File API Documentation](/docs/bella-knowledge/api/files/content) (Chinese version).
