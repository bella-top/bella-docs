# EndPoint Console Guide
Due to the lack of a management page for Endpoint creation, an interface needs to be called.
**Attention**: When requesting an interface, the domain name should be replaced with the actual domain name used and managed using AK. If you do not have AK management permission, you can contact the project leader to obtain it
All non GET requests require userId and userName in the body, just fill in your own id and name. (Example request not provided)
## Registration Endpoint
### 1. Create a general category
Contact the project leader to confirm the current category.
```shell
curl --location ' http://localhost:8080/console/category ' \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--data '{
'categoryName': 'Knowledge Base'
}'
```
### 2. Search for categories and obtain codes
```shell
curl --location ' http://localhost:8080/v1/meta/category/list?categoryName=%E7%9F%A5%E8%AF%86%E5%BA%93 ' \
--header 'Authorization: Bearer '
```
### 3. Create a subcategory for knowledge retrieval and use the code from the previous step as the parentCode
```shell
curl --location ' http://localhost:8080/console/category ' \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--data '{
'categoryName': 'Knowledge Retrieval',
"parentCode": "0004"
}'
```
### 4. Search the category tree, confirm success, and obtain the code
```shell
curl --location ' http://localhost:8080/v1/meta/category/tree?includeEndpoint=true&status=active&categoryCode=0004 ' \
--header 'Authorization: Bearer ' 
```
### 5 document_url
Document_url is used for displaying non model Endpoint and can be accessed through the doc.bella.top document page
###6. Create Rag Endpoint
```shell
curl --location ' http://localhost:8080/console/endpoint ' \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--data '{
"endpoint":"/v1/rag",
Endpoint Name ":" Retrieval Enhanced Generation ",
MaintainerCde ":" User System ID/ID ",
"maintainerName": "lzl",
"documentUrl": " https://doc.weixin.qq.com/doc/w3_AagAxwZdAD4GZVGEZO0QPiO8m8wC1?scode=AJMA1Qc4AAw0vPEnJ8 "
}'
```
### 7. Associate Endpoint with categories and use the code obtained in step four
```shell
curl --location ' http://localhost:8080/console/endpoint/category ' \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--data '{
"endpoint":"/v1/rag",
"categoryCodes": ["0004-0001"]
}'
```
### 8. Search the category tree and confirm its correctness
```shell
curl --location ' http://localhost:8080/v1/meta/category/tree?includeEndpoint=true&status=active&categoryCode=0004 ' \
--header 'Authorization: Bearer ' 
```
### 9. Page verification

## External Endpoint
**Note * *: External Endpoint refer to Endpoint that are not forwarded through the Bella openAPI service. Cost information is maintained in one's own service or obtained through the routing function of OpenAPI.
### Channel maintenance (Optional)
For detailed information on channels, please refer to the Channel Management API (model console. md # Channel Management API)
### Route (Optional)
**Explanation: External Endpoint can implement channel protocols on their own, but can use OpenAPI to implement channel routing and management.
```shell
curl --location --request POST ' http://localhost:8080/v1/route ' \
--Header 'Authorization: Bearer {apikey for service management}'\
--header 'Content-Type: application/json' \
--data '{
Apikey ":" Apikey used for user Endpoint requests "
"endpoint":"/v1/rag",
Model ":" No model, can be null "
}'
```
Response:
```json
{
  "channelCode": "channelCode",
  "entityType": " endpoint or model ",
  "entityCode ": " Endpoint path or model name ",
  "protocol": " Forwarding Protocol ",
  "url": "Forwarding URL",
  "channelInfo": "Channel Information",
  "priceInfo": "Price Information"
}
```
### Billing
#### 1. Create billing script
Request for billing script example
```shell
curl --location --request PUT ' http://localhost:8080/console/endpoint ' \
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
Use Groovy scripts for billing.
TestPriceInfo and testUsage are test data used to validate scripts
#### 2. Report logs
java sdk:
```xml
<dependency>
<groupId>top.bella</groupId>
<artifactId>sdk</artifactId>
<version>{Maven repository retrieves the latest version}</version>
</dependency>
```
**Usage * *: com. ke. bella. openapi. client. openapiClient # log
http:
```shell
curl --location ' http://localhost:8080/v1/log ' \
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
