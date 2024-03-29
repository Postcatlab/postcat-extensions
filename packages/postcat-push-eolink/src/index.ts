import { ApiData } from 'shared/src/types/apiData'
import { Group } from '../../../shared/src/types/group'
import { compareVersion } from '../../../shared/src/utils/common'
import PcToOpenAPI from '../../postcat-export-openapi/src/Pc2OpenAPI'

const url =
  'https://apis.eolink.com/api/v2/api_studio/management/api/importOpenApi'
export const sync_to_remote = async (data) => {
  const projectId = pc.getExtensionSettings?.('eolink.projectID')
  const secretKey = pc.getExtensionSettings?.('eolink.token')

  if (!(projectId && secretKey)) {
    return {
      status: 1,
      message: '请先进入插件详情页设置配置项目 ID 和密钥'
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
