# 创建QA问答对

**POST** `https://knowledge.bella.top/v1/datasets/qa/create`

在数据集中创建新的问答对。

## 示例

**请求**
```bash
curl --location 'http(s)://{{Host}}/v1/datasets/qa/create' \
--header 'Authorization: Bearer $OPEN_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "dataset_id": "dataset-123456789",
    "question": "什么是人工智能？",
    "answer": "人工智能是计算机科学的一个分支...",
    "similar_q1": "AI是什么？",
    "similar_q2": "人工智能的定义是什么？",
    "reasoning": "基于常见的AI定义回答",
    "scoring_criteria": "准确性和完整性",
    "tags": ["AI", "基础概念"]
}'
```

## Request Body
Content-Type: `application/json`

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `dataset_id` | string | Required | 数据集ID |
| `question` | string | Required | 问题内容，不能为空 |
| `answer` | string | Optional | 答案内容 |
| `similar_q1` | string | Optional | 相似问题1 |
| `similar_q2` | string | Optional | 相似问题2 |
| `similar_q3` | string | Optional | 相似问题3 |
| `reasoning` | string | Optional | 推理过程 |
| `scoring_criteria` | string | Optional | 评分标准 |
| `tags` | array | Optional | 标签数组 |

## Returns
创建的QA对象。
