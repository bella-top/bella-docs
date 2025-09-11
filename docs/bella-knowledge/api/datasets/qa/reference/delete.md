# 删除QA引用

**POST** `https://knowledge.bella.top/v1/datasets/qa/reference/delete`

删除QA引用。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/qa/reference/delete' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "dataset_id": "dataset-123456789",
    "reference_id": "ref-123456789"
}'
```

## Request Body
Content-Type: `application/json`

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `dataset_id` | string | Required | 数据集ID |
| `reference_id` | string | Required | 要删除的引用ID |

## Returns
删除的引用对象。
