# 分页查询QA引用

**POST** `http(s)://{{Host}}/v1/datasets/qa/reference/page`

分页获取QA引用列表。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/qa/reference/page' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "dataset_id": "dataset-123456789",
    "page": 1,
    "page_size": 10,
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
分页的QA引用列表。
