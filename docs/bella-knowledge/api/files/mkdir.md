# 创建目录

**POST** `https://knowledge.bella.top/v1/files/mkdir`

> 声明：目录实体依然对应 File对象，适用于本文档接口；除 `获取文件内容`、`获取文件url`、`删除文件` 外

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/files/mkdir' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "name": "${name_of_the_directory}",
    "ancestor_id": null
}'
```

**响应**
```json
{
    "id": "${file_id}",
    "object": "file",
    "filename": "${name_of_the_directory}"
}
```

## Request Body
Content-Type: `application/json`

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|-----|------|------|--------|------|
| `ancestor_id` | string | Optional | `null` | 父目录id。将此目录创建到父目录下。`null` 表示根目录 |
| `name` | string | Required | | 目录名。 |

## Returns
创建后的File对象。
