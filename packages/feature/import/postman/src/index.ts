const parserParams = {
  formdata: ({ formdata }) => ({
    requestBody: formdata.map(({ key, ...items }) => ({
      name: key,
      required: true,
      ...items
    }))
  }),
  urlencoded: ({ urlencoded }) => ({
    requestBody: urlencoded.map(({ key, ...items }) => ({
      name: key,
      ...items
    }))
  }),
  raw: ({ raw }) => ({
    requestBody: raw,
    requestBodyType: 'raw',
    requestBodyJsonType: ''
  })
}

const parserRequest = (data) => {
  if (!data) {
    return {
      requestBody: [],
      requestBodyType: 'json',
      requestBodyJsonType: 'object'
    }
  }
  const body = data?.body || {}
  console.log('[]', body)
  if (body.mode) {
    console.log('ooo', parserParams[body.mode](body))
    return {
      requestBodyType: 'json',
      requestBodyJsonType: 'object',
      ...parserParams[body.mode](body)
    }
  }
  return {
    requestBody: [],
    requestBodyType: 'json',
    requestBodyJsonType: 'object'
  }
}

const parserResponse = (data) => {
  return {
    responseBody: [],
    responseBodyType: 'json',
    responseBodyJsonType: 'object'
  }
}

const parserItem = (data) => {
  const { name, request, response, item } = data
  if (item) {
    return ''
  }
  const { method, url, header, body } = request
  return {
    name,
    projectID: 1,
    protocol: 'http',
    method,
    uri: url.raw,
    queryParams: [],
    restParams: [],
    requestHeaders: header.map(({ key, ...items }) => ({
      name: key,
      ...items
    })),
    ...parserRequest(body),
    ...parserResponse(response)
  }
}

export const importFunc = (data) => {
  const { item } = data
  const apiData = item.map(parserItem).filter((it) => it)
  console.log('lo', apiData)
  const result = {
    group: [],
    environment: [],
    apiData
  }
  return [result, null]
}
