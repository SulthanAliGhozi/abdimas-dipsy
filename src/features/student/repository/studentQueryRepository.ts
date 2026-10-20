import { Request } from 'express'
import { StudentDetailQueryFilterDto, StudentQueryFilterDto } from '../dto'
import { FindOptions, WhereOptions, Op } from 'sequelize'
import { BaseQueryRequest } from '@/routes/version1/request/_baseQueryRequest'

export class StudentQueryRepository extends BaseQueryRequest {
  public fullname?: string

  constructor(req: Request) {
    super(req)

    const query = req.query as unknown as StudentQueryFilterDto

    this.fullname = query.fullname
  }

  public queryFilter(): FindOptions {
    const whereCondition: WhereOptions<StudentQueryFilterDto>[] = []
    if (this.fullname) {
      whereCondition.push({
        fullname: {
          [Op.like]: `%${this.fullname}%`,
        },
      })
    }

    const findCondition = {
      where: {
        [Op.and]: whereCondition,
      },
      limit: this.limit,
      offset: this.offset,
      order: this.order,
    }

    return findCondition
  }
}

export class StudentDetailQueryRepository extends BaseQueryRequest {
  public GradeId?: string
  public ClassId?: string
  public nisn?: string
  public entryYear?: string
  public academicYear?: string

  constructor(req: Request) {
    super(req)

    const query = req.query as unknown as any

    this.GradeId = query.GradeId || query.RukunWargaId
    this.ClassId = query.ClassId || query.RukunTetanggaId
    this.nisn = query.nisn || query.nik
    this.entryYear = query.entryYear
    this.academicYear = query.academicYear
  }

  public queryFilter(): FindOptions {
    const whereCondition: WhereOptions<any>[] = []

    if (this.GradeId) {
      whereCondition.push({
        GradeId: this.GradeId,
      })
    }

    if (this.ClassId) {
      whereCondition.push({
        ClassId: this.ClassId,
      })
    }

    if (this.nisn) {
      whereCondition.push({
        nisn: this.nisn,
      })
    }

    if (this.entryYear) {
      whereCondition.push({
        entryYear: this.entryYear,
      })
    }

    if (this.academicYear) {
      whereCondition.push({
        academicYear: this.academicYear,
      })
    }

    const findCondition = {
      where: {
        [Op.and]: whereCondition,
      },
    }

    return findCondition
  }
}

// Backward compatibility alias
export const ResidentQueryRepository = StudentQueryRepository
export const ResidentDetailQueryRepository = StudentDetailQueryRepository
