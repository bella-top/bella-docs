# 导入数据集

**POST** `https://knowledge.bella.top/v1/datasets/import`

从 Excel 或 CSV 文件导入 QA 数据到数据集。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/import' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--form 'file_id="file-123456789"' \
--form 'dataset_id="dataset-123456789"'
```

或创建新数据集并导入：
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/import' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--form 'file_id="file-123456789"' \
--form 'dataset_name="新建QA数据集"' \
--form 'remark="从Excel文件导入的QA数据"'
```

## Request Body
Content-Type: `multipart/form-data`

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `file_id` | string | Required | 要导入的文件ID（Excel或CSV格式） |
| `dataset_id` | string | Optional | 目标数据集ID，如果不提供则创建新数据集 |
| `dataset_name` | string | Optional | 新数据集名称（当dataset_id为空时必需） |
| `remark` | string | Optional | 数据集备注 |

> 注意：
> - 支持的文件格式：`.xlsx`、`.xls`、`.csv`
> - 导入过程是异步的，可通过文件进度接口查看导入状态
> - 如果不提供dataset_id，则必须提供dataset_name来创建QA类型数据集

## Returns
数据集对象（新创建或现有的）。
