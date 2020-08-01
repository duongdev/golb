import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import routes from './routes'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use(routes)

export default app
