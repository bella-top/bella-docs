# 导出数据集

**GET** `http(s)://{{Host}}/v1/datasets/export`

将QA数据集导出为JSONL格式文件。

## 示例

**请求**
```bash
curl -L 'http(s)://{{Host}}/v1/datasets/export?dataset_id=dataset-123456789&expires=3600' \
--header 'Authorization: Bearer $OPEN_API_KEY'
```

**响应**
```json
{
    "url": "https://storage.example.com/exports/dataset-123456789.jsonl"
}
```

## Query parameters

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|-----|------|------|--------|------|
| `dataset_id` | string | Required | | 要导出的数据集ID |
| `expires` | integer | Optional | 3600 | 下载链接过期时间（秒） |

## Returns
包含下载URL的对象。

> 注意：系统会缓存导出文件，如果数据集没有更新，会返回缓存的文件链接
