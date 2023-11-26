import http from 'http'
import dotenv from 'dotenv'
import app from './app'
import logger from './util/logger'

dotenv.config({ path: '.env' })
const PORT = process.env.PORT

// Start app server
http
  .createServer(app)
  .listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
    logger.info(`You can visit the API document url on http://localhost:${PORT}/doc`)
  })
