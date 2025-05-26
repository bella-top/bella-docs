# Advanced features

## Function Call
Function Call capability can be enabled for LLM models that do not support Function Call through channel configuration.

## Private Channel
Cloud services support users to configure their own private channels. Only AK calls under personal account names are allowed.

## Fallback Models
Caht completion capability point requests support for alternative models.

``` json
{
    //...
    "models": "model1, models2",
    //...
}
```
It will automatically switch to models2 when the request fails with models1.
The default maximum number of supported candidate models is 3, which can be adjusted through backend configuration of bella.openapi.max-modes-per request.

## Max Wait
Looking forward to it