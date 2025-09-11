# OpenAI 兼容性

Bella-Knowledge 提供了与 OpenAI Files API 的兼容性，使得开发者可以无缝迁移现有的 OpenAI 应用。

## 兼容的 API 接口

### File API 兼容性

- **上传文件**: `POST /v1/files`
- **列出文件**: `GET /v1/files`
- **检索文件**: `GET /v1/files/{file_id}`
- **删除文件**: `DELETE /v1/files/{file_id}`
- **获取文件内容**: `GET /v1/files/{file_id}/content`

### 扩展功能

Bella-Knowledge 在兼容 OpenAI API 的基础上，提供了额外的增强功能：

- **目录管理**: 支持文件夹组织结构
- **文件重命名**: 支持文件重命名操作
- **文档解析**: 支持多格式文档解析
- **数据集管理**: 支持 QA 和文档数据集

## 使用示例

### 从 OpenAI 迁移

如果你现在使用 OpenAI Files API：

```python
# OpenAI 原始代码
from openai import OpenAI
client = OpenAI(api_key="your-openai-key")

file = client.files.create(
    file=open("example.txt", "rb"),
    purpose="assistants"
)
```

只需要修改 base_url：

```python
# 使用 Bella-Knowledge
from openai import OpenAI
client = OpenAI(
    api_key="your-bella-key",
    base_url="http(s)://{{Host}}/v1"
)

file = client.files.create(
    file=open("example.txt", "rb"),
    purpose="assistants"
)
```

## 差异说明

虽然 Bella-Knowledge 与 OpenAI Files API 高度兼容，但在某些细节上存在差异：

1. **文件大小限制**: 512MB（OpenAI 为 100MB）
2. **额外参数**: 支持 `ancestor_id`、`overwrite` 等参数
3. **扩展 API**: 提供了更多的文件管理功能

## 最佳实践

1. **逐步迁移**: 先在测试环境中验证兼容性
2. **参数检查**: 确认使用的参数在 Bella-Knowledge 中受支持
3. **错误处理**: 根据 Bella-Knowledge 的错误码调整错误处理逻辑
