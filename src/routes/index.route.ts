import express, { Request, Response, Router } from 'express'
import { v1Route } from './version1/version1.route'

const Route: Router = express.Router()

Route.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Abdimas Dipsy API is running',
    version: '1.0.0',
    basePath: '/v1',
  })
})

Route.use('/v1', v1Route)

export default Route
