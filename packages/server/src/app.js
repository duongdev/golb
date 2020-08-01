import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import routes from './routes'
import { version } from '../package.json'
import { parseToken } from './middlewares/auth'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use(parseToken)

app.use(routes)

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version,
    },
  },
  apis: ['./dist/routes/users.js'],
}
const swaggerSpec = swaggerJSDoc(options)

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default app
