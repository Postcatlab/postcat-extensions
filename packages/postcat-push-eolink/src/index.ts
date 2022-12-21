import { ApiData, ApiGroup } from '../../../shared/src/types/pcAPI'
import { compareVersion } from '../../../shared/src/utils/common'
import EoToOpenApi from '../../feature/export/openapi/src/Eo2OpenAPI'

const url =
  'https://apis.eolink.com/api/v2/api_studio/management/api/importOpenApi'
export const sync_to_remote = async (data) => {
  const projectId = window.eo.getExtensionSettings?.('eolink.projectID')
  const secretKey = window.eo.getExtensionSettings?.('eolink.token')
  if (!(projectId && secretKey)) {
    return {
      status: 1,
      message: '请先进入插件详情页设置配置项目 ID 和密钥'
    }
  }
  let projectData = data
  if (compareVersion(data.version || '1.0.0', '1.12.0') < 0) {
    projectData = new EoToOpenApi(projectData).data
  } else {
    const groups: any | ApiGroup[] = []
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
    projectData = new EoToOpenApi({
      version: data.version,
      project: data.project,
      environment: data.environments,
      apiData: apis,
      group: groups
    }).data
  }
  const formData = new FormData()
  formData.append(
    'file[]',
    new Blob([JSON.stringify(projectData)], {
      type: 'application/json'
    })
  )
  formData.append('project_id', projectId)
  formData.append('update_type', 'incremental')
  formData.append('api_status', '0')

  const rawResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Eo-Secret-Key': secretKey
    },
    body: formData
  })
  const res = await rawResponse.json()
  if (res?.status === 'error') {
    return {
      status: 1,
      message: res?.error_info
    }
  }
  return {
    status: 0
  }
}
