# 列出文件/目录

**GET** `https://knowledge.bella.top/v1/files`

返回文件列表。

## 示例

**请求**
```bash
curl -L 'https://knowledge.bella.top/v1/files' \
-H 'Authorization: Bearer $OPEN_API_KEY'
```

**响应**
```json
{
    "data": [
        {
            "id": "file-2412182151040021019136-277459125",
            "bytes": 640549,
            "created_at": 1734529865000,
            "filename": "test.jpg",
            "purpose": "vision"
        },
        {
            "id": "file-2412182150490020018937-277459125",
            "bytes": 0,
            "created_at": 1734529850000,
            "filename": "文件.md",
            "purpose": "vision"
        }
    ],
    "object": "list",
    "last_id": "file-2412182150490020018938-277459125",
    "has_more": true
}
```

## Query parameters

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|-----|------|------|--------|------|
| `ancestor_id` | string | Optional | `null` | 父目录id。表示列出该目录下的文件。`null` 则表示根目录 |
| `purpose` | string | Optional | | 只列出特定purpose的文件。不加此参数默认列出所有purpose文件。 |
| `limit` | integer | Optional | 10000 | 返回对象数量的限制。取值范围[1,10000]，默认为10000。 |
| `order` | string | Optional | desc | 按照对象的created_at时间戳排序。asc按升序排列，desc按降序排列。 |
| `after` | string | Optional | | 用于分页的游标。after是用于定位分页位置的对象ID。如上述响应示例中，传入after=file-2412182150490020018938-277459125可以查询下一页。 |

## Returns
File对象列表。