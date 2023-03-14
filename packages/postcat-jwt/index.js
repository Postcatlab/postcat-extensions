export const authAPI = (config) => {
  return `
    pc.request.headers.add('Authorization', 'JWT'${config.username}:${config.password}')
    `
}
