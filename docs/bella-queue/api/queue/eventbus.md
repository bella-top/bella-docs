# 获取事件总线配置

**GET** `http(s)://{{Host}}/v1/queue/eventbus`

## 示例

**请求**

```bash
curl -X GET "https://${Host}/v1/queue/eventbus" \
  -H "Authorization: Bearer ${apikey}"
```

**响应**

```json
{
  "url": "redis://localhost:6379",
  "topic": "bella:eventbus:"
}
```

## Returns

```json
{
  "url": "eventbus地址",
  "topic": "eventbus主题前缀"
}
```

返回用于连接Redis事件总线的配置信息，Worker可使用此配置连接到Redis Streams进行实时任务通信。
