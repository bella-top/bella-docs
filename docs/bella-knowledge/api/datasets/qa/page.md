# 分页查询QA问答对

**POST** `http(s)://{{Host}}/v1/datasets/qa/page`

分页获取数据集中的问答对列表。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/qa/page' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "dataset_id": "dataset-123456789",
    "page": 1,
    "page_size": 20,
    "order": "desc",
    "order_by": "ctime"
}'
```

## Request Body
Content-Type: `application/json`

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|-----|------|------|--------|------|
| `dataset_id` | string | Required | | 数据集ID |
| `page` | integer | Optional | 1 | 页码 |
| `page_size` | integer | Optional | 10 | 每页数量 |
| `order` | string | Optional | desc | 排序方式：`asc`、`desc` |
| `order_by` | string | Optional | ctime | 排序字段：`ctime`、`mtime` |

## Returns
分页的QA对象列表。
