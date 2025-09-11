# 获取文件内容（下载文件）

**GET** `http(s)://{{Host}}/v1/files/{file_id}/content`

## 示例

**请求**
```bash
curl -L 'http(s)://{{Host}}/v1/files/{file_id}/content' \
-H 'Authorization: Bearer $OPEN_API_KEY'
```

## Path parameters

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `file_id` | string | Required | 要获取的文件ID。 |

## Returns
文件内容。
