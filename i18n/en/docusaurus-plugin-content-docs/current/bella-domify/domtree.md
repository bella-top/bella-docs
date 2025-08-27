# Domtree Definition

In RAG (Retrieval-Augmented Generation) systems, high-quality document parsing is a key foundation for ensuring accuracy and efficiency of downstream tasks. As a core component of the document parsing module, the DomTree protocol transforms complex heterogeneous raw documents into programmable and reasoning-capable tree-structured logical structures by structurally representing the hierarchical and semantic relationships of documents.

## Structure Definition

| Field Name  | Field Description                                            | Data Type       |
| ----------- | ------------------------------------------------------------ | --------------- |
| root        | Root node                                                    | Node            |
| source_file | Document source                                              | object          |
| id          | File ID                                                      | string          |
| name        | File name                                                    | string          |
| type        | e.g.: pdf                                                    | string          |
| mime_type   | e.g.: application/pdf                                        | string          |
| version     | File version number                                          | number          |
| summary     | Summary                                                      | string          |
| tokens      | Estimated token count                                        | number          |
| path        | Hierarchical information with numbering, e.g.: [1,2,1]      | array[number]   |
| element     | Element information                                          | Element         |
| type        | One of the following: ["Text","Title","List","Catalog","Table","Figure","Formula","Code","ListItem"] | string          |
| positions   | Position information, may span pages so it's an array       | array[Position] |
| bbox        | Rectangle coordinate information in document, e.g.: [90.1,263.8,101.8,274.3] | array[double]   |
| page        | Page number                                                  | integer         |
| name        | Name if type is Table or Figure                              | string          |
| description | Description if type is Table or Figure                      | string          |
| text        | Text information, OCR text from images                       | string          |
| image       | Image information                                            | image           |
| type        | Can be image_url, image_base64, image_file                   | string          |
| url         | Link address                                                 | string          |
| base64      | Base64 encoded image                                         | string          |
| file_id     | File ID uploaded to file-api                                 | String          |
| rows        | Table-specific attribute, table rows                         | array[Cell]     |
| cells       | Cell attributes                                              | Cell            |
| path        | Cell position in table: start row, end row, start column, end column | array[number]   |
| text        | Text                                                         | string          |
| nodes       | Used for complex cell elements, path numbering starts from beginning within node | array[Node]     |
| children    | Child node information                                       | array[Node]     |