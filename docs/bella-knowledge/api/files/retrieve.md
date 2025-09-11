# 检索文件/目录

**GET** `https://knowledge.bella.top/v1/files/{file_id}`

返回指定文件的信息。

## 示例

**请求**
```bash
curl -L 'https://knowledge.bella.top/v1/files/{file_id}' \
-H 'Authorization: Bearer $OPEN_API_KEY'
```

**响应**
```json
{
    "id": "file-2412182151040021019136-277459125",
    "object": "file",
    "bytes": 640549,
    "created_at": 1734529865000,
    "filename": "test.jpg",
    "purpose": "vision"
}
```

## Path parameters

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `file_id` | string | Required | 请求的文件的ID。 |

## Returns
ID为file_id的文件对象。