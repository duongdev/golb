import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import Debug from 'debug'

const debug = Debug('server:routes')

const router = Router({ mergeParams: true })

const routes = fs
  .readdirSync(__dirname)
  .filter((route) => !['index.js', '__tests__'].includes(route))
  .map((route) => route.replace(/\.js$/, ''))

routes.forEach((route) => {
  debug(`Adding route /${routes} => ${route}.js`)
  router.use(`/${route}`, require(`./${route}`).default)
})

export default router
