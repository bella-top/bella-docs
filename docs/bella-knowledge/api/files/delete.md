# 删除文件

**DELETE** `https://knowledge.bella.top/v1/files/{file_id}`

删除指定的文件。

## 示例

**请求**
```bash
curl -L -X DELETE 'https://knowledge.bella.top/v1/files/{file_id}' \
-H 'Authorization: Bearer $OPEN_API_KEY'
```

**响应**
```json
{
    "id": "file-2412191144590019000002-277459125",
    "object": "file",
    "deleted": true
}
```

## Path parameters

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `file_id` | string | Required | 要删除的文件的ID。 |

## Returns
被删除的文件信息。