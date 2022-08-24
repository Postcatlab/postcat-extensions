const toString = Object.prototype.toString

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

export function isString(val: unknown): val is string {
  return is(val, 'String')
}

export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

/** get data type */
export const getDataType = (data) => {
  return toString.call(data).slice(8, -1).toLocaleLowerCase()
}

/** 将路径中重复的正斜杆替换成单个斜杆隔开的字符串 */
export const uniqueSlash = (path: string) => path.replace(/(?<!:)\/{2,}/g, '/')
