import http from 'http'
import app from './app'


const PORT = process.env.PORT || 3000
// Start app server
http
  .createServer(app)
  .listen(PORT, () => {
    console.info(`Server running on port ${PORT}`)
    console.info(`You can visit the API document url on http://localhost:${PORT}/doc`)
  })
