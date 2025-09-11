# 分页查询数据集

**POST** `https://knowledge.bella.top/v1/datasets/page`

分页获取数据集列表。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/page' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
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
| `page` | integer | Optional | 1 | 页码，从1开始 |
| `page_size` | integer | Optional | 10 | 每页数量 |
| `order` | string | Optional | desc | 排序方式，可选值：`asc`、`desc` |
| `order_by` | string | Optional | ctime | 排序字段，可选值：`ctime`（创建时间）、`mtime`（修改时间） |

## Returns
分页的数据集列表。
