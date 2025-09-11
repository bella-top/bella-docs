# 删除QA问答对

**POST** `http(s)://{{Host}}/v1/datasets/qa/delete`

删除指定的问答对。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/qa/delete' \
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
| `item_id` | string | Required | 要删除的QA条目ID |

## Returns
删除的QA对象。
