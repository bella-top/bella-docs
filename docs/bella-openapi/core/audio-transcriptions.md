# 音频文件转录接口文档

## 目录

- [接口描述](#接口描述)
- [请求](#请求)
  - [提交转录任务](#提交转录任务)
  - [查询转录结果](#查询转录结果)
- [响应](#响应)
  - [转录任务响应](#转录任务响应)
  - [转录结果响应](#转录结果响应)
- [回调机制](#回调机制)
- [错误码](#错误码)
- [示例](#示例)
  - [提交转录任务示例](#提交转录任务示例)
  - [查询转录结果示例](#查询转录结果示例)
  - [回调数据示例](#回调数据示例)
- [最佳实践](#最佳实践)

## 接口描述

音频文件转录接口用于将音频文件转换为文本。该接口采用异步处理模式，通过callback_url接收转录完成的结果推送。

该接口适用于各种音频文件转录场景，如会议录音、讲座录音、客服通话等，支持说话人识别、语义断句、标点符号预测等高级功能。

## 请求

### 提交转录任务

#### HTTP 请求

```http
POST /v1/audio/transcriptions/file
```

#### 请求头

| 参数 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer token，格式为 "Bearer YOUR_API_KEY" |
| Content-Type | string | 是 | application/json |

#### 请求体

| 参数 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| url | string | 是 | 文件URL，至少24小时内可访问（签名有效时长需保证） |
| model | string | 是 | 要使用的转录模型 |
| user | string | 是 | 表示最终用户的唯一标识符 |
| callback_url | string | 是 | 转录完成后的回调地址 |
| enable_words | boolean | 否 | 输出结果时是否返回分词信息，默认 true |
| vocab_id | string | 否 | 词汇表ID，用于热词定制 |
| channel_number | number | 否 | 声道数 |
| language | string | 否 | 音频语言 |
| hot_word | string | 否 | 热词，多个热词用逗号分隔 |
| candidate | number | 否 | 候选结果数量 |
| audio_mode | string | 否 | 音频模式 |
| standard_wav | number | 否 | 是否标准WAV格式 |
| language_type | number | 否 | 语言类型 |
| trans_mode | number | 否 | 转录模式 |
| eng_smoothproc | boolean | 否 | 英语平滑处理 |
| eng_collogproc | boolean | 否 | 英语口语化处理 |
| eng_vad_mdn | number | 否 | 英语VAD中值 |
| eng_vad_margin | number | 否 | 英语VAD边距 |
| eng_rlang | number | 否 | 英语语言模型 |
| sample_rate | number | 否 | 音频采样率 |
| enable_semantic_sentence_detection | boolean | 否 | 是否开启语义断句，默认 false |
| enable_punctuation_prediction | boolean | 否 | 是否在输出结果中增加标点符号，默认 false |
| max_end_silence | number | 否 | 最大结束静音时长 |
| speaker_diarization | boolean | 否 | 说话人识别，默认 false |
| speaker_number | number | 否 | 说话人数量 |
| enable_vad | boolean | 否 | 是否启用语音活动检测 |
| chunk_length | number | 否 | 音频块长度 |

### 查询转录结果

#### HTTP 请求

```http
POST /v1/audio/transcriptions/file/result
```

#### 请求头

| 参数 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer token，格式为 "Bearer YOUR_API_KEY" |
| Content-Type | string | 是 | application/json |

#### 请求体

```json
{
  "task_id": "transcription-task-123456"
}
```

| 参数 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| task_id | string | 是 | 转录任务ID，由提交转录任务接口返回 |

## 响应

### 转录任务响应

提交转录任务成功后返回：

```json
{
  "task_id": "transcription-task-123456"
}
```

#### 响应参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| task_id | string | 任务ID，用于后续查询转录结果或标识回调数据 |

### 转录结果响应

查询转录结果或回调数据的完整格式：

```json
{
  "task": "transcription",
  "task_id": "transcription-task-123456",
  "error": null,
  "language": "zh",
  "duration": 120.5,
  "text": "这是转录得到的完整文本内容。包含所有识别出的语音内容。",
  "words": [
    {
      "word": "这是",
      "start": 0.0,
      "end": 0.5,
      "channel_id": 0,
      "speaker_id": 1
    },
    {
      "word": "转录",
      "start": 0.5,
      "end": 1.0,
      "channel_id": 0,
      "speaker_id": 1
    }
  ],
  "segments": [
    {
      "id": 0,
      "seek": 0,
      "start": 0.0,
      "end": 5.5,
      "text": "这是第一段转录文本",
      "tokens": [123, 456, 789],
      "temperature": 0.0,
      "avg_logprob": -0.8,
      "compression_ratio": 1.2,
      "no_speech_prob": 0.1,
      "channel_id": 0,
      "speaker_id": 1,
      "confidence": "0.95",
      "embedding": [0.1, 0.2, 0.3]
    },
    {
      "id": 1,
      "seek": 550,
      "start": 5.5,
      "end": 12.0,
      "text": "这是第二段转录文本",
      "tokens": [234, 567, 890],
      "temperature": 0.0,
      "avg_logprob": -0.7,
      "compression_ratio": 1.3,
      "no_speech_prob": 0.05,
      "channel_id": 0,
      "speaker_id": 2,
      "confidence": "0.92",
      "embedding": [0.4, 0.5, 0.6]
    }
  ],
  "speaker_embeddings": "base64编码的说话人特征向量",
  "num_speakers": "2"
}
```

#### 响应参数

| 参数 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| task | string | 是 | 任务类型，固定值 "transcription" |
| task_id | string | 是 | 任务ID |
| error | string | 否 | 错误信息，转录成功时为null |
| language | string | 否 | 检测到的音频语言 |
| duration | number | 是 | 音频总时长（秒） |
| text | string | 否 | 完整的转录文本 |
| file_id | string | 否 | 内容超长时返回 file id，通过 file api 查询结果（仅在查询结果接口中返回） |
| words | array | 否 | 分词结果数组（当enable_words为true时返回） |
| segments | array | 是 | 分段转录结果数组 |
| speaker_embeddings | string | 否 | 说话人特征向量（当speaker_diarization为true时返回） |
| num_speakers | string | 否 | 说话人数量（当speaker_diarization为true时返回） |

#### Words 对象

| 参数 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| word | string | 是 | 分词结果 |
| start | number | 是 | 词语开始时间（秒） |
| end | number | 是 | 词语结束时间（秒） |
| channel_id | number | 否 | 声道ID |
| speaker_id | number | 否 | 说话人ID |

#### Segments 对象

| 参数 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | number | 是 | 段落ID |
| text | string | 是 | 段落转录文本 |
| start | number | 是 | 段落开始时间（秒） |
| end | number | 是 | 段落结束时间（秒） |
| seek | number | 否 | 段落在音频中的位置偏移 |
| tokens | array | 否 | token序列 |
| temperature | number | 否 | 使用的采样温度 |
| avg_logprob | number | 否 | 段落的平均对数概率 |
| compression_ratio | number | 否 | 文本压缩比 |
| no_speech_prob | number | 否 | 无语音概率 |
| channel_id | number | 否 | 声道ID |
| speaker_id | number | 否 | 说话人ID |
| confidence | string | 否 | 说话人识别置信度 |
| embedding | array | 否 | 说话人特征向量 |

## 回调机制

当转录任务完成时，系统会向您提供的callback_url发送POST请求，推送转录结果。

### 回调请求

#### HTTP 方法
```http
POST {callback_url}
```

#### 回调头部
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| Content-Type | string | application/json |
| User-Agent | string | Bella-OpenAPI-Callback/1.0 |

#### 回调数据
回调数据格式与查询转录结果的响应格式完全相同，详见[转录结果响应](#转录结果响应)部分。

### 回调处理建议

1. **验证任务ID**：接收到回调时，验证task_id是否为您提交的任务
2. **幂等性处理**：同一个任务可能会收到多次回调，请确保处理的幂等性
3. **错误处理**：检查error字段，如果不为null则表示转录失败
4. **响应状态码**：回调处理完成后，请返回HTTP 200状态码
5. **超时设置**：回调请求超时时间为30秒，请确保及时响应

## 错误码

| 错误码 | 描述 |
| --- | --- |
| 400 | 请求参数错误，例如音频格式不支持或参数格式不正确 |
| 401 | 认证失败，无效的 API 密钥 |
| 403 | 权限不足，API 密钥没有权限访问请求的资源 |
| 404 | 请求的资源不存在，例如指定的模型或任务不存在 |
| 413 | 请求实体过大，音频文件超过大小限制 |
| 415 | 不支持的媒体类型，音频格式不受支持 |
| 429 | 请求过多，超出速率限制 |
| 500 | 服务器内部错误 |
| 503 | 服务暂时不可用 |

## 示例

### 提交转录任务示例

使用 curl 提交转录任务：

```bash
curl -X POST "https://api.example.com/v1/audio/transcriptions/file" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/audio/recording.mp3",
    "model": "whisper-large-v3",
    "user": "user123",
    "callback_url": "https://your-domain.com/callback/transcription",
    "enable_words": true
  }'
```

使用 Python 提交转录任务：

```python
import requests

url = "https://api.example.com/v1/audio/transcriptions/file"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "url": "https://example.com/audio/recording.mp3",
    "model": "whisper-large-v3",
    "user": "user123",
    "callback_url": "https://your-domain.com/callback/transcription",
    "enable_words": True
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
```

#### 响应示例

```json
{
  "task_id": "transcription-task-123456"
}
```

### 查询转录结果示例

使用 curl 查询转录结果：

```bash
curl -X POST "https://api.example.com/v1/audio/transcriptions/file/result" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "transcription-task-123456"
  }'
```

使用 Python 查询转录结果：

```python
import requests

url = "https://api.example.com/v1/audio/transcriptions/file/result"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "task_id": "transcription-task-123456"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)

# 检查是否有错误
if result.get("error"):
    print("转录失败:", result["error"])
elif result.get("file_id"):
    print("内容超长，file_id:", result["file_id"])
    # 需要通过 file API 获取完整的转录结果
    # full_result = get_file_content(result["file_id"])
else:
    print("转录文本:", result.get("text", ""))
    print("语言:", result.get("language", ""))
    print("时长:", result.get("duration", 0), "秒")
```

#### 查询结果响应示例

**正常响应**（内容不超长）：
```json
{
  "task": "transcription",
  "task_id": "transcription-task-123456",
  "error": null,
  "language": "zh",
  "duration": 30.5,
  "text": "转录的文本内容...",
  "segments": [...]
}
```

**内容超长响应**（返回file_id）：
```json
{
  "task": "transcription",
  "task_id": "transcription-task-123456",
  "error": null,
  "language": "zh",
  "duration": 7200.0,
  "file_id": "file-abc123def456",
  "segments": []
}
```

**注意**：当查询结果返回 `file_id` 时，表示转录内容超长，需要通过 file API 来获取完整的转录结果。此时 `text`、`words`、`segments` 等字段可能为空或不包含完整数据。

### 回调数据示例

当转录完成时，系统会向您的callback_url发送以下格式的数据：

#### 转录成功的回调数据

```json
{
  "task": "transcription",
  "task_id": "transcription-task-123456",
  "error": null,
  "language": "zh",
  "duration": 30.5,
  "text": "今天我们来讨论人工智能的发展趋势。人工智能技术在近年来取得了显著的进步。",
  "words": [
    {
      "word": "今天",
      "start": 0.0,
      "end": 0.6,
      "channel_id": 0,
      "speaker_id": 1
    },
    {
      "word": "我们",
      "start": 0.6,
      "end": 1.0,
      "channel_id": 0,
      "speaker_id": 1
    },
    {
      "word": "来",
      "start": 1.0,
      "end": 1.2,
      "channel_id": 0,
      "speaker_id": 1
    },
    {
      "word": "讨论",
      "start": 1.2,
      "end": 1.8,
      "channel_id": 0,
      "speaker_id": 1
    }
  ],
  "segments": [
    {
      "id": 0,
      "seek": 0,
      "start": 0.0,
      "end": 8.0,
      "text": "今天我们来讨论人工智能的发展趋势。",
      "tokens": [1234, 5678, 9012],
      "temperature": 0.0,
      "avg_logprob": -0.6,
      "compression_ratio": 1.1,
      "no_speech_prob": 0.02,
      "channel_id": 0,
      "speaker_id": 1,
      "confidence": "0.95",
      "embedding": [0.1, 0.2, 0.3]
    },
    {
      "id": 1,
      "seek": 800,
      "start": 8.0,
      "end": 30.5,
      "text": "人工智能技术在近年来取得了显著的进步。",
      "tokens": [3456, 7890, 1234],
      "temperature": 0.0,
      "avg_logprob": -0.5,
      "compression_ratio": 1.2,
      "no_speech_prob": 0.01,
      "channel_id": 0,
      "speaker_id": 2,
      "confidence": "0.92",
      "embedding": [0.4, 0.5, 0.6]
    }
  ],
  "speaker_embeddings": "eyJzcGVha2VyXzEiOiBbMC4xLDAuMiwwLjNdLCJzcGVha2VyXzIiOiBbMC40LDAuNSwwLjZdfQ==",
  "num_speakers": "2"
}
```

#### 转录失败的回调数据

```json
{
  "task": "transcription",
  "task_id": "transcription-task-123456",
  "error": "音频文件格式不支持或文件损坏",
  "duration": 0,
  "segments": []
}
```


## 最佳实践

### 1. 音频文件准备

- **文件格式**：支持 MP3、WAV 格式
- **文件大小**：建议单个文件不超过 2GB
- **文件访问**：确保提供的URL在24小时内可访问，建议使用有效期较长的签名URL
- **音频质量**：清晰的音频能获得更好的转录效果，建议采样率 8kHz 或 16kHz

### 2. 回调处理（推荐方式）

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/callback/transcription', methods=['POST'])
def handle_transcription_callback():
    data = request.get_json()
    
    # 验证任务ID
    task_id = data.get('task_id')
    if not task_id:
        return jsonify({'error': 'Missing task_id'}), 400
    
    # 检查是否有错误
    if data.get('error'):
        print(f"转录失败 {task_id}: {data['error']}")
        return jsonify({'status': 'received'}), 200
    
    # 处理转录结果
    text = data.get('text', '')
    duration = data.get('duration', 0)
    language = data.get('language', '')
    
    print(f"转录完成 {task_id}: {text[:100]}...")
    
    # 保存结果到数据库或进行后续处理
    # save_transcription_result(task_id, data)
    
    return jsonify({'status': 'received'}), 200

if __name__ == '__main__':
    app.run(port=5000)
```

