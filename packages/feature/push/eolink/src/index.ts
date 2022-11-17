import EoToOpenApi from 'packages/feature/export/openapi/src/Eo2OpenAPI'

const url =
  'https://apis.eolink.com/api/v2/api_studio/management/api/importOpenApi'
export const sync_to_remote = async (data, { projectId, secretKey }) => {
  console.log('projectId', projectId, 'secretKey', secretKey)
  const formData = new FormData()
  formData.append(
    'file[]',
    new Blob([JSON.stringify(new EoToOpenApi(data).data)], {
      type: 'application/json'
    })
  )
  formData.append('project_id', projectId)
  formData.append('update_type', 'all')
  formData.append('api_status', '0')

  const rawResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Eo-Secret-Key': secretKey
    },
    body: formData
  })
  const response = await rawResponse.json()
  return response
}
