# 作为library使用
## 系统要求
- Python >= 3.9

## 快速开始
1. 安装依赖
   ```shell
   pip install document_parser
   ```

2. 配置
   ```python
   parser_config = ParserConfig(image_provider=ImageStorageProvider(),
                                ocr_model_name="gtp-4o",
                                # 是否开启OCR能力
                                # 如不开启则vision_model_provider或vision_model_list不需要实现或配置
                                ocr_enable=True, 
                                vision_model_provider=OpenAIVisionModelProvider())
   parser_context.register_all_config(parser_config)
   parser_context.register_user("userId") # 请求模型时的用户ID,如果不设置会影响OCR使用
   ```

3. 执行解析
   ```python
   converter = Converter(stream=stream) # 以文件流的形式传入
   dom_tree = converter.dom_tree_parse( 
       remove_watermark=True,   # 是否开启去水印
       parse_stream_table=False # 是否解析流式表格
   )
   ```
   
4. 使用标准domtree【建议】
   ```python
   dom_tree_json = jsonable_encoder(dom_tree)
   standard_dom_tree = StandardDomTree.from_domtree_dict(dom_tree_json, file_info = file_info)
   json_compatible_data = jsonable_encoder(standard_dom_tree.root)
   print(json.dumps(json_compatible_data, ensure_ascii=False))
   ```

​	标准domtree是一种结构化语义更加完善的domtree结构，bella-rag等服务是基于这个标准domtree做的处理。随着后续的迭代，第三步执行解析的结果也会输出为标准domtree

