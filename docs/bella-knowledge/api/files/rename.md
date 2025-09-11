# 重命名

**POST** `http(s)://{{Host}}/v1/files/{file_id}/rename`

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/files/{file_id}/rename' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--form 'filename="${the_name_you_want_to_rename}"'
```

**响应**
```json
{
    "id": "${file_id}",
    "object": "file",
    "filename": "${the_name_you_want_to_rename}"
}
```

## Path parameters

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `file_id` | string | Required | 要重命名的文件ID。 |

## Request Body
Content-Type: `multipart/form-data`

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `filename` | string | Required | 新的文件名 |

## Returns
重命名后的File对象。
