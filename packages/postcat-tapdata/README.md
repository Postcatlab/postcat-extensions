# Tapdata

Tapdata is a real-time data service platform with its own ETL. It provides fresh real-time data for downstream interactive applications, microservices or interactive analysis by centralizing enterprise core data to a centralized data platform in real time and through API or reverse synchronization. The data.

It is suitable for multiple scenarios such as building real-time data pipelines, database migration to the cloud/cross-cloud synchronization, real-time data ETL, real-time entry into lakes and warehouses, real-time master data management, and upgrade and acceleration of traditional business systems.

Tapdata supports collecting or synchronizing the latest data changes from various data sources, including databases, APIs, queues, Internet of Things and other data providers in real time, and completes real-time data calculation, modeling and transformation, and quickly obtains results. Develop and configure the Data API required by the business in a drag-and-drop manner.

Tapdata currently supports 40+ databases and types and continues to expand. Includes **Universal Data Connection**:

| Mysql     | Postgresql | MongoDB   | Sybase ASE | Hive1 | SAP HANA   | TDSQL           | DM DB             | TiDB      | UXDB     |
| --------- | ---------- | --------- | ---------- | ----- | ---------- | --------------- | ----------------- | --------- | -------- |
| Mysql PXC | Mysql PXC  | Greenplum | IBM DB2    | ES    | Hbase      | Hazelcast Cloud | Gbase 8s Gbase 8a | KunDB     | 人大金仓 |
| MariaDB   | MariaDB    | Oracle    | SQL Server | Redis | ClickHouse | Apache Doris    | GaussDB 200       | OceanBase | GoldonDB |

**AliCloud data connection**

| ADB Mysql | ADB Postgresql | Aliyun RDS for MySQL | Aliyun RDS for PG | Aliyun RDS for SQlServer | Aliyun RDS for MariaDB | Aliyun MongoDB | PolarDB MySQL | PolarDB PostgreSQL |
| --------- | -------------- | -------------------- | ----------------- | ------------------------ | ---------------------- | -------------- | ------------- | ------------------ |

**Tencent cloud data connection:**
| TencentDB for PG | TencentDB for MariaDB | TencentDB for MongoDB | TencentDB for SQLServer |
|------------------|-----------------------|-----------------------|-------------------------|

**MQ data connection**: Kafka, ActiveMQ, RabbitMQ, RocketMQ
**AWS Cloud Data Connectivity**: Amazon RDS for MySQL
**SaaS Data Connection**: Vika, Qingliu

# Import TapData plugin

## usage

Go to the overview page of the main interface, you can see the export function, click this area to open the corresponding pop-up window, and you can see the keywords of the installed export plug-ins. If it is not installed, it will not be displayed.

![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/shared/assets/images/overview-en.png)

Please select the file format you want to import, drag in the file and click the OK button to complete the import.
![](https://raw.githubusercontent.com/scarqin/postcat-tapdata/main/assets/2022-08-31-10-38-47.png)

# Support

Home page: https://tapdata.net/

Github: https://github.com/tapdata
