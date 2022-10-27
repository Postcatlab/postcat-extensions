# 生成 GRPC proto 静态文件

```shell
npm install -g grpc-tools
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:. --grpc_out=grpc_js:. sensitive.proto
```
