import express, { Request, Response } from 'express'
import asyncHandler from '@/helper/asyncHandler'
import HttpResponse from '@/libs/http/HttpResponse'
import { GradeRepository } from '@/features/grade/repository/gradeRepository'
import {
  createGradeSchema,
  gradeQuerySchema,
  updateGradeSchema,
} from '@/features/grade/schema'
import authorization from '@/middleware/authorization'
import { permissionAccess } from '@/middleware/permissionAccess'
import { RoleId } from '@/libs/constant/roleIds'

const repository = new GradeRepository()
const route = express.Router()

route.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const data = await repository.getAll()
    const httpResponse = HttpResponse.get({
      message: req.t.success.retrieved,
      data,
    })
    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const params = gradeQuerySchema.validateSync(req.getParams())
    const data = await repository.getById(params.id)
    const httpResponse = HttpResponse.get({
      message: req.t.success.retrieved,
      data,
    })
    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.post(
  '/',
  authorization(),
  permissionAccess([RoleId.adminDesa, RoleId.adminMedis]),
  asyncHandler(async (req: Request, res: Response) => {
    const values = createGradeSchema.validateSync(req.getBody())
    const data = await repository.add(values)
    const httpResponse = HttpResponse.created({
      message: req.t.success.created,
      data,
    })
    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.put(
  '/:id',
  authorization(),
  permissionAccess([RoleId.adminDesa, RoleId.adminMedis]),
  asyncHandler(async (req: Request, res: Response) => {
    const params = gradeQuerySchema.validateSync(req.getParams())
    const values = updateGradeSchema.validateSync(req.getBody())
    const data = await repository.update(params.id, values)
    const httpResponse = HttpResponse.updated({
      message: req.t.success.updated,
      data,
    })
    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.delete(
  '/:id',
  authorization(),
  permissionAccess([RoleId.adminDesa, RoleId.adminMedis]),
  asyncHandler(async (req: Request, res: Response) => {
    const params = gradeQuerySchema.validateSync(req.getParams())
    await repository.delete(params.id)
    const httpResponse = HttpResponse.deleted({
      message: req.t.success.deleted,
    })
    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

export { route as GradeController }
