export const transform = (data, type = 'array') => ({
  type,
  required: data.filter(({ required }) => required).map(({ name }) => name),
  properties: data.reduce(
    (total, { name, required, children = [], ...it }) => ({
      [name]: {
        ...it,
        items: children.length ? transform(children) : {}
      },
      ...total
    }),
    {}
  )
})
