# 列出QA引用（不分页）

**POST** `https://knowledge.bella.top/v1/datasets/qa/reference/list`

获取所有QA引用（不分页）。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/qa/reference/list' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "dataset_id": "dataset-123456789",
    "order": "desc",
    "order_by": "ctime"
}'
```

## Request Body
Content-Type: `application/json`

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|-----|------|------|--------|------|
| `dataset_id` | string | Required | | 数据集ID |
| `order` | string | Optional | desc | 排序方式：`asc`、`desc` |
| `order_by` | string | Optional | ctime | 排序字段：`ctime`、`mtime` |

## Returns
QA引用对象列表。
