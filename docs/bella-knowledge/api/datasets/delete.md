# 删除数据集

**POST** `http(s)://{{Host}}/v1/datasets/delete`

删除指定的数据集。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/delete' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "dataset_id": "dataset-123456789"
}'
```

## Request Body
Content-Type: `application/json`

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `dataset_id` | string | Required | 要删除的数据集ID |

## Returns
删除的数据集对象。
