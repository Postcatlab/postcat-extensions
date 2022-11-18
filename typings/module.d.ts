declare module '*.proto' {
  const src: string
  export default src
}

declare module 'inline!*' {
  const inlineCode: string
  export default inlineCode
}
