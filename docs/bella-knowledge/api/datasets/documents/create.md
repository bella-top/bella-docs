# 添加文档到数据集

**POST** `https://knowledge.bella.top/v1/datasets/documents/create`

将一个或多个文件添加到文档类型数据集。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/documents/create' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "dataset_id": "dataset-123456789",
    "file_ids": ["file-123", "file-456", "file-789"]
}'
```

## Request Body
Content-Type: `application/json`

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `dataset_id` | string | Required | 数据集ID（必须是document类型） |
| `file_ids` | array | Required | 要添加的文件ID数组，不能为空 |

## Returns
添加的文档对象列表。
