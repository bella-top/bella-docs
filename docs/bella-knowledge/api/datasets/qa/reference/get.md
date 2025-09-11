# 获取QA引用

**POST** `https://knowledge.bella.top/v1/datasets/qa/reference/get`

获取指定的QA引用信息。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/qa/reference/get' \
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
| `reference_id` | string | Required | 引用ID |

## Returns
QA引用对象详细信息。
