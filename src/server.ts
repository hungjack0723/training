import http from 'http'
import dotenv from 'dotenv'
import app from './app'

dotenv.config({ path: '.env' })
const PORT = process.env.PORT

// Start app server
http
  .createServer(app)
  .listen(PORT, () => {
    console.info(`Server running on port ${PORT}`)
    console.info(`You can visit the API document url on http://localhost:${PORT}/doc`)
  })
