# Intelligent Q&A Interface Documentation

## Table of Contents

- [Interface Description](#interface-description)
- [Request](#request)
  - [HTTP Request](#http-request)
  - [Request Body](#request-body)
  - [Message Object Types](#message-object-types)
  - [Tools and Function Definitions](#tools-and-function-definitions)
  - [Message Content Format](#message-content-format)
- [Response](#response)
  - [Non-streaming Response](#non-streaming-response)
  - [Streaming Response](#streaming-response)
  - [reasoning_content Field](#reasoning_content-field)
  - [Response Parameters](#response-parameters)
- [Error Codes](#error-codes)
- [Examples](#examples)
  - [Basic Request Example](#basic-request-example)
  - [Tool Call Request Example](#tool-call-request-example)
  - [Tool Call Response Example](#tool-call-response-example)
  - [Tool Result Submission Example](#tool-result-submission-example)
  - [Tool Result Response Example](#tool-result-response-example)
  - [Image Input Example](#image-input-example)
  - [Streaming Tool Call Example](#streaming-tool-call-example)

## Interface Description

Creates a chat completion request that supports both streaming and non-streaming responses. This interface accepts a series of messages as input and returns completion content generated by the model.
This protocol extends the OpenAI Chat Completions API with support for the reasoning_content field. For the latest and complete OpenAI Chat Completions API parameters, refer to [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat/create).

## Request

### HTTP Request

```http
POST /v1/chat/completions
```

### Request Body

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| model | string | Yes | The ID of the model to use |
| messages | array | Yes | Array of messages containing conversation history. Different message types (modalities) are supported depending on the model, such as text, images, and audio |
| tools | array | No | List of tools that the model may call. Currently only functions are supported as tools. Use this parameter to provide a list of functions for which the model might generate JSON inputs. Supports up to 128 functions |
| tool_choice | string/object | No | Controls whether the model calls a tool.<br/>- `"none"`: Model will not call any tools and will generate a message<br/>- `"auto"`: Model can choose between generating a message or calling one or more tools<br/>- `"required"`: Model must call one or more tools<br/>- Can also specify a particular tool: `{"type": "function", "function": {"name": "my_function"}}`<br/><br/>Defaults to `"none"` when no tools are present; defaults to `"auto"` when tools are present |
| temperature | number | No | Sampling temperature, default is 1. Lower values make the output more deterministic |
| top_p | number | No | Nucleus sampling probability mass, default is 1 |
| n | integer | No | Number of chat completions to generate for each input message, default is 1 |
| stream | boolean | No | Whether to enable streaming responses, default is false |
| stream_options | object | No | Streaming response options, only set when stream=true |
| stop | string/array | No | Up to 4 sequences where the API will stop generating |
| max_tokens | integer | No | Maximum number of tokens to generate |
| presence_penalty | number | No | Presence penalty, range -2.0 to 2.0, default is 0 |
| frequency_penalty | number | No | Frequency penalty, range -2.0 to 2.0, default is 0 |
| logit_bias | object | No | Modifies the likelihood of specified tokens appearing in the completion |
| response_format | object | No | Specifies the format the model must output |
| seed | integer | No | Seed value for deterministic sampling |
| parallel_tool_calls | boolean | No | Whether to allow parallel tool calls |
| user | string | No | A unique identifier representing the end user |

### Message Object Types

#### Developer Message

```json
{
  "role": "developer",
  "content": "You are a helpful assistant focused on answering user questions."
}
```

Instructions provided by the developer that the model should follow regardless of what messages the user sends. In newer OpenAI models (such as the o1 series), developer messages replace the previous system messages.

#### System Message

```json
{
  "role": "system",
  "content": "You are a helpful assistant focused on answering user questions."
}
```

Instructions provided by the developer that the model should follow regardless of what messages the user sends. In newer OpenAI models (such as the o1 series), it is recommended to use developer messages instead of system messages.

#### User Message

```json
{
  "role": "user",
  "content": "Hello, please introduce yourself."
}
```

Messages sent by the end user, containing prompts or additional context information.

#### Assistant Message

```json
{
  "role": "assistant",
  "content": "I am an AI assistant that can answer questions and provide information."
}
```

Messages sent by the model in response to user messages.

#### Tool Message

```json
{
  "role": "tool",
  "content": "{\"temperature\":32,\"unit\":\"celsius\",\"description\":\"Sunny\",\"humidity\":45}",
  "tool_call_id": "call_abc123"
}
```

Tool messages contain the results of tool calls and must include the following fields:
- `content`: The content of the tool message (string)
- `role`: The role of the message author, in this case "tool"
- `tool_call_id`: The ID of the tool call this message is responding to

### Tools and Function Definitions

#### Tool Object

```json
{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "Get weather information for a specified city",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "City name, such as Beijing, Shanghai"
        },
        "unit": {
          "type": "string",
          "enum": ["celsius", "fahrenheit"],
          "description": "Temperature unit"
        }
      },
      "required": ["location"]
    },
    "strict": true
  }
}
```

Tool objects contain the following fields:
- `type`: Tool type, currently only "function" is supported
- `function`: Function definition, containing the following fields:
  - `name`: Function name (required). Must contain a-z, A-Z, 0-9, or include underscores and hyphens, with a maximum length of 64
  - `description`: Description of the function's functionality (optional). The model uses this to decide when and how to call the function
  - `parameters`: Parameters accepted by the function, described as a JSON Schema object (optional)
  - `strict`: Whether to enable strict mode adherence when generating function calls (optional, default is false)

#### Tool Choice Object

Used to specify a particular tool:

```json
{
  "type": "function",
  "function": {
    "name": "get_weather"
  }
}
```

### Message Content Format

#### Text Content

```json
{
  "role": "user",
  "content": "Hello, please introduce yourself."
}
```

#### Image Content

```json
{
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": "What's in this image?"
    },
    {
      "type": "image_url",
      "image_url": {
        "url": "https://example.com/image.jpg",
        "detail": "high"
      }
    }
  ]
}
```

#### Tool Call Content

```json
{
  "role": "assistant",
  "content": null,
  "tool_calls": [
    {
      "id": "call_abc123",
      "type": "function",
      "function": {
        "name": "get_weather",
        "arguments": "{\"location\":\"Beijing\",\"unit\":\"celsius\"}"
      }
    }
  ]
}
```

## Response

### Non-streaming Response

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4o",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help you?",
      "reasoning_content": "User greeted in Chinese, I should respond in Chinese."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
```

### Streaming Response

When `stream=true`, the server will send a series of Server-Sent Events (SSE), each containing a partial response. The format of each event is as follows:

```
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-3.5-turbo","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"reasoning_content":"User greeted in Chinese, "},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-3.5-turbo","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"reasoning_content":"I should respond in Chinese."},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-3.5-turbo","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-3.5-turbo","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"content":"!"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-3.5-turbo","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

### reasoning_content Field

Bella OpenAPI extends the standard OpenAI interface with the `reasoning_content` field to provide the model's reasoning process:

- Only models that output reasoning processes will return the `reasoning_content` field
- In non-streaming responses, `reasoning_content` is returned as a property of the Message object
- In streaming responses, `reasoning_content` is returned in chunks through the delta object
- The reasoning content helps developers understand the model's thought process and decision basis

### Response Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| id | string | Unique identifier for the response |
| object | string | Object type, typically "chat.completion" or "chat.completion.chunk" |
| created | integer | Timestamp when the response was created |
| model | string | The model used |
| system_fingerprint | string | Fingerprint of the backend configuration the model ran on |
| choices | array | Array of completion choices |
| usage | object | Token usage statistics |

#### Choice Object

| Parameter | Type | Description |
| --- | --- | --- |
| index | integer | Index of the choice |
| message | object | In non-streaming responses, contains the complete message |
| delta | object | In streaming responses, contains the incremental part of the message |
| finish_reason | string | Reason for completion, possible values include "stop", "length", "tool_calls", "content_filter", or null |

#### Message/Delta Object

| Parameter | Type | Description |
| --- | --- | --- |
| role | string | Role of the message, typically "assistant" |
| content | string | Content of the message |
| reasoning_content | string | Contains the model's reasoning process |
| tool_calls | array | List of tool calls |

#### Usage Object

| Parameter | Type | Description |
| --- | --- | --- |
| prompt_tokens | integer | Number of tokens used in the prompt |
| completion_tokens | integer | Number of tokens used in the completion |
| total_tokens | integer | Total number of tokens used |

## Error Codes

| Error Code | Description |
| --- | --- |
| 400 | Request parameter error |
| 401 | Authentication failed, invalid API key |
| 403 | Insufficient permissions, API key doesn't have permission to access the requested resource |
| 404 | Requested resource does not exist |
| 429 | Too many requests, exceeded rate limit |
| 500 | Internal server error |
| 503 | Service temporarily unavailable |

## Examples

### Basic Request Example

```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Hello, please introduce yourself."
    }
  ],
  "temperature": 0.7,
  "stream": false
}
```

### Tool Call Request Example

```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": "What's the weather like in Beijing today?"
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get weather information for a specified city",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City name, such as Beijing, Shanghai"
            },
            "unit": {
              "type": "string",
              "enum": ["celsius", "fahrenheit"],
              "description": "Temperature unit"
            }
          },
          "required": ["location"]
        },
        "strict": true
      }
    }
  ],
  "tool_choice": "auto"
}
```

### Tool Call Response Example

When the model decides to call a tool, the response will include the `tool_calls` field:

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4o",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": null,
      "reasoning_content": "User is asking about the weather in Beijing, I need to call",
      "tool_calls": [
        {
          "id": "call_abc123",
          "type": "function",
          "function": {
            "name": "get_weather",
            "arguments": "{\"location\":\"Beijing\",\"unit\":\"celsius\"}"
          }
        }
      ]
    },
    "finish_reason": "tool_calls"
  }],
  "usage": {
    "prompt_tokens": 82,
    "completion_tokens": 25,
    "total_tokens": 107
  }
}
```

### Tool Result Submission Example

After obtaining the tool execution results, the results need to be submitted back to the conversation:

```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": "What's the weather like in Beijing today?"
    },
    {
      "role": "assistant",
      "content": null,
      "tool_calls": [
        {
          "id": "call_abc123",
          "type": "function",
          "function": {
            "name": "get_weather",
            "arguments": "{\"location\":\"Beijing\",\"unit\":\"celsius\"}"
          }
        }
      ]
    },
    {
      "role": "tool",
      "tool_call_id": "call_abc123",
      "name": "get_weather",
      "content": "{\"temperature\":32,\"unit\":\"celsius\",\"description\":\"Sunny\",\"humidity\":45}"
    }
  ]
}
```

### Tool Result Response Example

The model's response after processing the tool results:

```json
{
  "id": "chatcmpl-456",
  "object": "chat.completion",
  "created": 1677652290,
  "model": "gpt-4o",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Beijing's weather today is sunny with a temperature of 32°C and humidity of 45%. It's quite hot, so I recommend using sun protection and staying hydrated.",
      "reasoning_content": "Based on the data returned by the weather API, Beijing today has sunny weather, a temperature of 32 degrees Celsius, and humidity of 45%. This is relatively hot weather, so I should remind the user about sun protection and hydration."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 110,
    "completion_tokens": 42,
    "total_tokens": 152
  }
}
```

### Image Input Example

Support for including images in user messages:

```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What's in this image?"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "https://example.com/image.jpg",
            "detail": "high"
          }
        }
      ]
    }
  ]
}
```

#### Image URL Format

Image URLs can be in one of the following formats:

1. Internet-accessible URL:
   ```json
   {
     "type": "image_url",
     "image_url": {
       "url": "https://example.com/image.jpg"
     }
   }
   ```

2. Base64-encoded image data:
   ```json
   {
     "type": "image_url",
     "image_url": {
       "url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL..."
     }
   }
   ```

3. Image detail level:
   The level of detail for image analysis can be specified using the `detail` parameter, with possible values:
   - `"high"`: High detail analysis, suitable for scenarios requiring identification of small text or details
   - `"low"`: Low detail analysis, faster processing and consumes fewer tokens
   - Defaults to `"auto"` if not specified

### Image Input Response Example

```json
{
  "id": "chatcmpl-789",
  "object": "chat.completion",
  "created": 1677652295,
  "model": "gpt-4o",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "This image shows an orange cat sitting on a windowsill, looking outside. Through the window, you can see some green trees and a blue sky. The cat looks relaxed, with its tail curled up next to its body.",
      "reasoning_content": "The image contains an orange cat sitting on a windowsill looking outside. I can see trees and sky outside the window. The cat's posture indicates it is relaxed. I should describe in detail what I see, including the cat's color, position, surroundings, and posture."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 1042,
    "completion_tokens": 65,
    "total_tokens": 1107
  }
}
```

### Streaming Tool Call Example

When using tool calls in streaming mode, the response is returned across multiple events:

```
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-4o","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-4o","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"reasoning_content":"User is asking about the weather in Beijing, I need to call"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-4o","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"reasoning_content":" the weather query function to get this information."},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-4o","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"id":"call_abc123","type":"function","function":{"name":"get_weather"}}]},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-4o","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"{\""}}]},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-4o","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"location"}}]},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-4o","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"\":\""}}]},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-4o","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"Beijing"}}]},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-4o","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"\",\""}}]},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-4o","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"unit"}}]},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-4o","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"\":\""}}]},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-4o","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"celsius"}}]},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-4o","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"\"}"}}]},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-4o","system_fingerprint":"fp_44709d6fcb","usage":{"prompt_tokens": 1042,"completion_tokens": 65,"total_tokens": 1107},"choices":[{"index":0,"delta":{},"finish_reason":"tool_calls"}]}

data: [DONE]
```