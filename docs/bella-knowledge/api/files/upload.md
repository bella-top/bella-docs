# 上传文件

**POST** `http(s)://{{Host}}/v1/files`

上传文件。文件大小限制为512MB。

> 对于`purpose`为`assistants`的文件，file-api系统会为文件进行一些后处理逻辑，后处理是将文件作用于其他文件的关键，详情请参考 `文件后处理`章节

## 示例

**请求**
```bash
curl -L 'http(s)://{{Host}}/v1/files' \
-H 'Authorization: Bearer $OPEN_API_KEY' \
-F 'file=@"test.jpg;type=image/jpg"' \
-F 'purpose="vision"' \
-F 'metadata="{}"'
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

## Request Body
Content-Type: `multipart/form-data`

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `file` | file | Required | 需要上传的文件（注意不是文件名）。（同时可选择指定media-type，file api才能正确解析文件类型，例如：type=image/[png\|jpeg\|jpg\|webp\|gif\|...]；响应体中type正确返回则证明使用正确） |
| `purpose` | string | Required | 上传文件的预期用途。可选项有batch、visioin、assistants、fine-tune等。 |
| `metadata` | string | Optional | 文件元数据，由用户自定义，file-api只做透传。`{}` map格式 |
| `ancestor_id` | string | Optional (默认 `null`) | 父目录id。将文件上传到此目录下。`null` 则表示根目录 |
| `overwrite` | boolean | Optional (默认 `false`) | 是否覆盖同目录下的同名文件。如果 `false` 但已存在同名文件，则文件会上传失败 |

## Returns
已上传的File对象。

对于`purpose`为`assistants`的文件，file-api系统会为文件进行一些后处理逻辑，后处理是将文件作用于其他文件的关键，详情请参考 `文件后处理`章节
