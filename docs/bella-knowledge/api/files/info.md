# 文件路径

**POST** `http(s)://{{Host}}/v1/files/{file_id}/info`

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/files/{file_id}/info' \
--header 'Authorization: Bearer $OPEN_API_KEY'
```

**响应**
```json
{
    "id": "${file_id}",
    "object": "file",
    "path": "${path_of_the_file}"
}
```

## Path parameters

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `file_id` | string | Required | 要获取路径的文件ID。 |

## Returns
带有`path`字段的File对象。
