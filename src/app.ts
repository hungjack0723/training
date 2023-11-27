// app.ts
import express from 'express'
import http from 'http'
import swaggerUi from 'swagger-ui-express'
import WebSocket from 'ws'
import { RegisterRoutes } from './routes/routes'
import { limiter, userLimiter } from './rateLimit'
import { bitmapWs } from './service/webSocketService'
import logger from './util/logger'

const app = express()

// Routes of controller
const router = express.Router()
RegisterRoutes(router)
const swaggerDocument = require(`${__dirname}/../swagger.json`)
router.use('/doc', swaggerUi.serve)
router.get('/doc', swaggerUi.setup(swaggerDocument))
  
app.use(limiter) // Apply rate limiting for IP
app.use('/data', userLimiter) // Apply rate limiting for user ID for a specific endpoint

// Start webSocket server
const server = http.createServer(app)
const wss = new WebSocket.Server({ server, path: '/streaming' })

wss.on('connection', (ws) => {
  ws.on('message', () => {
    bitmapWs
  })
})

app.use('/', router)

export default app

