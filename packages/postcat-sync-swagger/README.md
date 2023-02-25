# Synchronize Swagger URL plugin

Support incremental synchronization of API data from Swagger URL to Postcat.

## use

Enter the API module, move the mouse to the plus sign of the main button, and pull down to see the option to synchronize the URL from Swagger.
![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/packages/postcat-sync-swagger/assets/images/2023-02-25-11-18-47.png)

After completing the configuration, click Sync Now to synchronize API data.
![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/packages/postcat-sync-swagger/assets/images/2023-02-25-18-10-36.png)

## Synchronization rules

New data overwrites old data

- The API Path and the request method are the same as the same API
- Groups with the same name and same level are regarded as the same group
