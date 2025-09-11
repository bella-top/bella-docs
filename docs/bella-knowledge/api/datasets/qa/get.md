# 获取QA问答对

**POST** `https://knowledge.bella.top/v1/datasets/qa/get`

获取指定问答对的详细信息。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/qa/get' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "dataset_id": "dataset-123456789",
    "item_id": "qa-item-123"
}'
```

## Request Body
Content-Type: `application/json`

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `dataset_id` | string | Required | 数据集ID |
| `item_id` | string | Required | QA条目ID |

## Returns
QA对象详细信息。
