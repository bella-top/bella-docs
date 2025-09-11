# 获取文件url

**GET** `http(s)://{{Host}}/v1/files/{file_id}/url`

## 示例

**请求**
```bash
curl -L 'http(s)://{{Host}}/v1/files/{file_id}/url' \
-H 'Authorization: Bearer $OPEN_API_KEY'
```

**响应**
```json
{
    "url": "http://test-storage.lianjia.com/test/assistants/file-2412171824220019000001-277459125.jpg"
}
```

## Path parameters

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `file_id` | string | Required | 要获取url的文件ID。 |

## Query parameters

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `expires` | string | Optional | 链接过期时间，单位为秒。（适用于需要加签的链接，不需要加签的链接没有过期时间）默认过期时间为1天。 |

## Returns
文件对应的url，通过此url可以下载文件。
