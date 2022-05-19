import { eo2openAPI } from '../../../../../shared/src'

export const sync_to_remote = async (data, { url,projectId, secretKey }) => {
  console.log('projectId',projectId, 'secretKey', secretKey)
  const formData = new FormData()
  formData.append(
    'file[]',
    new Blob([JSON.stringify(eo2openAPI(data))], {
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
