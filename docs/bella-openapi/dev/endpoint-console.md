# 能力点接入指南

由于能力点创建目前未提供管理页面，需要调用接口进行。

**注意**：接口请求时域名需替换为实际使用域名，并使用管理ak，如无管理ak权限，可联系项目负责人获取

所有非GET请求的body中都需要userId和userName，填自己的id和姓名即可。（示例请求未给出）

## 注册能力点
### 1、创建总类目

联系项目负责人，确认当前存在的类目。
```shell
curl --location 'http://localhost:8080/console/category' \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--data '{
"categoryName":"知识库"
}'
```

### 2、查询类目，获取code
```shell
curl --location 'http://localhost:8080/v1/meta/category/list?categoryName=%E7%9F%A5%E8%AF%86%E5%BA%93' \
--header 'Authorization: Bearer '
```

### 3、创建知识检索子类目，使用上一步的code作为parentCode
```shell
curl --location 'http://localhost:8080/console/category' \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--data '{
"categoryName":"知识检索",
"parentCode": "0004"
}'
```


### 4、查询类目树，确认成功，并获取code
```shell
curl --location 'http://localhost:8080/v1/meta/category/tree?includeEndpoint=true&status=active&categoryCode=0004' \
--header 'Authorization: Bearer ' 
```

### 5、document_url
document_url用于非模型能力点的展示，可以使用doc.bella.top的文档页面

### 6、创建rag能力点
```shell
curl --location 'http://localhost:8080/console/endpoint' \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--data '{
"endpoint":"/v1/rag",
"endpointName": "检索增强生成",
"maintainerCode":"用户系统号/ID",
"maintainerName": "lzl",
"documentUrl": "https://doc.weixin.qq.com/doc/w3_AagAxwZdAD4GZVGEZO0QPiO8m8wC1?scode=AJMA1Qc4AAw0vPEnJ8"
}'
```

### 7、能力点关联到类目下，使用第四步中获取到的code
```shell
curl --location 'http://localhost:8080/console/endpoint/category' \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--data '{
"endpoint":"/v1/rag",
"categoryCodes": ["0004-0001"]
}'
```


### 8、查询类目树，确认正确
```shell
curl --location 'http://localhost:8080/v1/meta/category/tree?includeEndpoint=true&status=active&categoryCode=0004' \
--header 'Authorization: Bearer ' 
```

### 9、页面验证

## 外部能力点

**注意**：外部能力点指的是不经过bella-openapi服务转发的能力点。费用信息在自己的服务中维护或通过openapi的路由功能获取。

### 渠道维护（Optional）
渠道的详细说明见 [渠道管理API](model-console.md#渠道管理API)

### 路由（Optional）

**说明**：外部能力点可以自行实现渠道协议，但是可以借助Openapi实现渠道的路由和管理。

```shell
curl --location --request POST 'http://localhost:8080/v1/route' \
--header 'Authorization: Bearer {用于服务管理的apikey}' \
--header 'Content-Type: application/json' \
--data '{
"apikey":"用于用户能力点请求的apikey"
"endpoint":"/v1/rag",
"model": "没有模型，可为null"
}'
```

响应：
```json
{
  "channelCode": "channelCode",
  "entityType": "endpoint或model",
  "entityCode": "endpoint path 或 model Name",
  "protocol": "转发协议",
  "url": "转发url",
  "channelInfo": "渠道信息",
  "priceInfo": "价格信息"
}
```


### 计费

#### 1、创建计费脚本
请求为计费脚本示例
```shell
curl --location --request PUT 'http://localhost:8080/console/endpoint' \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--data '{
"endpoint":"/v1/rag",
"costScript": "price.price * usage",
"testPriceInfo":"{\"price\": 10.000}",
"testUsage": 100,
"userId":0,
"userName":"system"
}'
```
使用groovy脚本进行计费。
testPriceInfo 和 testUsage 是测试数据，用于验证脚本

#### 2、上报日志

java sdk: 

```xml
<dependency>
    <groupId>top.bella</groupId>
    <artifactId>sdk</artifactId>
    <version>{maven仓库获取最新版本}</version>
</dependency>
```
**使用方法**: com.ke.bella.openapi.client.OpenapiClient#log

http:
```shell
curl --location 'http://localhost:8080/v1/log' \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--data '{
"endpint": "/v1/rag",
"bellaTraceId":"111111",
"akSha": "aaaaaa", //sha256 hash
"priceInfo": "{\"price\": 10.000}",
"usage": 100
}'
```
