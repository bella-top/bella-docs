# 文档解析结果获取

**POST** `http(s)://{{Host}}/v1/files/{file_id}/dom-tree/url`

在file api内，文档解析后的结构统一称为dom-tree。当前仅：\"pdf\" \"doc\" \"docx\" \"txt\" \"html\" \"csv\" \"md\" \"xlsx\" \"xls\" 类型支持dom-tree结果获取

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/files/{file_id}/dom-tree/url' \
--header 'Authorization: Bearer $OPEN_API_KEY'
```

**响应**
```json
{
    "url": "${url_of_the_dom_tree_file}"
}
```

## Path parameters

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `file_id` | string | Required | 要获取路径的文件ID。 |

## Returns
dom-tree的url。
