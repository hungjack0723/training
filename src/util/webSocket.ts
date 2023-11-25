import WebSocket from 'ws'

export const connectToWebSocket = (
  url: string, 
  onOpen: () => void, 
  onMessage: (message: WebSocket.Data) => void, 
  onClose: () => void) => {
  const ws = new WebSocket(url)
  ws.on('open', onOpen)

  ws.on('message', (message) => {
    try {
      onMessage(message)
    } catch (error) {
      console.error('Error handling message:', error)
    }
  })

  ws.on('close', onClose)
  return ws
}
