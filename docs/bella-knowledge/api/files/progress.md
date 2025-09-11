# 获取文件/文档解析进度

**GET** `http(s)://{{Host}}/v1/files/{file_id}/progress?progress_name=document_parser`

文档解析 (document_parser)：将文件进行处理，实现非结构化文件( 如：pdf ) -> 结构化数据 (如：json) 的过程。你能够通过文档解析，得到结构化数据，用于LLM请求，进而实现类似\"LLM具备多模能力\"的效果

## 示例

**请求**
```bash
curl -L 'http(s)://{{Host}}/v1/files/{file_id}/progress?progress_name=document_parser' \
-H 'Authorization: Bearer $OPEN_API_KEY'
```

**响应**
```json
{
    "file_id": "file-2503041142310019000486-2075695711",
    "name": "document_parser",
    "status": "document_parse_finish",
    "percent": 100
}
```

当Http Code为非200（如4041则表示文档解析未开始）
当http code为 200，且percent达到100时，则表示文件/文档解析已完成，能够通过文档解析结果获取接口，得到dom-tree内容

## Path parameters

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `file_id` | string | Required | 要获取解析进度的文件ID。 |

## Query parameters

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `progress_name` | string | Required | 固定值：document_parser |

## Returns

| 字段 | 类型 | 说明 |
|-----|------|------|
| `file_id` | string | 文件id。 |
| `name` | string | 固定为的 `document_parser` |
| `status` | string | 文件解析状态 |
| `percent` | number | 进度。100表示100%，即完成 |

## 文件解析状态值

| 值 | 含义 |
|---|-----|
| `document_parse_begin` | 开始解析 |
| `document_parse_layout_finish` | layout解析完毕 |
| `document_parse_domtree_finish` | domtree解析完毕 |
| `document_parse_finish` | 全部解析完毕 |
| `document_parse_fail` | 解析失败 |
