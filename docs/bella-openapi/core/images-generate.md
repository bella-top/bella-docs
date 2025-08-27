# 文生图接口文档

## 概述

文生图 API 提供了基于文本提示生成图像的能力，兼容 OpenAI Images API 规范。支持多种模型和灵活的参数配置，可以生成不同质量、尺寸和风格的图像。

## 端点

```
POST /v1/images/generations
```

## 支持的模型

| 模型 | 描述                       | 最大提示词长度 | 支持的尺寸 |
|------|--------------------------|-----|------------|
| `dall-e-2` | DALL·E 2 模型，成本较低         | 1,000 字符 | `256x256`, `512x512`, `1024x1024` |
| `dall-e-3` | DALL·E 3 模型，质量更高         | 4,000 字符 | `1024x1024`, `1792x1024`, `1024x1792` |
| `gpt-image-1` | GPT Image 1 模型，支持更多自定义选项 | 32,000 字符 | 支持多种尺寸 |
| `doubao-seedream-3-0-t2i` | 火山平台，支持特定的选项             | 未明确 | 支持多种尺寸 |

## 请求格式

### 请求头

```http
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

### 请求体参数

| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `prompt` | string | ✅ | 图像描述文本。长度限制见上表 |
| `model` | string | ✅ | 使用的模型名称 |
| `n` | integer | ❌ | 生成的图像数量，范围 1-10。dall-e-3 仅支持 n=1 |
| `quality` | string | ❌ | 图像质量。仅 dall-e-3 支持：`standard`（默认）、`hd` |
| `response_format` | string | ❌ | 返回格式：`url`（默认）、`b64_json` |
| `size` | string | ❌ | 图像尺寸，见支持的模型表格 |
| `style` | string | ❌ | 图像风格。仅 dall-e-3 支持：`vivid`（默认）、`natural` |
| `user` | string | ❌ | 用户标识符，用于监控和防滥用 |

### GPT Image 1 专用参数

| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `background` | string | ❌ | 背景透明度：`auto`（默认）、`transparent`、`opaque` |
| `moderation` | string | ❌ | 内容审核级别：`auto`（默认）、`low` |
| `output_compression` | integer | ❌ | 输出压缩级别，0-100%，默认 100 |
| `output_format` | string | ❌ | 输出格式：`png`、`jpeg`、`webp` |

### 火山引擎协议扩展参数

| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `watermark` | boolean | ❌ | 是否添加水印 |
| `seed` | integer | ❌ | 随机种子，范围 [-1, 2147483647] |
| `guidance_scale` | float | ❌ | 生成自由度，范围 [1, 10] |

## 响应格式

### 成功响应

```json
{
  "created": 1677649296,
  "background": "transparent",
  "data": [
    {
      "b64_json": null,
      "url": "https://example.com/image.png",
      "revised_prompt": "修正后的提示词",
      "output_format": "png",
      "quality": "standard",
      "size": "1024x1024"
    }
  ],
  "usage": {
    "prompt_tokens": 50,
    "input_tokens_details": {
      "text_tokens": 40,
      "image_tokens": 10
    }
  }
}
```

### 响应字段说明

| 字段 | 类型 | 描述 |
|------|------|------|
| `created` | integer | Unix 时间戳 |
| `background` | string | 背景参数（仅 gpt-image-1） |
| `data` | array | 生成的图像列表 |
| `usage` | object | Token 使用统计（仅 gpt-image-1） |

#### ImageData 对象

| 字段 | 类型 | 描述 |
|------|------|------|
| `b64_json` | string | Base64 编码的图像数据（当 response_format=b64_json 时） |
| `url` | string | 图像 URL（当 response_format=url 时） |
| `revised_prompt` | string | 修正后的提示词 |
| `output_format` | string | 输出格式（仅 gpt-image-1） |
| `quality` | string | 图像质量 |
| `size` | string | 图像尺寸 |

#### Usage 对象（仅 gpt-image-1）

| 字段 | 类型 | 描述 |
|------|------|------|
| `prompt_tokens` | integer | 总输入 Token 数 |
| `input_tokens_details` | object | 详细 Token 统计 |

#### InputTokensDetails 对象

| 字段 | 类型 | 描述 |
|------|------|------|
| `text_tokens` | integer | 文本 Token 数 |
| `image_tokens` | integer | 图像 Token 数 |

## 请求示例

### 基础示例（DALL·E 2）

```bash
curl -X POST "https://api.example.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "一只可爱的橘猫坐在阳光下",
    "model": "dall-e-2",
    "n": 1,
    "size": "1024x1024",
    "response_format": "url"
  }'
```

### 高质量示例（DALL·E 3）

```bash
curl -X POST "https://api.example.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "未来主义城市景观，霓虹灯闪烁，赛博朋克风格",
    "model": "dall-e-3",
    "quality": "hd",
    "style": "vivid",
    "size": "1792x1024"
  }'
```

### GPT Image 1 高级示例

```bash
curl -X POST "https://api.example.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "一朵盛开的玉兰花，背景虚化，摄影风格",
    "model": "gpt-image-1",
    "background": "transparent",
    "output_format": "png",
    "output_compression": 85,
    "moderation": "low",
    "n": 2
  }'
```

### JavaScript 示例

```javascript
const response = await fetch('https://api.example.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: '梵高风格的星空下的小镇',
    model: 'dall-e-3',
    quality: 'hd',
    size: '1024x1024'
  })
});

const data = await response.json();
console.log('生成的图像URL:', data.data[0].url);
```

### Python 示例

```python
import requests
import json

url = "https://api.example.com/v1/images/generations"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

payload = {
    "prompt": "水彩画风格的山水画，意境深远",
    "model": "dall-e-3",
    "quality": "standard",
    "style": "natural",
    "size": "1024x1024"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
result = response.json()

print(f"生成的图像URL: {result['data'][0]['url']}")
```

## 错误处理

### 常见错误码

| 状态码 | 错误类型 | 描述 | 解决方案 |
|--------|----------|------|----------|
| 400 | `invalid_request_error` | 请求参数无效 | 检查必需参数和参数格式 |
| 401 | `authentication_error` | API Key 无效 | 检查 Authorization 头 |
| 429 | `rate_limit_exceeded` | 请求频率过高 | 降低请求频率或升级套餐 |
| 500 | `server_error` | 服务器内部错误 | 稍后重试 |

### 错误响应示例

```json
{
  "error": {
    "code": "invalid_request_error",
    "message": "Invalid model specified",
    "param": "model",
    "type": "invalid_request_error"
  }
}
```

## 计费说明

### 计费模式

不同模型采用不同的计费方式：

#### DALL·E 2 和 Doubao
- 按生成的图像数量计费
- 不同尺寸价格不同

#### DALL·E 3
- 按生成的图像数量和质量计费
- 支持标准质量和高清质量

#### GPT Image 1
- **图像生成费用**：按图像数量、质量和尺寸计费
- **Token 费用**：按输入 Token 数量计费（包括文本和图像 Token）

### 价格示例

以下为示例价格（实际价格以平台公布为准）：

| 模型 | 质量 | 尺寸 | 价格/张 |
|------|------|------|---------|
| DALL·E 2 | 标准 | 256x256 | $0.016 |
| DALL·E 2 | 标准 | 512x512 | $0.018 |
| DALL·E 2 | 标准 | 1024x1024 | $0.020 |
| DALL·E 3 | 标准 | 1024x1024 | $0.040 |
| DALL·E 3 | HD | 1024x1024 | $0.080 |
| GPT Image 1 | 低质量 | 1024x1024 | $0.020 |
| GPT Image 1 | 中等质量 | 1024x1024 | $0.040 |
| GPT Image 1 | 高质量 | 1024x1024 | $0.080 |

### Token 计费（GPT Image 1）

- 文本 Token：$0.002 / 1K tokens
- 图像 Token：$0.010 / 1K tokens

## 最佳实践

### 1. 提示词优化

- **具体描述**：使用具体、详细的描述而非模糊的概念
- **风格指导**：明确指定艺术风格、摄影风格或绘画技法
- **构图说明**：描述期望的构图、角度和视角
- **色彩和光线**：指定色调、光线条件和氛围

```text
// 优化前
"一只猫"

// 优化后  
"一只橘色短毛猫坐在阳光洒满的窗台上，背景是绿色植物，暖色调，自然光线，摄影风格"
```

### 2. 参数选择建议

- **质量设置**：
  - 标准质量适合大多数场景
  - HD 质量用于需要精细细节的场景

- **尺寸选择**：
  - 社交媒体：1024x1024
  - 横幅广告：1792x1024
  - 竖向海报：1024x1792

### 3. 性能优化

- **批量生成**：使用 `n` 参数一次生成多张图像
- **格式选择**：URL 格式传输更快，Base64 格式便于直接处理
- **压缩设置**：根据用途调整压缩级别平衡质量和文件大小

### 4. 内容安全

- 遵守平台内容政策
- 使用适当的审核级别
- 避免可能触发安全过滤器的描述

## 常见问题

### Q: 为什么生成的图像与提示词不完全匹配？
A: AI 模型会对提示词进行理解和解释，可能会有一定的创意发挥。可以通过更具体的描述来提高匹配度。

### Q: 如何提高图像生成的一致性？
A: 
- 使用相同的种子值（火山引擎协议）
- 保持提示词的一致性
- 使用相同的模型和参数

### Q: 生成的图像可以商用吗？
A: 请参考具体的服务条款和使用许可。通常情况下，用户对生成的图像拥有使用权。

### Q: 如何处理生成失败的情况？
A: 
- 检查提示词是否违反内容政策
- 简化复杂的提示词
- 重新尝试或调整参数
- 联系技术支持

---

**注意**：本文档基于当前 API 版本编写，具体功能和价格可能随版本更新而变化。请以最新的官方文档为准。
