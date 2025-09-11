# 获取数据集文档信息

**POST** `https://knowledge.bella.top/v1/datasets/documents/get`

获取数据集中指定文档的信息。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/documents/get' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "dataset_id": "dataset-123456789",
    "file_id": "file-123456789"
}'
```

## Request Body
Content-Type: `application/json`

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `dataset_id` | string | Required | 数据集ID |
| `file_id` | string | Required | 文件ID |

## Returns
文档对象详细信息。
