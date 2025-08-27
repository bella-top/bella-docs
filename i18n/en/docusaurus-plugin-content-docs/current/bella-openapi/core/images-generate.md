# Text-to-Image API Documentation

## Overview

The Text-to-Image API provides the capability to generate images based on text prompts, compatible with the OpenAI Images API specification. It supports multiple models and flexible parameter configurations to generate images of different qualities, sizes, and styles.

## Endpoint

```
POST /v1/images/generations
```

## Supported Models

| Model | Description                                          | Max Prompt Length | Supported Sizes |
|-------|------------------------------------------------------|-------------------|-----------------|
| `dall-e-2` | DALL·E 2 model, lower cost                           | 1,000 characters | `256x256`, `512x512`, `1024x1024` |
| `dall-e-3` | DALL·E 3 model, higher quality                       | 4,000 characters | `1024x1024`, `1792x1024`, `1024x1792` |
| `gpt-image-1` | GPT Image 1 model, supports more customization options | 32,000 characters | Supports multiple sizes |
| `doubao-seedream-3-0-t2i` | Huoshan platform, supports specific options          | Not specified | Supports multiple sizes |

## Request Format

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | | Image description text. Length limit see table above |
| `model` | string | | Model name to use |
| `n` | integer | | Number of images to generate, range 1-10. dall-e-3 only supports n=1 |
| `quality` | string | | Image quality. Only dall-e-3 supports: `standard` (default), `hd` |
| `response_format` | string | | Return format: `url` (default), `b64_json` |
| `size` | string | | Image size, see supported models table |
| `style` | string | | Image style. Only dall-e-3 supports: `vivid` (default), `natural` |
| `user` | string | | User identifier for monitoring and abuse prevention |

### GPT Image 1 Specific Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `background` | string | | Background transparency: `auto` (default), `transparent`, `opaque` |
| `moderation` | string | | Content moderation level: `auto` (default), `low` |
| `output_compression` | integer | | Output compression level, 0-100%, default 100 |
| `output_format` | string | | Output format: `png`, `jpeg`, `webp` |

### Volcano Engine Protocol Extension Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `watermark` | boolean | | Whether to add watermark |
| `seed` | integer | | Random seed, range [-1, 2147483647] |
| `guidance_scale` | float | | Generation freedom, range [1, 10] |

## Response Format

### Success Response

```json
{
  "created": 1677649296,
  "background": "transparent",
  "data": [
    {
      "b64_json": null,
      "url": "https://example.com/image.png",
      "revised_prompt": "Revised prompt",
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

### Response Field Description

| Field | Type | Description |
|-------|------|-------------|
| `created` | integer | Unix timestamp |
| `background` | string | Background parameter (gpt-image-1 only) |
| `data` | array | List of generated images |
| `usage` | object | Token usage statistics (gpt-image-1 only) |

#### ImageData Object

| Field | Type | Description |
|-------|------|-------------|
| `b64_json` | string | Base64 encoded image data (when response_format=b64_json) |
| `url` | string | Image URL (when response_format=url) |
| `revised_prompt` | string | Revised prompt |
| `output_format` | string | Output format (gpt-image-1 only) |
| `quality` | string | Image quality |
| `size` | string | Image size |

#### Usage Object (gpt-image-1 only)

| Field | Type | Description |
|-------|------|-------------|
| `prompt_tokens` | integer | Total input token count |
| `input_tokens_details` | object | Detailed token statistics |

#### InputTokensDetails Object

| Field | Type | Description |
|-------|------|-------------|
| `text_tokens` | integer | Text token count |
| `image_tokens` | integer | Image token count |

## Request Examples

### Basic Example (DALL·E 2)

```bash
curl -X POST "https://api.example.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A cute orange cat sitting in sunlight",
    "model": "dall-e-2",
    "n": 1,
    "size": "1024x1024",
    "response_format": "url"
  }'
```

### High Quality Example (DALL·E 3)

```bash
curl -X POST "https://api.example.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Futuristic cityscape with neon lights, cyberpunk style",
    "model": "dall-e-3",
    "quality": "hd",
    "style": "vivid",
    "size": "1792x1024"
  }'
```

### GPT Image 1 Advanced Example

```bash
curl -X POST "https://api.example.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A blooming magnolia flower with blurred background, photography style",
    "model": "gpt-image-1",
    "background": "transparent",
    "output_format": "png",
    "output_compression": 85,
    "moderation": "low",
    "n": 2
  }'
```

### JavaScript Example

```javascript
const response = await fetch('https://api.example.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Van Gogh style starry night over a small town',
    model: 'dall-e-3',
    quality: 'hd',
    size: '1024x1024'
  })
});

const data = await response.json();
console.log('Generated image URL:', data.data[0].url);
```

### Python Example

```python
import requests
import json

url = "https://api.example.com/v1/images/generations"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

payload = {
    "prompt": "Watercolor style landscape painting with profound artistic conception",
    "model": "dall-e-3",
    "quality": "standard",
    "style": "natural",
    "size": "1024x1024"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
result = response.json()

print(f"Generated image URL: {result['data'][0]['url']}")
```

## Error Handling

### Common Error Codes

| Status Code | Error Type | Description | Solution |
|-------------|------------|-------------|----------|
| 400 | `invalid_request_error` | Invalid request parameters | Check required parameters and parameter format |
| 401 | `authentication_error` | Invalid API Key | Check Authorization header |
| 429 | `rate_limit_exceeded` | Request rate too high | Reduce request frequency or upgrade plan |
| 500 | `server_error` | Internal server error | Retry later |

### Error Response Example

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

## Billing Information

### Billing Models

Different models use different billing methods:

#### DALL·E 2 and Doubao
- Billed by number of generated images
- Different prices for different sizes

#### DALL·E 3
- Billed by number of generated images and quality
- Supports standard quality and HD quality

#### GPT Image 1
- **Image Generation Fee**: Billed by number of images, quality, and size
- **Token Fee**: Billed by input token count (including text and image tokens)

### Price Examples

The following are example prices (actual prices subject to platform announcement):

| Model | Quality | Size | Price/Image |
|-------|---------|------|-------------|
| DALL·E 2 | Standard | 256x256 | $0.016 |
| DALL·E 2 | Standard | 512x512 | $0.018 |
| DALL·E 2 | Standard | 1024x1024 | $0.020 |
| DALL·E 3 | Standard | 1024x1024 | $0.040 |
| DALL·E 3 | HD | 1024x1024 | $0.080 |
| GPT Image 1 | Low Quality | 1024x1024 | $0.020 |
| GPT Image 1 | Medium Quality | 1024x1024 | $0.040 |
| GPT Image 1 | High Quality | 1024x1024 | $0.080 |

### Token Billing (GPT Image 1)

- Text Tokens: $0.002 / 1K tokens
- Image Tokens: $0.010 / 1K tokens

## Best Practices

### 1. Prompt Optimization

- **Specific Description**: Use specific, detailed descriptions rather than vague concepts
- **Style Guidance**: Clearly specify artistic style, photography style, or painting technique
- **Composition Description**: Describe desired composition, angle, and perspective
- **Color and Lighting**: Specify tone, lighting conditions, and atmosphere

```text
// Before optimization
"A cat"

// After optimization  
"An orange short-haired cat sitting on a sunlit windowsill, with green plants in the background, warm tones, natural lighting, photography style"
```

### 2. Parameter Selection Recommendations

- **Quality Settings**:
  - Standard quality suitable for most scenarios
  - HD quality for scenes requiring fine details

- **Size Selection**:
  - Social media: 1024x1024
  - Banner ads: 1792x1024
  - Vertical posters: 1024x1792

### 3. Performance Optimization

- **Batch Generation**: Use `n` parameter to generate multiple images at once
- **Format Selection**: URL format transfers faster, Base64 format convenient for direct processing
- **Compression Settings**: Adjust compression level based on usage to balance quality and file size

### 4. Content Safety

- Follow platform content policies
- Use appropriate moderation levels
- Avoid descriptions that might trigger safety filters

## Frequently Asked Questions

### Q: Why doesn't the generated image exactly match the prompt?
A: AI models interpret and understand prompts, which may involve some creative interpretation. You can improve matching by using more specific descriptions.

### Q: How to improve consistency in image generation?
A:
- Use the same seed value (Volcano Engine protocol)
- Maintain consistency in prompts
- Use the same model and parameters

### Q: Can generated images be used commercially?
A: Please refer to specific terms of service and usage licenses. Generally, users have usage rights to generated images.

### Q: How to handle generation failures?
A:
- Check if prompts violate content policies
- Simplify complex prompts
- Retry or adjust parameters
- Contact technical support

---

**Note**: This documentation is written based on the current API version. Specific features and pricing may change with version updates. Please refer to the latest official documentation.
