import Class from '@/database/model/class'
import Grade from '@/database/model/grade'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import { CreateClassDto, UpdateClassDto } from '../dto'

export class ClassRepository {
  async getAll(GradeId?: string): Promise<Class[]> {
    const where: any = {}
    if (GradeId) where.GradeId = GradeId

    return await Class.findAll({
      where,
      include: [{ model: Grade }],
      order: [['name', 'ASC']],
    })
  }

  async getById(id: string): Promise<Class> {
    const data = await Class.findByPk(id, {
      include: [{ model: Grade }],
    })
    if (!data) throw new ErrorResponse.NotFound('errors.notFound')
    return data
  }

  async add(formData: CreateClassDto): Promise<Class> {
    const grade = await Grade.findByPk(formData.GradeId)
    if (!grade) throw new ErrorResponse.NotFound('Tingkat tidak ditemukan')
    return await Class.create({ ...formData })
  }

  async update(id: string, formData: UpdateClassDto): Promise<Class> {
    const data = await this.getById(id)
    if (formData.GradeId) {
      const grade = await Grade.findByPk(formData.GradeId)
      if (!grade) throw new ErrorResponse.NotFound('Tingkat tidak ditemukan')
    }
    await data.update({ ...formData })
    return data
  }

  async delete(id: string): Promise<void> {
    const data = await this.getById(id)
    await data.destroy()
  }
}
