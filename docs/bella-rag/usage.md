# RAG使用指南

本文档详细介绍如何部署、配置和使用Bella-RAG系统。

## ⚡ 快速开始

### 🐋 Docker Compose 一键部署（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/LianjiaTech/bella-rag

# 2. 配置环境变量（可选）
export OPENAI_API_KEY="your_openai_api_key"
export OPENAI_API_BASE="https://api.openai.com/v1"

# 3. 启动所有服务
docker-compose up -d

# 4. 检查服务状态
docker-compose ps

# 5. 验证服务健康状态
curl http://localhost:8008/api/actuator/health/liveness
```

### 🔧 向量数据库配置

#### 使用Qdrant（默认配置）
```bash
# 默认使用Qdrant，无需额外配置
docker-compose up -d
```

#### 使用腾讯云向量数据库
```bash
# 编辑配置文件 conf/config_release.ini：
[VECTOR_DB]
type = tencent  # 改为 tencent

[TENCENT_VECTOR_DB]
url = your_tencent_vectordb_url
key = your_api_key
database_name = your_database
# ... 其他配置
```

## 📝 基本使用示例

### 1. 文档索引

首先需要将文档上传并建立索引：

```bash
curl --location 'http://localhost:8008/api/file/stream/indexing' \
  --header 'Authorization: Bearer {OPEN_API_KEY}' \
  --header 'Content-Type: multipart/form-data' \
  --form 'file_id="FILE_ID"' \
  --form 'file_name="test.txt"' \
  --form 'user="user_001"' \
  --form 'file=@"/path/to/file"'
```

### 2. 知识检索

使用检索接口获取相关文档片段：

```bash
curl --location 'http://localhost:8008/api/rag/search' \
  --header 'Authorization: Bearer {OPEN_API_KEY}' \
  --header 'Content-Type: application/json' \
  --data '{
    "query": "你好",
    "scope": [
        {
            "type": "file",
            "ids": [
                "FILE_ID"
            ]
        }
    ],
    "limit": 3,
    "user": "user_00000000",
    "mode": "ultra"
}'
```

### 3. 检索增强问答

使用RAG chat接口进行问答：

```bash
curl --location 'http://localhost:8008/api/rag/chat' \
  --header 'Authorization: Bearer {OPEN_API_KEY}' \
  --header 'Content-Type: application/json' \
  --data '{
    "query": "机器学习的主要算法有哪些？",
    "scope": [
        {
            "type": "file",
            "ids": ["file_123","file_456"]
        }
    ],
    "user": "user_00000000",
    "response_type": "blocking",
    "model": "gpt-4o",        
    "mode": "normal"
}'
```

## 🔧 检索模式详解

Bella-RAG提供四种检索模式，满足不同场景需求：

### Fast模式 - 轻量搜索
- **适用场景**: 追求速度，对结果精度要求不高
- **策略配置**: 语义检索，无重排器，最大补全策略
- **特点**: 响应最快，资源消耗最少

### Normal模式 - 精准搜索  
- **适用场景**: 平衡速度和质量，满足大多数需求
- **策略配置**: 语义检索，有重排器，最大补全策略
- **特点**: 平衡效果与性能

### Ultra模式 - 全能搜索
- **适用场景**: 高精度需求，支持图片理解
- **策略配置**: 混合检索（向量+关键词），有重排器，上下文补全策略，支持图片内容识别
- **特点**: 效果最佳，支持多模态

### Deep模式 - 智能Agent搜索
- **适用场景**: 复杂问题分析，多步骤推理
- **策略配置**: 使用Planning and Solve的agent执行pipeline
- **特点**: 智能化程度最高，适合复杂查询，耗时较长

## 🎯 高级特性

### Contextual RAG增强

Bella-RAG支持先进的Contextual RAG技术：
- **上下文预处理**: 为每个chunk添加文档级别的上下文描述
- **智能摘要**: 自动生成文档结构和主题信息
- **提升检索准确率**: 减少断章取义，提升语义理解能力

### 异步处理支持

支持与file-api集成的异步任务处理：
- **Kafka消息队列**: 支持大规模文档批量处理
- **任务状态跟踪**: 实时监控索引进度
- **错误重试机制**: 自动处理临时性错误

## 🐛 故障排除

### 常见问题

1. **服务启动失败**
   - 检查Docker和Docker Compose版本
   - 确保端口8008、3306、6379、6333等未被占用
   - 查看日志：`docker-compose logs`

2. **Elasticsearch连接失败**
   - 确保Elasticsearch服务正常启动
   - 检查网络连接和配置

3. **向量数据库连接问题**
   - 验证API密钥和URL配置
   - 检查网络连通性

4. **内存不足**
   - 确保系统可用内存 >= 4GB
   - 根据需要调整Docker内存限制

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs bella-rag-api

# 实时查看日志
docker-compose logs -f
```

### 性能优化建议

1. **内存配置**: 根据文档量调整JVM内存设置
2. **并发控制**: 合理设置并发处理数量
3. **缓存策略**: 启用Redis缓存提升查询性能
4. **索引优化**: 定期清理无用索引，保持数据库性能

## 📈 监控与运维

### 健康检查

```bash
# 服务健康状态
curl http://localhost:8008/api/actuator/health/liveness

# 详细健康信息
curl http://localhost:8008/api/actuator/health
```


## 🔗 相关链接

- [API接口文档](./api.md) - 详细的API接口规范
- [Deep RAG介绍](./deep-rag.md) - 深入了解Deep RAG模式
- [项目主页](./intro.md) - 返回项目概览页面

