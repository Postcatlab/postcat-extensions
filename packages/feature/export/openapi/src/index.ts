import EoToOpenApi from './Eo2OpenAPI'

export const export_convert = ({ data = {} }: any) => {
  return new EoToOpenApi(data).data
}
