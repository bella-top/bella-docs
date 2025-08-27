# Domtree定义

在RAG（检索增强生成）系统中，高质量的文档解析是确保下游任务准确性和效率的关键基础。作为文档解析模块的核心组成部分，DomTree协议通过结构化表征文档的层级与语义关系，将复杂异构的原始文档转化为可编程、可推理的树形逻辑结构。

## 结构定义

| 字段名称    | 字段说明                                                     | 数据类型        |
| ----------- | ------------------------------------------------------------ | --------------- |
| root        | 根节点                                                       | Node            |
| source_file | 文档来源                                                     | object          |
| id          | 文件ID                                                       | string          |
| name        | 文件名                                                       | string          |
| type        | eg: pdf                                                      | string          |
| mime_type   | eg: application/pdf                                          | string          |
| version     | 文件版本号                                                   | number          |
| summary     | 摘要                                                         | string          |
| tokens      | token预估数量                                                | number          |
| path        | 编号的层级信息，例如：[1,2,1]                                | array[number]   |
| element     | 元素信息                                                     | Element         |
| type        | 以下中的一种["Text","Title","List","Catalog","Table","Figure","Formula","Code","ListItem"] | string          |
| positions   | 位置信息，可能跨页所以是个数组                               | array[Position] |
| bbox        | 文档中的矩形坐标信息，例如：[90.1,263.8,101.8,274.3]         | array[double]   |
| page        | 页码                                                         | integer         |
| name        | 如果类型是Table、Figure为其名字                              | string          |
| description | 如果类型是Table、Figure为其描述                              | string          |
| text        | 文本信息，图片ocr的文字                                      | string          |
| image       | 图片信息                                                     | image           |
| type        | 可以是 image_url、image_base64、image_file                   | string          |
| url         | 链接地址                                                     | string          |
| base64      | 图片base64编码                                               | string          |
| file_id     | 上传到file-api的文件ID                                       | String          |
| rows        | 表格才有的属性，表格的行                                     | array[Cell]     |
| cells       | 单元格属性                                                   | Cell            |
| path        | 单元格在表格中的位置 start row, end row, start column, end column | array[number]   |
| text        | 文本                                                         | string          |
| nodes       | 单元格式复杂元素时使用，node内的path从头开始编号             | array[Node]     |
| children    | 子节点信息                                                   | array[Node]     |