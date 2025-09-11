# 更新数据集

**POST** `https://knowledge.bella.top/v1/datasets/update`

更新现有数据集信息。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/update' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "dataset_id": "dataset-123456789",
    "name": "更新后的数据集名称",
    "remark": "更新后的备注"
}'
```

## Request Body
Content-Type: `application/json`

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `dataset_id` | string | Required | 数据集ID，不能为空 |
| `name` | string | Optional | 新的数据集名称 |
| `remark` | string | Optional | 新的备注说明 |

> 注意：数据集类型（type）创建后不能修改

## Returns
更新后的数据集对象。
