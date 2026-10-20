import Grade from '@/database/model/grade'
import Class from '@/database/model/class'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import { CreateGradeDto, UpdateGradeDto } from '../dto'

export class GradeRepository {
  async getAll(): Promise<Grade[]> {
    return await Grade.findAll({
      include: [{ model: Class }],
      order: [['name', 'ASC']],
    })
  }

  async getById(id: string): Promise<Grade> {
    const data = await Grade.findByPk(id, {
      include: [{ model: Class }],
    })
    if (!data) throw new ErrorResponse.NotFound('errors.notFound')
    return data
  }

  async add(formData: CreateGradeDto): Promise<Grade> {
    return await Grade.create({ ...formData })
  }

  async update(id: string, formData: UpdateGradeDto): Promise<Grade> {
    const data = await this.getById(id)
    await data.update({ ...formData })
    return data
  }

  async delete(id: string): Promise<void> {
    const data = await this.getById(id)
    await data.destroy()
  }
}
