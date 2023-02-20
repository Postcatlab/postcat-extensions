# openDLP API 敏感数据发现

## 简介

Postcat 中的 openDLP 插件基于 [openDLP](https://github.com/hitsz-ids/openDLP) 开源项目，针对 Postcat 场景实现了敏感 API 发现功能，通过扫描 API 文档，识别该 API 是否可能是一个涉及敏感数据的 API。

目前内置支持 17 类敏感数据类型，可以通过自定义正则支持更多类型的识别。对于有地区和语言差异的类型，目前都是支持中国大陆地区、简体中文。具体敏感数据类型如下：

1. 人名
2. 身份证号
3. 护照号
4. 银行卡号
5. 车牌号
6. 电子邮箱
7. 邮政编码
8. 移动手机号码
9. 固定电话号码
10. 地址
11. 公司名
12. 统一社会信用代码
13. 日期
14. 域名
15. IPv4 地址
16. IPv6 地址
17. MAC 地址

## 如何使用

### openDLP 部署

1. 从 Dockerhub 上拉取镜像：docker pull longice/opendlp-eoapi:1.0.0

2. Docker 部署镜像: docker run -itd -p 50051:40051 longice/opendlp-eoapi:v1.0.0

### 插件使用

1. 配置 OpenDLP 服务地址，一般是`${服务器地址}:50051`
   ![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/packages/postcat-openDLP/assets/images/2022-11-17-18-49-22.png)
2. 在 API 详情页点击扫描 API 敏感词
   ![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/packages/postcat-openDLP/assets/images/2022-11-17-18-50-30.png)
3. 显示当前文档敏感词扫描结果
   ![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/packages/postcat-openDLP/assets/images/2022-11-17-18-52-07.png)
