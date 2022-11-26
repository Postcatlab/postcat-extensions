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
  return {
    version: data.version || '1.0.0',
    collections: exportCollects(data.group, data.apiData),
    environments: data.environments
  }
}
