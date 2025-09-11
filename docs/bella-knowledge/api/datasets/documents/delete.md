# 从数据集删除文档

**POST** `http(s)://{{Host}}/v1/datasets/documents/delete`

从数据集中删除指定文档。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/documents/delete' \
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
| `file_id` | string | Required | 要删除的文件ID |

## Returns
删除的文档对象。
