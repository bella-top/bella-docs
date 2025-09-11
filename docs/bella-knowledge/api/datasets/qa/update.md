# 更新QA问答对

**POST** `http(s)://{{Host}}/v1/datasets/qa/update`

更新现有的问答对信息。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/qa/update' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "dataset_id": "dataset-123456789",
    "item_id": "qa-item-123",
    "answer": "更新后的答案内容..."
}'
```

## Request Body
Content-Type: `application/json`

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `dataset_id` | string | Required | 数据集ID |
| `item_id` | string | Required | QA条目ID |
| 其他字段 | | Optional | 与创建接口相同，可选择性更新 |

## Returns
更新后的QA对象。
