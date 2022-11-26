export const importFunc = (data = {}) => {
  console.log(data)
  return {
    name: 'eoapi',
    version: data.version,
    data: data
  }
}
