# 创建数据集

**POST** `https://knowledge.bella.top/v1/datasets/create`

创建新的数据集。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/create' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "name": "测试数据集",
    "type": "qa",
    "remark": "用于测试的QA数据集"
}'
```

**响应**
```json
{
    "dataset_id": "dataset-123456789",
    "name": "测试数据集",
    "type": "qa",
    "remark": "用于测试的QA数据集",
    "created_at": 1734529865000,
    "updated_at": 1734529865000
}
```

## Request Body
Content-Type: `application/json`

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `name` | string | Required | 数据集名称，不能为空 |
| `type` | string | Required | 数据集类型，可选值：`qa`、`document` |
| `remark` | string | Optional | 数据集备注说明 |

## Returns
创建的数据集对象。

## 数据集类型

系统目前支持两种数据集类型：
- `qa`: 问答对数据集，用于存储问题和答案
- `document`: 文档数据集，用于存储文档文件
