export const authAPI = (config) => {
  return `pc.request.headers.add('Authorization', 'Basic ${config.username}:${config.password}')`
}
