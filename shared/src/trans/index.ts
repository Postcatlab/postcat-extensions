// export const transform = (data, type = 'array') => ({
//   type,
//   required: data.filter(({ required }) => required).map(({ name }) => name),
//   properties: data.reduce(
//     (total, { name, required, children = [], ...it }) => ({
//       [name]: {
//         ...it,
//         items: children.length ? transform(children) : {}
//       },
//       ...total
//     }),
//     {}
//   )
// })

export const transform = (data, type = 'array') => {
  if (type === 'object') {
    const { required, ...items } = data
    return {
      type,
      required,
      properties: items
    }
  }
  return {
    type,
    required: data.filter(({ required }) => required).map(({ name }) => name),
    properties: data.reduce(
      (total, { name, required, children = [], ...it }) => ({
        [name]: {
          ...it,
          items: {}
        },
        ...total
      }),
      {}
    )
  }
}
