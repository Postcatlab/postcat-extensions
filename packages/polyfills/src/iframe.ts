export const setupIframe = () => {
  // 脚本加载的第一时间是向父窗口发送暗号
  window.parent.postMessage('EOAPI_EXT_APP', '*')
  // 如果能接收到父窗口发送特定的暗号，则说明处于 eoapi 环境下
  window.addEventListener('message', (event) => {
    if (event.data === 'EOAPI_MESSAGE' && !window.__POWERED_BY_EOAPI__) {
      window.__POWERED_BY_EOAPI__ = true
      window.eo = new Proxy(
        {},
        {
          get(_, prop) {
            return (...rest) => {
              return new Promise((resolve) => {
                // 消息 ID 一对一精准投放
                const msgID = Math.random().toString(36).slice(-6)
                const msg = {
                  msgID,
                  name: prop,
                  data: rest
                }
                window.parent.postMessage(msg, '*')
                const receiveMessage = (event) => {
                  if (event.data.msgID === msgID) {
                    window.removeEventListener('message', receiveMessage, false)
                    resolve(event.data.data)
                  }
                }
                window.addEventListener('message', receiveMessage, false)
              })
            }
          }
        }
      )
    }
  })
}
