# Model Management Guide

## Overview

This guide aims to help service administrators understand and use the model management features of the Bella-OpenAPI platform. Through this document, you will learn how to use the Web console and API interfaces to add, configure, and manage AI models and their associated channels.

Bella-OpenAPI is a multi-vendor AI service unified access platform that supports various AI service providers such as OpenAI, Alibaba Cloud, Volcano Engine, AWS Bedrock, and more. The platform provides a consistent AI service experience through unified interface specifications and flexible protocol adaptation mechanisms.

## Core Concepts

### Model
A model is the core entity of AI services, defining the capability boundaries and basic properties of an AI model, including:
- **Basic Information**: Model name, documentation URL, owner information
- **Status Control**: Activate/deactivate, public/private status
- **Model Properties**: Capability parameters of the model itself (such as context length, supported voice types, etc.)
- **Model Features**: AI capability switches that the model possesses (such as streaming output, function calls, vision capabilities, etc.)
- **Endpoint Association**: API endpoint types supported by the model
- **Owner Type**: system (system level), org (organization level), person (personal level); org (organization level) is currently not implemented
- **Owner Code**: For system type, uniformly 0; for person type, it is the user id, such as ucid

> **Important Distinction**: Model features describe "what the AI model can do," independent of specific service provider implementations; while channel properties describe "how the service provider implements it," related to specific protocols and technical implementations.

### Channel
A channel is the specific service implementation of a model, connecting to a specific AI service provider, including:
- **Service Configuration**: Vendor protocol, service URL, authentication information
- **Protocol Properties**: Technical implementation parameters specific to the service provider
- **Routing Strategy**: Priority, data flow direction, load balancing
- **Price Information**: Call cost configuration
- **Security Control**: Access permissions, security level
- **Owner Type**: system (system level), org (organization level), person (personal level); org (organization level) is currently not implemented
- **Owner Code**: For system type, uniformly 0; for person type, it is the user id, such as ucid

> **Channel Properties**: Describe the API interface capabilities and technical implementation details of specific service providers, such as whether StreamOptions parameters are supported, API version requirements, etc.

### Endpoint
Endpoints define different types of AI service interfaces:
- `/v1/chat/completions` - Chat completions
- `/v1/audio/speech` - Speech synthesis (TTS)
- `/v1/audio/realtime` - Real-time audio conversation
- `/v1/images/generations` - Image generation
- `/v1/embeddings` - Text vectorization

### Protocol Adaptation
The platform supports unified access to multiple vendor protocols:
- **OpenAI Protocol** - OpenAI, Volcano Engine, etc.
- **Alibaba Cloud Protocol** - Alibaba Cloud Tongyi Qianwen
- **AWS Protocol** - AWS Bedrock
- **Custom Protocol** - Support for extending other vendors

## Web Console Operation Guide

### Accessing the Console

Access the model management console:
```
https://your-domain/meta/console/model
```

### Creating a Model

#### 1. Enter the Creation Page
- Visit `https://your-domain/meta/console/model/create`
- Or click the "Add Model" button on the model list page

#### 2. Select Capability Points
First, select the endpoint type supported by the model:
- **Chat Completions** (`/v1/chat/completions`) - Supports text conversations, function calls, visual understanding
- **Speech Synthesis** (`/v1/audio/speech`) - Text to speech
- **Real-time Audio** (`/v1/audio/realtime`) - Real-time voice conversation
- **Image Generation** (`/v1/images/generations`) - Text to image generation
- **Text Vectorization** (`/v1/embeddings`) - Text to vector

> **Important Note**: After selecting an endpoint, the system will automatically load the corresponding property and feature configuration forms

#### 3. Fill in Basic Information
- **Model Name**: Globally unique identifier, descriptive names recommended
- **Documentation URL**: Official documentation link for the model (optional)
- **Owner Type**: The attribution type of the model
  - `system`: System level, shared across the platform, only administrators can manage
  - `org`: Organization level, shared within the organization, organization administrators can manage
  - `person`: Personal level, for personal use only, individual users can manage
- **Owner Code**: Unique identifier of the owner
- **Owner Name**: Display name of the owner
- **Visibility**:
  - `public`: Publicly visible
  - `private`: Private access
  - `protected`: Protected access

#### 4. Configure Model Properties
Model properties define the capability parameters of the AI model itself, displaying corresponding configuration items based on the selected endpoint:

**Chat Model Properties (CompletionModelProperties)** - Applicable to `/v1/chat/completions`
- `max_input_context` - Maximum input context length (number of tokens)
- `max_output_context` - Maximum output context length (number of tokens)

**Voice Model Properties (VoiceProperties)** - Applicable to `/v1/audio/speech` and `/v1/audio/realtime`
- `voiceTypes` - Supported voice type mapping, in the format of `{"key": "voice_name"}`

> **Note**: The system currently lacks model property definitions for the following endpoints, which will be supplemented in future versions:
> - **EmbeddingProperties** - Text vectorization model properties
> - **ASRProperties** - Speech recognition model properties
> - **ImagesProperties** - Image generation model properties

#### 5. Configure Model Features
Model features define the functional capabilities of the AI model, selecting supported features based on the endpoint type:

**Chat Model Features (CompletionModelFeatures)** - Applicable to `/v1/chat/completions`
- `stream` - Whether streaming output is supported
- `function_call` - Whether function calls are supported
- `stream_function_call` - Whether streaming output for function calls is supported
- `parallel_tool_calls` - Whether parallel tool calls are supported
- `vision` - Whether visual understanding is supported
- `json_format` - Whether JSON format output is supported
- `json_schema` - Whether JSON Schema output is supported
- `reason_content` - Whether thinking process output is supported
- `prompt_cache` - Whether prompt caching is supported

**TTS Model Features (TTSModelFeatures)** - Applicable to `/v1/audio/speech`
- `stream` - Whether streaming audio output is supported

**Image Model Features (ImagesModelFeatures)** - Applicable to `/v1/images/generations`
- `highQuality` - Whether high-quality generation is supported
- `multipleStyles` - Whether multiple styles are supported
- `customSize` - Whether custom sizes are supported

> **Note**: Model feature definitions for the following endpoints will be supplemented in future versions:
> - **EmbeddingModelFeatures** - Text vectorization model features
> - **ASRModelFeatures** - Speech recognition model features

#### 6. Submit Creation
Click the "Create Model" button to complete model creation. Upon success, you will be redirected to the model details page.

### Managing Existing Models

#### 1. View Model List
On the model management page, you can see all models and filter by the following conditions:
- Endpoint type
- Model name
- Supplier
- Status (active/inactive)
- Visibility (public/private)

#### 2. Edit Model Information
On the model details page, you can:
- **Modify Basic Information**: Click directly on fields for inline editing
- **Update Property Configuration**: Modify the protocol properties of the model
- **Adjust Feature Settings**: Enable or disable functional features
- **Manage Endpoint Associations**: Add or remove supported endpoints

#### 3. Status Control
- **Activate/Deactivate Model**: Control whether the model is available for service
- **Publish/Unpublish**: Control the public visibility of the model
- **Soft Link Management**: Set model aliases or redirections

### Channel Management

#### 1. View Model Channels
In the "Channel List" section of the model details page, you can see:
- All associated channels
- Channel status and priority
- Service provider and protocol information
- Price configuration

#### 2. Create Channel
Click the "Add Channel" button and fill in the following information:
- **Channel Code**: Unique identifier
- **Protocol Type**: Select the supported protocol adapter
- **Service Provider**: AI service provider name
- **Service URL**: API endpoint address
- **Priority**: high/normal/low
- **Data Flow Direction**: inner/mainland/overseas/protected

#### 3. Configure Channel Information
Configure the corresponding channel parameters based on the selected protocol type:

**OpenAI Protocol Configuration**
```json
{
  "auth": {
    "type": "BEARER",
    "apiKey": "your-api-key"
  },
  "deployName": "gpt-4",
  "apiVersion": "2024-02-01",
  "supportStreamOptions": true
}
```

**Alibaba Cloud Protocol Configuration**
```json
{
  "auth": {
    "type": "BEARER",
    "apiKey": "your-api-key"
  },
  "deployName": "qwen-turbo"
}
```

**AWS Protocol Configuration**
```json
{
  "auth": {
    "type": "IAM",
    "apiKey": "access-key-id",
    "secret": "secret-access-key"
  },
  "region": "us-east-1"
}
```

#### 4. Price Configuration
Set the price information for the channel:
```json
{
  "input": 0.01,  // Input token price
  "output": 0.02, // Output token price
}
```
See: [Price Information Configuration Instructions](#price-information-configuration-instructions)

## API Interface Operation Guide

### Authentication Method
All API calls require authentication information in the request header:
```
Authorization: Bearer your-api-key
```

### Model Management API

#### Create Model
```http
POST /console/model
Content-Type: application/json

{
  "modelName": "gpt-4-turbo",
  "documentUrl": "https://docs.openai.com/gpt-4",
  "properties": "{\"max_input_context\": 128000, \"max_output_context\": 4096}",
  "features": "{\"stream\": true, \"function_call\": true, \"vision\": true}",
  "ownerType": "system",
  "ownerCode": "0",
  "ownerName": "system",
  "visibility": "private",
  "status": "active",
  "endpoints": ["/v1/chat/completions"],
  "userName": "system",
  "userId": 0
}
```

#### Update Model
```http
PUT /console/model
Content-Type: application/json

{
  "modelName": "gpt-4-turbo",
  "documentUrl": "https://updated-docs.com",
  "properties": "{\"max_input_context\": 200000}",
  "userName": "system",
  "userId": 0
  
}
```

#### Activate/Deactivate Model
```http
POST /console/model/activate
Content-Type: application/json

{
  "modelName": "gpt-4-turbo",
  "userName": "system",
  "userId": 0
}
```

```http
POST /console/model/inactivate
Content-Type: application/json

{
  "modelName": "gpt-4-turbo",
  "userName": "system",
  "userId": 0
}
```

#### Publish/Unpublish Model
```http
POST /console/model/publish
Content-Type: application/json

{
  "modelName": "gpt-4-turbo",
  "userName": "system",
  "userId": 0
}
```

```http
POST /console/model/publish/cancel
Content-Type: application/json

{
  "modelName": "gpt-4-turbo",
  "userName": "system",
  "userId": 0
}
```

#### Create Model Soft Link
```http
POST /console/model/link
Content-Type: application/json

{
  "modelName": "gpt-4-latest",
  "linkedTo": "gpt-4-turbo",
  "userName": "system",
  "userId": 0
}
```

#### Query Model Details
```http
GET /console/model/details?modelName=gpt-4-turbo
```

#### Query Model List
```http
GET /console/model/list?endpoint=/v1/chat/completions&status=active&visibility=public
```

### Channel Management API

#### Create Channel
```http
POST /console/channel
Content-Type: application/json

{
  "entityType": "model",
  "entityCode": "gpt-4-turbo",
  "channelCode": "openai-gpt4-channel-001",
  "status": "active",
  "dataDestination": "overseas",
  "priority": "high",
  "protocol": "OpenAICompletion",
  "supplier": "OpenAI",
  "url": "https://api.openai.com/v1/chat/completions",
  "channelInfo": "{\"auth\":{\"type\":\"BEARER\",\"apiKey\":\"sk-xxx\"},\"deployName\":\"gpt-4-turbo\"}",
  "priceInfo": "{\"input\":0.01,\"output\":0.03}",
  "trialEnabled": 1,
  "userName": "system",
  "userId": 0
}
```

#### Update Channel
```http
PUT /console/channel
Content-Type: application/json

{
  "channelCode": "openai-gpt4-channel-001",
  "priority": "normal",
  "userName": "system",
  "userId": 0
}
```

#### Activate/Deactivate Channel
```http
POST /console/channel/activate
Content-Type: application/json

{
  "channelCode": "openai-gpt4-channel-001",
  "userName": "system",
  "userId": 0
}
```

```http
POST /console/channel/inactivate
Content-Type: application/json

{
  "channelCode": "openai-gpt4-channel-001",
  "userName": "system",
  "userId": 0
}
```

### Metadata Query API

#### Get Endpoint List
```http
GET /v1/meta/endpoint/list?status=active
```

#### Get Model Property Schema
```http
GET /v1/meta/schema/modelProperty?endpoints=/v1/chat/completions,/v1/embeddings
```

#### Get Model Feature Schema
```http
GET /v1/meta/schema/modelFeature?endpoints=/v1/chat/completions
```

#### Get Channel Information Schema
```http
GET /v1/meta/schema/channelInfo?entityType=model&entityCode=gpt-4-turbo&protocol=OpenAICompletion
```

#### Get Price Information Schema
```http
GET /v1/meta/schema/priceInfo?entityType=model&entityCode=gpt-4-turbo
```

#### Query Supported Protocols
```http
GET /v1/meta/protocol/list?entityType=model&entityCode=gpt-4-turbo
```

## Detailed Protocol Properties for Different Endpoints

### /v1/chat/completions - Chat Completions

#### Basic Protocol Properties (CompletionProperty)
- `encodingType` - Encoding type, affects token calculation method
- `mergeReasoningContent` - Whether to merge reasoning content into the response
- `splitReasoningFromContent` - Whether to separate reasoning process from content
- `functionCallSimulate` - Whether to force support for function calls (simulate for models that don't support it)
- `extraHeaders` - Additional HTTP request header configuration
- `queueName` - Queue configuration, requests will be proxied through the bella-job-queue service when configured

#### OpenAI Protocol Specific Properties (OpenAIProperty)
- `auth.type` - Authentication type: BEARER (default), BASIC, CUSTOM, etc.
- `auth.apiKey` - API key
- `auth.header` - Custom authentication header (used when type is CUSTOM)
- `deployName` - Deployment name, some service providers require specifying a specific deployment instance
- `apiVersion` - API version, used for URL concatenation (such as Azure OpenAI's URL containing version='xxxx')
- `supportStreamOptions` - Whether StreamOptions parameters are supported

#### Alibaba Cloud Protocol Specific Properties (AliProperty)
- `auth` - Authentication configuration, typically using BEARER type
- `deployName` - Model deployment name, such as "qwen-turbo"

#### Volcano Protocol Specific Properties (HuoshanProperty)
Based on the OpenAI protocol, with additional support for:
- Automatic handling of "thinking" configuration
- Support for reasoning process control

#### AWS Protocol Specific Properties (AwsProperty)
- `auth.type` - Using IAM authentication
- `auth.apiKey` - AWS Access Key ID
- `auth.secret` - AWS Secret Access Key
- `region` - AWS region, such as "us-east-1"

### /v1/audio/speech - TTS Speech Synthesis

#### Basic Protocol Properties (TtsProperty)
- `encodingType` - Audio encoding type
- `defaultContentType` - Default audio format, such as "wav", "mp3"
- `defaultVoice` - Default voice character
- `defaultSampleRate` - Default sample rate

#### Volcano TTS Specific Properties (HuoShanProperty)
- `auth` - Authentication configuration
- `deployName` - Deployment name
- `appId` - Application ID
- `cluster` - Cluster configuration
- `resourceId` - Resource ID
- `websocketUrl` - WebSocket connection address

### /v1/audio/realtime - Real-time Audio Conversation

#### Basic Protocol Properties (RealtimeProperty)
Inherits from ASR properties, with additional:
- `llmOption` - LLM configuration options
- `ttsOption` - TTS configuration options

#### LLM Option Configuration (LlmOption)
- `MainLlmOption` - Main LLM configuration
  - `model` - Model name
  - `sysPrompt` - System prompt
  - `prompt` - User prompt
  - `temperature` - Temperature parameter
- `WorkerLlmOption[]` - Worker LLM configuration list, supports parallel processing

#### TTS Option Configuration (TtsOption)
- `model` - TTS model name
- `voice` - Voice character
- `sampleRate` - Sample rate

### /v1/images/generations - Image Generation

#### Basic Protocol Properties (ImagesProperty)
- `auth` - Authentication configuration
- `deployName` - Deployment name

Supported image model features:
- `highQuality` - High-quality generation
- `multipleStyles` - Multiple style support
- `customSize` - Custom size support

### /v1/embeddings - Text Vectorization

#### Basic Protocol Properties (EmbeddingProperty)
- `encodingType` - Encoding type

#### OpenAI Protocol Specific Properties
- `auth` - Authentication configuration
- `deployName` - Deployment name
- `apiVersion` - API version
- `batchSize` - Batch size, default 2048

## Differences Between Model Features and Channel Properties

### Core Concept Differences

**Model Features**
- **Definition**: Describes the capabilities and functional characteristics of the AI model itself
- **Characteristics**: Determined by the model's training and architecture, independent of service provider implementation
- **Role**: Defines "what the model can do"
- **Examples**: stream (streaming output), function_call (function calls), vision (visual understanding)

**Channel Properties**
- **Definition**: Describes the API interface characteristics and technical implementation details of specific service providers
- **Characteristics**: Strongly related to protocols and service providers, may change due to service provider upgrades
- **Role**: Defines "how the service provider implements it"
- **Examples**: supportStreamOptions (support for StreamOptions parameters), apiVersion (API version requirements)

### Detailed Description of Owner Types

#### system (System Level)
- **Usage Scenario**: Platform-wide public services, such as mainstream AI models and basic services
- **Permission Characteristics**: Only system administrators can manage, visible and available to all users
- **Typical Examples**: gpt-4, gpt-3.5-turbo and other mainstream models

#### org (Organization Level)
- **Usage Scenario**: Exclusive services shared within an enterprise or organization
- **Permission Characteristics**: Organization administrators can manage, only available to organization members
- **Typical Examples**: Enterprise custom models, department shared services

#### person (Personal Level)
- **Usage Scenario**: User's personal exclusive private services and configurations
- **Permission Characteristics**: Only the user can manage and use
- **Typical Examples**: Personal API Key configuration, personal fine-tuned models

## Protocol Adaptation Mechanism Description

### Adapter Management
Bella-OpenAPI uniformly manages all protocol adapters through AdaptorManager:
- Automatically discovers and registers all adapters at system startup
- Maps by endpoint and protocol type at two levels
- Supports dynamic protocol checking and adapter selection

### Request Conversion Process
1. **Parameter Preprocessing** - Adjust request parameters according to vendor-specific requirements
2. **Format Conversion** - Convert OpenAI standard format to target vendor format
3. **Authentication Processing** - Add vendor-specific authentication information
4. **URL Construction** - Build complete request URL based on configuration

### Response Conversion Process
1. **Error Handling** - Unified exception handling and error code conversion
2. **Format Conversion** - Convert vendor format back to OpenAI standard format
3. **Special Processing** - Handle reasoning content separation, token statistics, etc.

### Streaming Processing Adaptation
- SSE event conversion through SseEventConverter
- Use chain of responsibility pattern to handle streaming callbacks
- Support for different vendors' streaming protocol differences

## Channel Routing Strategy

### Multi-dimensional Filtering
Channel selection is based on the following strategies:
1. **Permission Filtering** - Private channels can only be used by owners
2. **Security Level Filtering** - Restrict access permissions based on data flow direction
3. **Availability Filtering** - Exclude currently unavailable channels

### Security Level Control
- `protected` (10) - Highest security level, internally registered
- `inner` (20) - Internal level
- `mainland` (30) - Domestic level
- `overseas` (40) - Overseas level

### Load Balancing Strategy
1. Group by priority (private > public, high > normal > low)
2. Random selection within the same priority group
3. Support for failover and multi-model switching

## Price Information Configuration Instructions

Different endpoints support different price information structures:

### Chat Completions (CompletionPriceInfo)
```json
{
  "input": 0.01,
  "output": 0.03,
  "unit": "cents/thousand tokens"
}
```

### Text Vectorization (EmbeddingPriceInfo)
```json
{
  "input": 0.01,
  "unit": "cents/thousand tokens"
}
```

### Speech Synthesis (TtsPriceInfo)
```json
{
  "input": 0.1,
  "unit": "cents/ten thousand characters"
}
```

### Image Generation (ImagesPriceInfo)
The price information structure for image generation is the most complex, supporting multiple sizes, quality levels, and token billing modes:

```json
{
  "details": [
    {
      "size": "1024x1024",
      "ldPricePerImage": 0.04,
      "mdPricePerImage": 0.08, 
      "hdPricePerImage": 0.12,
      "textTokenPrice": 0.01,
      "imageTokenPrice": 0.15
    },
    {
      "size": "512x512",
      "ldPricePerImage": 0.02,
      "mdPricePerImage": 0.04,
      "hdPricePerImage": 0.06,
      "textTokenPrice": 0.01,
      "imageTokenPrice": 0.10
    }
  ]
}
```

**Price Dimension Description**:
- `size` - Image size (such as 256x256, 1024x1024, 1792x1024, etc.)
- `ldPricePerImage` - Low-quality image unit price (yuan/image)
- `mdPricePerImage` - Medium-quality image unit price (yuan/image)
- `hdPricePerImage` - High-quality image unit price (yuan/image)
- `textTokenPrice` - Text token price (yuan/thousand tokens)
- `imageTokenPrice` - Image token price (yuan/thousand tokens)

**Supported Image Operation Types**:
- `/v1/images/generations` - Image generation
- `/v1/images/edits` - Image editing
- `/v1/images/variations` - Image variation

**Token Calculation Rules**:
- Low-resolution images (512x512): 85 tokens
- High-resolution images: `Number of image slices × 170 + 85` tokens
- Image slice unit: 512x512 pixel block

### ASR Speech Recognition Price Information

**Flash ASR (FlashAsrPriceInfo)**
```json
{
  "price": 0.02,
  "unit": "cents/time"
}
```

**Real-time ASR (RealTimePriceInfo)**
```json
{
  "price": 1.5,
  "unit": "hour/yuan"
}
```

**Audio Transcription ASR (TranscriptionsAsrPriceInfo)**
```json
{
  "price": 1.0,
  "unit": "hour/yuan"
}
```

## Best Practice Recommendations

### Model Configuration Recommendations
1. **Naming Convention** - Use descriptive and unique model names
2. **Property Configuration** - Set context length limits based on actual model capabilities
3. **Feature Switches** - Only enable functional features actually supported by the model
4. **Owner Selection** - Choose appropriate owner types based on usage scope
5. **Documentation Maintenance** - Provide detailed model documentation links

### Channel Configuration Recommendations
1. **Multi-channel Redundancy** - Configure multiple channels for important models to improve availability
2. **Priority Setting** - Reasonably set channel priorities, prioritize high-quality services
3. **Protocol Selection** - Choose appropriate protocol adapters based on suppliers
4. **Cost Control** - Accurately configure price information for cost statistics
5. **Security Classification** - Choose appropriate data flow directions based on data sensitivity

### Monitoring and Operations Recommendations
1. **Status Monitoring** - Regularly check model and channel status
2. **Performance Monitoring** - Focus on response time and success rate metrics
3. **Cost Monitoring** - Track API call costs and usage
4. **Permission Monitoring** - Monitor access situations for different owner types
5. **Log Analysis** - Analyze error logs to discover problems in a timely manner

### Extension Development Recommendations
1. **New Protocol Adaptation** - Implement the IProtocolAdaptor interface to add support for new vendors
2. **Property Extension** - Extend the Properties class to meet new endpoint requirements
3. **Feature Extension** - Extend the Features class to support new model capabilities
4. **Monitoring Integration** - Integrate external monitoring systems to get more metrics
5. **Automated Operations** - Implement automated model and channel management through APIs

## Troubleshooting

### Common Issues

#### Model Creation Failure
- Check if the model name is unique
- Verify if the endpoint configuration is correct
- Confirm if the property and feature configuration formats are correct

#### Channel Unavailable
- Check if the channel status is active
- Verify if the protocol configuration is correct
- Confirm if the authentication information is valid
- Check network connection and URL accessibility

#### Request Failure
- View error logs for detailed error information
- Check API Key and authentication configuration
- Verify if request parameters meet target vendor requirements
- Confirm consistency between model features and channel properties configuration

#### Permission Issues
- Check owner type and visibility settings
- Verify if the user has permission to access the model or channel
- Check organization membership and role permissions

#### Performance Issues
- Check channel priority configuration
- Analyze if request distribution is even
- Monitor response times of various channels
- Adjust load balancing strategy

## Conclusion

Through this guide, you should be able to:

1. **Understand Core Concepts** - Distinguish between model features and channel properties, master the usage scenarios of owner types
2. **Operate Proficiently** - Use the Web console and API interfaces for model and channel management
3. **Configure Reasonably** - Choose appropriate properties and features based on different endpoints and suppliers
4. **Solve Problems** - Quickly diagnose and solve common configuration and operation problems

Bella-OpenAPI provides enterprises with a unified, flexible, and extensible AI service access platform. For further questions, please refer to the API documentation or contact the technical support team.
