// import { ApiData, ApiGroup } from '../../../shared/src/types/pcAPI'
import PcToOpenAPI from './Pc2OpenAPI'

export const export_convert = ({ data = {} }: any) => {
  console.log('data', data)
  // const groups: any | ApiGroup[] = []
  // const apis: ApiData[] = []
  // let groupIndex = 1
  // const flatData = (arr, groupID) => {
  //   arr.forEach((val) => {
  //     if (val.uri) {
  //       val.groupID = groupID
  //       apis.push(val)
  //     } else {
  //       groups.push(
  //         Object.assign(
  //           {
  //             parentID: groupID,
  //             uuid: ++groupIndex
  //           },
  //           val
  //         )
  //       )
  //       if (val.children?.length) {
  //         flatData(val.children, groupIndex)
  //       }
  //     }
  //   })
  // }
  // flatData(data.collections, 0)
  return {
    status: 0,
    data: new PcToOpenAPI(data).data,
    error: []
  }
}
