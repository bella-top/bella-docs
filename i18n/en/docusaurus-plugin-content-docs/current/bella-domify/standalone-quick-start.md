# Using as a Library
## System Requirements
- Python >= 3.9

## Quick Start
1. Install dependencies
   ```shell
   pip install document_parser
   ```

2. Configuration
   ```python
   parser_config = ParserConfig(image_provider=ImageStorageProvider(),
                                ocr_model_name="gtp-4o",
                                # Whether to enable OCR capability
                                # If not enabled, vision_model_provider or vision_model_list doesn't need to be implemented or configured
                                ocr_enable=True, 
                                vision_model_provider=OpenAIVisionModelProvider())
   parser_context.register_all_config(parser_config)
   parser_context.register_user("userId") # User ID when requesting models, if not set it will affect OCR usage
   ```

3. Execute parsing
   ```python
   converter = Converter(stream=stream) # Pass in as file stream
   dom_tree = converter.dom_tree_parse( 
       remove_watermark=True,   # Whether to enable watermark removal
       parse_stream_table=False # Whether to parse streaming tables
   )
   ```
   
4. Use standard domtree [Recommended]
   ```python
   dom_tree_json = jsonable_encoder(dom_tree)
   standard_dom_tree = StandardDomTree.from_domtree_dict(dom_tree_json, file_info = file_info)
   json_compatible_data = jsonable_encoder(standard_dom_tree.root)
   print(json.dumps(json_compatible_data, ensure_ascii=False))
   ```

The standard domtree is a structurally and semantically more complete domtree structure. Services like bella-rag are based on this standard domtree for processing. With future iterations, the results from step 3 parsing execution will also output as standard domtree.