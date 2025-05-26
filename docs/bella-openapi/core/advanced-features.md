# 高级特性

## 工具调用
可通过渠道配置，对本不支持Function Call的LLM模型启用Function Call能力。

## 专属渠道
云端服务支持用户配置属于个人的私有渠道。仅可使用个人帐户名下的AK调用。

## 备选模型
caht completions能力点请求支持备选模型。
``` json
{
    //...
    "models": "model1, models2",
    //...
}
```
会在请求models1失败时自动切换到备选模型models2。

支持的最大备选模型数默认为3个，可通过后端配置 bella.openapi.max-models-per-request进行调整。

## 最大等待时间
期待中