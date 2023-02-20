import { filterFieds } from "../../../shared/src/utils/data-transfer"

export const export_convert = ({ data = {} }: any) => {
  
data = {
  name: data.name,
  description: data.description,
  environmentList: data.environmentList,
  collections: data.collections
}

  filterFieds(data.collections)

  return {
    status: 0,
    data,
    error: []
  }
}
