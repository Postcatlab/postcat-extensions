import { eo2openAPI } from '../../../../../shared/src'

export const export_convert = ({ data = {} }: any) => {
  console.log('测试鸭', data)
  return eo2openAPI(data)
}
