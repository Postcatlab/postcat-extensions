// @ts-nocheck
import { ApiData } from './shared/src/types/apiData'
import { Group } from './shared/src/types/group'
import { compareVersion } from './shared/src/utils/common'
import PcToOpenAPI from './shared/src/utils/Pc2OpenAPI'


export const sync_to_remote = async (data) => {

  const importUrl = pc.getExtensionSettings?.('apisixUrl')  + '/apisix/admin/import/routes'
  const loginUrl = pc.getExtensionSettings?.('apisixUrl')  + '/apisix/admin/user/login'
  const apisixUrl = pc.getExtensionSettings?.('apisixUrl')
  const task_name = pc.getExtensionSettings?.('task_name')
  const merge_method = pc.getExtensionSettings?.('merge_method')
  const apisixUserName = pc.getExtensionSettings?.('apisixUserName')
  const apisixPassword = pc.getExtensionSettings?.('apisixPassword')
  if (!( apisixUrl )) {
    return {
      status: 1,
      message: '请先进入插件详情页设置 Apisix 控制台地址'
    }
  }

  if (!( task_name )) {
    return {
      status: 1,
      message: '请先进入插件详情页设置导入任务名称'
    }
  }

  if (!( apisixUserName )) {
    return {
      status: 1,
      message: '请先进入插件详情页设置 username 用于鉴权'
    }
  }

  if (!( apisixPassword )) {
    return {
      status: 1,
      message: '请先进入插件详情页设置 password 用于鉴权'
    }
  }

  const loginFormData = new FormData();
  loginFormData.append('username', pc.getExtensionSettings?.('apisixUserName'));
  loginFormData.append('password', pc.getExtensionSettings?.('apisixPassword'));


  const loginResponse = await fetch(loginUrl, {
    method: 'POST',
    body: loginFormData
  })
  const loginRes = await loginResponse.json()

  if(loginRes.code !== 0) {
    return {
      status: 1,
      message: res?.message
    }
  }

  let projectData = data
  if (compareVersion(data.version || '1.0.0', '1.12.0') < 0) {
    projectData = new PcToOpenAPI(projectData).data
  } else {
    const groups: any | Group[] = []
    const apis: ApiData[] = []
    let groupIndex = 1
    const flatData = (arr, groupID) => {
      arr.forEach((val) => {
        if (val.uri) {
          val.groupID = groupID
          apis.push(val)
        } else {
          groups.push(
            Object.assign(
              {
                parentID: groupID,
                uuid: ++groupIndex
              },
              val
            )
          )
          if (val.children?.length) {
            flatData(val.children, groupIndex)
          }
        }
      })
    }
    flatData(projectData.collections, 0)
    projectData = new PcToOpenAPI({
      version: data.version,
      environmentList: data.environments,
      collections: [...groups, ...apis]
    }).data
  }


  const apisixTestFileResponse = await fetch('https://raw.githubusercontent.com/apache/apisix-dashboard/master/api/test/testdata/import/Postman-API101.yaml')

  const apisixTestFile = await apisixTestFileResponse.text();
  console.log(apisixTestFile, 56789)

  const formData = new FormData()
  formData.append(
    'file',
    new Blob([JSON.stringify(projectData)], { type: 'application/json' }),
    'Postman-API101.json'
  )

  formData.append('task_name', task_name)
  formData.append('merge_method', merge_method)
  formData.append('type', 'openapi3')

  const rawResponse = await fetch(importUrl, {
    method: 'POST',
    headers: {
      'Authorization': loginRes.data.token
    },
    body: formData
  })
  const res = await rawResponse.json()
  if (res?.status === 'error' || res?.code !== 0) {
    return {
      status: 1,
      message: res?.message
    }
  }
  return {
    status: 0
  }
}
