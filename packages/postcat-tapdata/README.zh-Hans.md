# Tapdata 介绍

Tapdata 是自带 ETL 的实时数据服务平台，通过把企业核心数据实时集中到中央化数据平台的方式并通过 API 或者反向同步方式，为下游的交互式应用、微服务或交互式分析提供新鲜实时的数据。

适用于构建实时数据管道、数据库上云/跨云同步、实时数据 ETL、实时入湖入仓、实时主数据管理、传统业务系统升级与加速等多个场景。

Tapdata 支持以实时的方式从各个数据来源，包括数据库，API，队列，物联网等数据提供者采集或同步最新的数据变化，并完成数据实时计算、建模和转型，快速得出结果，再通过拖拉拽的方式开发和配置业务需要的 Data API。

Tapdata 目前已支持 40+ 数据库和类型，并且在持续扩充。包括**通用数据连接**：
| Mysql | Postgresql | MongoDB | Sybase ASE | Hive1 | SAP HANA | TDSQL | DM DB | TiDB | UXDB |
|-----------|------------|-----------|------------|-------|------------|-----------------|-------------------|-----------|----------|
| Mysql PXC | Mysql PXC | Greenplum | IBM DB2 | ES | Hbase | Hazelcast Cloud | Gbase 8s Gbase 8a | KunDB | 人大金仓 |
| MariaDB | MariaDB | Oracle | SQL Server | Redis | ClickHouse | Apache Doris | GaussDB 200 | OceanBase | GoldonDB |

**阿里云数据连接**

| ADB Mysql | ADB Postgresql | Aliyun RDS for MySQL | Aliyun RDS for PG | Aliyun RDS for SQlServer | Aliyun RDS for MariaDB | Aliyun MongoDB | PolarDB MySQL | PolarDB PostgreSQL |
| --------- | -------------- | -------------------- | ----------------- | ------------------------ | ---------------------- | -------------- | ------------- | ------------------ |

**腾讯云数据连接：**
| TencentDB for PG | TencentDB for MariaDB | TencentDB for MongoDB | TencentDB for SQLServer |
|------------------|-----------------------|-----------------------|-------------------------|

**MQ 数据连接**：Kafka，ActiveMQ，RabbitMQ，RocketMQ
**AWS 云数据连接**：Amazon RDS for MySQL
**SaaS 数据连接**：Vika，轻流

# 导入 Tapdata 插件

## 使用

进入到主界面的概况页，可以看到导出功能，点击该区域打开相应弹窗，即可看到已安装的导出类插件的关键字，未安装时则不会显示。

![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/shared/assets/images/overview-zh.png)

请选择想要入的文件格式，拖入文件点击确定按钮即可完成导入。
![](https://raw.githubusercontent.com/scarqin/postcat-tapdata/main/assets/2022-08-31-10-40-44.png)

# 联系我们

官网：https://tapdata.net/

Github：https://github.com/tapdata
