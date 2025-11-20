# Get Event Bus Configuration

**GET** `http(s)://{{Host}}/v1/queue/eventbus`

## Example

**Request**

```bash
curl -X GET "https://${Host}/v1/queue/eventbus" \
  -H "Authorization: Bearer ${apikey}"
```

**Response**

```json
{
  "url": "redis://localhost:6379",
  "topic": "bella:eventbus:"
}
```

## Returns

```json
{
  "url": "Event bus address",
  "topic": "Event bus topic prefix"
}
```

Returns configuration information for connecting to the Redis event bus. Workers can use this configuration to connect to Redis Streams for real-time task communication.