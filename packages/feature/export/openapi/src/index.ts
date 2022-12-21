import { ApiData, ApiGroup } from '../../../../../shared/src/types/pcAPI'
import { compareVersion } from '../../../../../shared/src/utils/common'
import EoToOpenApi from './Eo2OpenAPI'

export const export_convert = ({ data = {} }: any) => {
  //TODO delete after 2023.05.01
  if (compareVersion(data.version || '1.0.0', '1.12.0') < 0) {
    return new EoToOpenApi(data).data
  }
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
  flatData(data.collections, 0)
  return {
    status: 0,
    data: new EoToOpenApi({
      version: data.version,
      project: data.project,
      environment: data.environments,
      apiData: apis,
      group: groups
    }).data,
    error: []
  }
}
