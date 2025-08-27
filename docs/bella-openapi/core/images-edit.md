# 图片编辑功能用户手册

## 概述

Bella OpenAPI 提供了统一的图片编辑接口 `/v1/images/edits`，该接口通过协议适配器模式支持多个 AI 服务提供商的图片编辑功能，包括 OpenAI、火山引擎等。该接口可以让您通过文本描述来编辑现有图片的特定区域。

## API 端点信息

- **URL**: `/v1/images/edits`
- **方法**: `POST`
- **内容类型**: `multipart/form-data`
- **认证**: 需要有效的 API 密钥

## 请求参数

### 必需参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `prompt` | string | 描述所需图片编辑效果的文本。最大长度为 1000 个字符。 |

### 图片输入参数（三选一）

| 参数 | 类型 | 描述 |
|------|------|------|
| `image` | MultipartFile | 要编辑的图片文件。必须是有效的 PNG 文件，小于 4MB，且为正方形。如果未提供 mask，图片必须具有透明度，该透明度将用作 mask。 |
| `image_url` | string | 要编辑的图片的 URL 地址。必须是有效的 PNG 文件，小于 4MB，且为正方形。 |
| `image_b64_json` | string | 要编辑的图片的 base64 编码 JSON 格式。必须是有效的 PNG 文件，小于 4MB，且为正方形。 |

### 可选参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `mask` | MultipartFile | - | 一个额外的图片，其完全透明的区域（例如 alpha 为零的地方）指示应该编辑图片的位置。必须是有效的 PNG 文件，小于 4MB，且与 image 具有相同的尺寸。 |
| `model` | string | 默认模型 | 用于图片编辑的模型名称。 |
| `n` | integer | 1 | 要生成的图片数量。必须在 1 到 10 之间。 |
| `size` | string | - | 生成图片的尺寸。必须是 256x256、512x512 或 1024x1024 之一。 |
| `response_format` | string | url | 返回生成图片的格式。必须是 `url` 或 `b64_json` 之一。 |
| `user` | string | - | 代表最终用户的唯一标识符，可以帮助监控和检测滥用。 |

## 响应格式

### 成功响应

```json
{
  "background": "transparent",
  "created": 1697234567,
  "data": [
    {
      "b64_json": "base64编码的图片数据（当response_format=b64_json时）",
      "url": "https://example.com/edited-image.png",
      "revised_prompt": "修订后的提示词（如有）",
      "output_format": "png",
      "quality": "high",
      "size": "1024x1024"
    }
  ],
  "usage": {
    "num": 1,
    "size": "1024x1024",
    "quality": "high",
    "input_tokens": 50,
    "input_tokens_details": {
      "image_tokens": 40,
      "text_tokens": 10
    },
    "output_tokens": 1024,
    "total_tokens": 1074
  }
}
```

### 错误响应

```json
{
  "error": {
    "code": "400",
    "message": "请求参数格式错误，请使用以下支持的图像上传方式：文件上传",
    "type": "Illegal Argument"
  }
}
```

## 认证

所有请求都需要在请求头中包含有效的 API 密钥：

```
Authorization: Bearer YOUR_API_KEY
```

## 使用示例

### 使用文件上传编辑图片

```bash
curl -X POST "https://your-domain.com/v1/images/edits" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image=@/path/to/your/image.png" \
  -F "mask=@/path/to/your/mask.png" \
  -F "prompt=Remove the red car from the image" \
  -F "n=1" \
  -F "size=1024x1024" \
  -F "response_format=url"
```

### 使用 URL 输入编辑图片

```bash
curl -X POST "https://your-domain.com/v1/images/edits" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image_url=https://example.com/original-image.png" \
  -F "prompt=Change the sky to be cloudy" \
  -F "model=dall-e-2" \
  -F "response_format=b64_json"
```

### 使用 Base64 编码编辑图片

```bash
curl -X POST "https://your-domain.com/v1/images/edits" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image_b64_json=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." \
  -F "prompt=Add flowers to the garden" \
  -F "n=2" \
  -F "size=512x512"
```

### JavaScript 示例

```javascript
const formData = new FormData();
formData.append('image', imageFile);
formData.append('prompt', 'Replace the background with a sunset');
formData.append('n', '1');
formData.append('size', '1024x1024');
formData.append('response_format', 'url');

fetch('/v1/images/edits', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('编辑后的图片:', data.data[0].url);
})
.catch(error => {
  console.error('错误:', error);
});
```

### Python 示例

```python
import requests

url = "https://your-domain.com/v1/images/edits"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

files = {
    'image': open('original.png', 'rb'),
    'mask': open('mask.png', 'rb')
}

data = {
    'prompt': 'Remove the unwanted object from the image',
    'n': 1,
    'size': '1024x1024',
    'response_format': 'url'
}

response = requests.post(url, headers=headers, files=files, data=data)
result = response.json()

if 'data' in result:
    print(f"编辑后的图片 URL: {result['data'][0]['url']}")
else:
    print(f"错误: {result['error']['message']}")
```

## 图片格式要求

### 支持的图片格式
- **PNG**: 主要支持的格式
- **输入图片**: 必须是 PNG 格式
- **遮罩图片**: 必须是 PNG 格式

### 图片尺寸限制
- **文件大小**: 最大 4MB
- **尺寸**: 必须为正方形
- **支持的分辨率**: 256x256, 512x512, 1024x1024

### 透明度要求
- 如果未提供遮罩文件，原图必须包含透明度信息
- 遮罩文件使用透明区域（alpha = 0）标识需要编辑的区域

## 错误处理

### 常见错误代码

| 错误代码 | 描述 | 解决方案 |
|----------|------|----------|
| 400 | 请求参数错误 | 检查图片格式、大小和必需参数 |
| 401 | 认证失败 | 检查 API 密钥是否有效 |
| 413 | 文件过大 | 确保图片文件小于 4MB |
| 429 | 请求过于频繁 | 降低请求频率 |
| 500 | 服务器内部错误 | 稍后重试或联系技术支持 |

### 参数验证错误示例

```json
{
  "error": {
    "code": "400",
    "message": "请求参数格式错误，请使用以下支持的图像上传方式：文件上传 URL链接 Base64编码",
    "type": "Illegal Argument"
  }
}
```

## 最佳实践

### 1. 图片准备
- 使用高质量的 PNG 图片作为输入
- 确保图片为正方形比例
- 如需精确控制编辑区域，准备清晰的遮罩文件

### 2. 提示词优化
- 使用清晰、具体的描述
- 避免模糊或矛盾的指令
- 限制在 1000 个字符以内

### 3. 性能优化
- 合理设置图片尺寸，避免不必要的高分辨率
- 批量处理时控制并发请求数量
- 使用适当的 `response_format` 减少传输成本

### 4. 错误处理
- 实现重试机制处理临时错误
- 验证文件格式和大小再发送请求
- 记录详细的错误日志便于调试

## 配置说明

### 渠道配置
不同的 AI 服务提供商支持不同的输入方式：

```json
{
  "supportFile": true,     // 支持文件上传
  "supportUrl": false,     // 支持 URL 输入
  "supportBase64": false   // 支持 Base64 编码输入
}
```

### 系统限制
- 最大文件上传大小: 4MB (配置在 application.yml)
- 最大请求大小: 4MB
- 并发限制: 根据 API 密钥和渠道配置动态调整

## 监控和调试

### 请求追踪
- 每个请求都会生成唯一的追踪 ID
- 可通过日志系统查看详细的请求处理过程
- 支持实时监控请求成功率和响应时间

### 使用统计
- 自动计算和记录图片编辑的使用量
- 提供详细的 token 消耗统计
- 支持按用户、模型、时间段的使用分析

## 技术支持

如果在使用过程中遇到问题，请：

1. 检查 API 文档确保参数正确
2. 查看错误响应中的详细信息
3. 确认网络连接和认证配置
4. 联系技术支持团队获得帮助
