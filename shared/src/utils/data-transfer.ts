import { whatType, whatTextType, JSONParse } from './common'
import { BodyParam } from '../types/apiData'
import { ApiBodyType } from '../types/api.model'

export const isXML = (data) => {
  const parser = new DOMParser()
  let xml = null
  try {
    const xmlContent = parser.parseFromString(data, 'text/xml')
    xml = xmlContent.getElementsByTagName('parsererror')
  } catch (error) {
    return false
  }
  if (xml.length > 0) {
    return false
  }
  return true
}
/**
 * Parse item to eoTableComponent need
 */
export const parseTree = (key, value): BodyParam | unknown => {
  if (whatType(value) === 'object') {
    return {
      name: key,
      isRequired: 1,
      'paramAttr.example': '',
      paramAttr: {
        example: ''
      },
      dataType: ApiParamsType.object,
      description: '',
      childList: Object.keys(value).map((it) => parseTree(it, value[it]))
    }
  }
  if (whatType(value) === 'array') {
    // * Just pick first element
    const [data] = value
    // If array element is primitive value
    if (whatType(data) === 'string') {
      return {
        name: key,
        isRequired: 1,
        'paramAttr.example': JSON.stringify(value),
        dataType: ApiParamsType.array,
        paramAttr: {
          example: JSON.stringify(value)
        },
        description: ''
      }
    }
    return {
      name: key,
      isRequired: 1,
      'paramAttr.example': '',
      paramAttr: {
        example: ''
      },
      dataType: ApiParamsType.array,
      description: '',
      childList: data
        ? Object.keys(data).map((it) => parseTree(it, data[it]))
        : []
    }
  }
  // * value is string & number & null
  return {
    name: key,
    isRequired: 1,
    description: '',
    'paramAttr.example': value == null ? '' : value.toString(),
    paramAttr: {
      example: value == null ? '' : value.toString()
    },
    dataType: ApiParamsType[whatType(value)]
  }
}
/**
 * Parse item to table need row data
 */
export const form2json = (tmpl) =>
  tmpl
    .split('\n')
    .filter((it) => it.trim())
    .map((it) => it.split(':'))
    .map((it) => {
      const [key, value] = it
      return { key: key?.trim(), value: value?.trim() }
    })

const xml2jsonArr = (
  tmpl
): Array<{
  tagName: string
  childList: any[]
  content: string
  attr: string
}> => {
  // * delete <?xml ... ?>
  let xml = tmpl.replace(/<\?xml.+\?>/g, '').trim()
  if (xml === '') {
    return []
  }
  const startTag =
    /^<([^>\s\/]+)((\s+[^=>\s]+(\s*=\s*((\"[^"]*\")|(\'[^']*\')|[^>\s]+))?)*)\s*\/?\s*>/m
  const endTag = /^<\/([^>\s]+)[^>]*>/m
  const stack = []
  const result = []
  let start = null
  let index = null
  while (xml) {
    // * handle end tags
    if (xml.substring(0, 2) === '</') {
      const end = xml.match(endTag)
      const [str, label] = end
      const last = stack.pop()
      if (last.tagName !== label) {
        throw new Error(
          `Parse error 101. [${last.tagName}] is not eq [${label}]`
        )
      }
      if (stack.length === 0) {
        result.push(last)
      } else {
        const parent = stack.pop()
        parent.childList.push(last)
        stack.push(parent)
      }
      index = xml.indexOf(str) === -1 ? 0 : xml.indexOf(str)
      xml = xml.substring(index + str.length).trim()
      index = null
      continue
    }
    // * handle start tags
    if (xml.indexOf('<') === 0 && (start = xml.match(startTag))) {
      const [str, label, attr] = start
      if (str.slice(-2) === '/>') {
        // * single tag
        const parent = stack.pop()
        parent.childList.push({
          tagName: label.trim(),
          attr: attr.trim(),
          content: '',
          childList: []
        })
        stack.push(parent)
        xml = xml.trim().substring(str.length)
        continue
      }
      stack.push({
        tagName: label.trim(),
        attr: attr.trim(),
        content: '',
        childList: []
      })
      index = xml.indexOf(str) === -1 ? 0 : xml.indexOf(str)
      xml = xml.substring(index + str.length)
      index = null
      continue
    }
    // * handle text content
    if (xml.indexOf('<') > 0) {
      index = xml.indexOf('<')
      const content = xml.slice(0, index)
      const last = stack.pop()
      last.content += content
      stack.push(last)
      xml = xml.substring(index).trim()
      index = null
      continue
    }
    xml = xml.trim()
  }
  if (stack.length) {
    throw new Error('Parse error 102')
  }
  // console.log(JSON.stringify(result, null, 2));
  return result
}
export const xml2json = (text) => {
  const data: any[] = xml2jsonArr(text)
  const deep = (list = []) =>
    list.reduce(
      (total, { tagName, content, attr, childList }) => ({
        ...total,
        [tagName]: childList?.length > 0 ? deep(childList || []) : content
        // attribute: attr,  // * not support the key for now cause ui has not show it
      }),
      {}
    )
  return deep(data)
}

type uiData = {
  contentType: ApiBodyType
  data: BodyParam | any
}

/**
 * Transfer text to json/xml/raw table data,such as request body/response body
 *
 * @returns body info
 */
export const text2table: (text: string) => uiData = (text) => {
  const result: uiData = {
    contentType: ApiBodyType.Raw,
    data: [
      {
        binaryRawData: text
      }
    ]
  }
  const textType = whatTextType(text)
  result.contentType =
    textType === 'xml'
      ? ApiBodyType.XML
      : textType === 'json'
      ? whatType(JSONParse(text)) === 'array'
        ? ApiBodyType.JSONArray
        : ApiBodyType.JSON
      : ApiBodyType.Raw
  switch (result.contentType) {
    case ApiBodyType.XML: {
      result.data = json2Table(xml2json(text))
      break
    }
    case ApiBodyType.JSON: {
      result.data = json2Table(JSON.parse(text))
      break
    }
    default: {
      break
    }
  }
  return result
}
export const json2Table = (json) =>
  Object.entries(json).map(([key, value]) => parseTree(key, value))

const fields = [
  'createUserId',
  'updateUserId',
  'managerId',
  'id',
  'groupId',
  'projectId'
]

export const filterFieds = (data: any[] = []) => {
  data.forEach((item) => {
    fields.forEach((k) => Reflect.deleteProperty(item, k))
    if (item.children?.length || item.childList?.length) {
      filterFieds(item.children || item.childList)
    }
    if (item.responseList?.length) {
      filterFieds(item.responseList)
    }
    if (item.apiAttrInfo) {
      fields.forEach((k) => Reflect.deleteProperty(item.apiAttrInfo, k))
    }
  })
}
