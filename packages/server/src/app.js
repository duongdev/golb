import express from 'express'
import logger from 'morgan'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

export default app
