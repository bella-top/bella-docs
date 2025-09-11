# 创建QA引用

**POST** `http(s)://{{Host}}/v1/datasets/qa/reference/create`

为QA问答对添加文件引用。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/qa/reference/create' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "dataset_id": "dataset-123456789",
    "item_id": "qa-item-123",
    "file_id": "file-123456789",
    "path": "/documents/reference.pdf"
}'
```

## Request Body
Content-Type: `application/json`

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `dataset_id` | string | Required | 数据集ID |
| `item_id` | string | Required | QA条目ID |
| `file_id` | string | Required | 引用的文件ID |
| `path` | string | Optional | 文件路径 |

## Returns
创建的引用对象。
