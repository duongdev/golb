import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import routes from './routes'
import { parseToken } from './middlewares/auth'
import path from 'path'

const swaggerDocument = YAML.load(path.resolve(__dirname, '../swagger.yaml'))

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use(parseToken)

app.use(routes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export default app
