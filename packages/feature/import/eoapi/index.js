export const importFunc = (data = {}) => {
  data.collections=[{
    name:"Default",
    children:data.collections
  }]
  return [data, null]
}
