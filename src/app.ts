// app.ts
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { RegisterRoutes } from './routes/routes'
import { limiter, userLimiter } from './rateLimit'

const app = express()

// Routes of controller
const router = express.Router()
RegisterRoutes(router)
const swaggerDocument = require(`${__dirname}/../swagger.json`)
router.use('/doc', swaggerUi.serve)
router.get('/doc', swaggerUi.setup(swaggerDocument))
  
app.use(limiter) // Apply rate limiting for IP
app.use('/data', userLimiter) // Apply rate limiting for user ID for a specific endpoint

app.use('/', router)

export default app

