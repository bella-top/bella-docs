# 列出文件、目录（不分页）

**POST** `http(s)://{{Host}}/v1/files/find`

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/files/find' \
--header 'Authorization: Bearer $OPEN_API_KEY'
```

**响应**
```json
{
    "id": "${file_id}",
    "object": "file",
    "filename": "${filename}"
}
```

## Query parameters

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|-----|------|------|--------|------|
| `ancestor_id` | string | Optional | `null` | 父目录id。表示列出该目录下的文件。`null` 则表示根目录 |

## Returns
File对象列表。
