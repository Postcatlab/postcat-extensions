import { compareVersion } from '../../../../../shared/src/utils/common'

const exportCollects = (apiGroup: any[], apiData: any[], parentID = 0) => {
  const apiGroupFilters = apiGroup.filter(
    (child) => child.parentID === parentID
  )
  const apiDataFilters = apiData.filter((child) => child.groupID === parentID)
  return apiGroupFilters
    .map((item) => ({
      name: item.name,
      children: exportCollects(apiGroup, apiData, item.uuid)
    }))
    .concat(apiDataFilters)
}

export const export_convert = ({ data = {} }: any) => {
  //TODO delete after 2023.05.01
  if (compareVersion(data.version || '', '1.12.0') < 0) {
    return {
      version: data.version,
      collections: exportCollects(data.group, data.apiData),
      //TODO data.environment after 2023.05.01
      environments: data.environments || data.environment
    }
  }
  return {
    status: 0,
    data,
    error: []
  }
}
