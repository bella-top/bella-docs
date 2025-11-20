# 清空队列

**POST** `http(s)://{{Host}}/v1/console/{fullQueueName}/clear`

## 示例

**请求**

```bash
curl -X POST "https://${Host}/v1/console/test-queue:1/clear" \
  -H "Authorization: Bearer ${apikey}"
```

**响应**

```bash
"test-queue:1"
```

## Path Parameters

| 参数              | 类型     | 必需       | 说明         |
|-----------------|--------|----------|------------|
| `fullQueueName` | string | Required | 要清空的队列完整名称 |

## 功能说明

此接口会执行以下操作：

1. **刷新队列统计**: 更新队列头部的统计信息到最新状态
2. **移动扫描头**: 将扫描头位置移动到最新位置，跳过所有待处理任务
3. **清空Redis队列**: 清空Redis中该队列的所有待处理任务

## Returns

```bash
"队列名称"
```
