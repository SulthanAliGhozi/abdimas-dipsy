import { Request } from 'express'
import User from '@/database/model/user'
import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import {
  StudentDetailQueryRepository,
  StudentQueryRepository,
} from './studentQueryRepository'
import {
  CreateStudentDto,
  StudentDetailDto,
  StudentDto,
  UpdateStudentProfileDto,
  UpdateStudentDto,
} from '../dto'
import UserDetail from '@/database/model/userDetail'
import Grade from '@/database/model/grade'
import Class from '@/database/model/class'
import { RoleId } from '@/libs/constant/roleIds'
import { MetaPaginationDto } from '@/routes/version1/response/metaData'
import UserHasRoles from '@/database/model/userHasRoles'
import Role from '@/database/model/role'
import { AuthRepository } from '../../auth/repository/authRepository'
import { Op } from 'sequelize'
import { env } from '@/config/env.config'

const authRepository = new AuthRepository()

export class StudentRepository {
  async getAll(
    req: Request
  ): Promise<{ data: StudentDto[]; meta: { pagination: MetaPaginationDto } }> {
    const query = new StudentQueryRepository(req)
    const detailQuery = new StudentDetailQueryRepository(req)

    const detailFilter = detailQuery.queryFilter()

    const isDetailRequired = Boolean(
      detailQuery.GradeId ||
        detailQuery.ClassId ||
        detailQuery.nisn ||
        detailQuery.entryYear ||
        detailQuery.academicYear
    )

    const { rows: data, count: totalRows } = await User.findAndCountAll({
      ...query.queryFilter(),
      distinct: true,
      include: [
        {
          model: UserDetail,
          include: [{ model: Grade }, { model: Class }],
          ...(detailFilter as any),
          required: isDetailRequired,
        },
        {
          model: Role,
          where: {
            id: { [Op.in]: [RoleId.user] },
          },
          through: { attributes: [] },
        },
      ],
    })

    return {
      data,
      meta: {
        pagination: {
          page: query.page,
          pageSize: query.pageSize,
          pageCount: data.length,
          total: totalRows,
        },
      },
    }
  }

  async getByPk(id: string): Promise<User> {
    const data = await User.findByPk(id)
    if (!data) throw new ErrorResponse.NotFound('errors.notFound')
    return data
  }

  async getById(id: string): Promise<StudentDetailDto> {
    const data = await User.findOne({
      where: { id },
      include: [
        { model: Role, through: { attributes: [] } },
        {
          model: UserDetail,
          include: [{ model: Grade }, { model: Class }],
        },
      ],
    })

    if (!data) throw new ErrorResponse.NotFound('errors.notFound')
    return data as unknown as StudentDetailDto
  }

  async getByNisn(nisn: string): Promise<StudentDetailDto> {
    const data = await User.findOne({
      include: [
        {
          model: Role,
          through: { attributes: [] },
        },
        {
          model: UserDetail,
          where: {
            [Op.or]: [{ nisn }, { nis: nisn }],
          },
          required: true,
          include: [{ model: Grade }, { model: Class }],
        },
      ],
    })

    if (!data) throw new ErrorResponse.NotFound('errors.notFound')
    return data as unknown as StudentDetailDto
  }

  // Alias for backward compatibility
  async getByNik(nik: string): Promise<StudentDetailDto> {
    return await this.getByNisn(nik)
  }

  async add(formData: CreateStudentDto): Promise<void> {
    let data: any

    // 1. Cek duplikasi NISN
    const duplicateNisn = await UserDetail.findOne({
      where: { nisn: formData.nisn },
    })

    if (duplicateNisn) {
      throw new ErrorResponse.BaseResponse('auth.nisnUsed', 'Conflict', 409)
    }

    // 2. Email otomatis domain sekolah: ${nisn}@al-multazam.sch.id
    if (!formData.email) {
      formData.email = authRepository.createEmailFromNisn(formData.nisn)
    }

    const duplicateEmail = await User.findOne({
      where: { email: formData.email },
    })

    if (duplicateEmail) {
      throw new ErrorResponse.BaseResponse('auth.emailUsed', 'Conflict', 409)
    }

    if (formData.phoneNumber) {
      const duplicatePhoneNumber = await UserDetail.findOne({
        where: { phoneNumber: formData.phoneNumber },
      })

      if (duplicatePhoneNumber) {
        throw new ErrorResponse.BaseResponse('auth.phoneUsed', 'Conflict', 409)
      }
    }

    // Password default jika tidak disediakan
    const defaultPassword = env.APP_DEFAULT_PASS || 'password123'
    const password = formData.password || defaultPassword

    await db.sequelize!.transaction(async (transaction) => {
      data = await User.create(
        {
          fullname: formData.fullname,
          email: formData.email!,
          password,
        },
        { transaction }
      )

      await UserHasRoles.create(
        {
          RoleId: RoleId.user,
          UserId: data.id,
        },
        { transaction }
      )

      await UserDetail.create(
        {
          UserId: data.id,
          nisn: formData.nisn,
          nis: formData.nis,
          entryYear: formData.entryYear || formData.academicYear,
          academicYear: formData.academicYear || formData.entryYear,
          GradeId: formData.GradeId,
          ClassId: formData.ClassId,
          gender: formData.gender,
          birthDate: formData.birthDate,
          phoneNumber: formData.phoneNumber,
        },
        { transaction }
      )
    })
  }

  async update(id: string, formData: UpdateStudentDto): Promise<void> {
    const data = await this.getByPk(id)

    // Cek duplikasi NISN jika diubah
    if (formData.nisn) {
      const duplicateNisn = await UserDetail.findOne({
        where: {
          nisn: formData.nisn,
          UserId: { [Op.ne]: data.id },
        },
      })
      if (duplicateNisn) {
        throw new ErrorResponse.BaseResponse('auth.nisnUsed', 'Conflict', 409)
      }
    }

    await db.sequelize!.transaction(async (transaction) => {
      const updateUserData: any = {
        fullname: formData.fullname,
      }
      if (formData.email) updateUserData.email = formData.email
      if (formData.password) updateUserData.password = formData.password

      await data.update(updateUserData, { transaction })

      await UserDetail.update(
        {
          nisn: formData.nisn,
          nis: formData.nis,
          entryYear: formData.entryYear || formData.academicYear,
          academicYear: formData.academicYear || formData.entryYear,
          GradeId: formData.GradeId,
          ClassId: formData.ClassId,
          gender: formData.gender,
          birthDate: formData.birthDate,
          phoneNumber: formData.phoneNumber,
        },
        { where: { UserId: data.id }, transaction }
      )
    })
  }

  async updateByToken(
    id: string,
    formData: UpdateStudentProfileDto
  ): Promise<void> {
    const data = await this.getByPk(id)

    await db.sequelize!.transaction(async (transaction) => {
      if (formData.password) {
        await data.update({ password: formData.password }, { transaction })
      }

      await UserDetail.update(
        { phoneNumber: formData.phoneNumber },
        { where: { UserId: data.id }, transaction }
      )
    })
  }

  async delete(id: string): Promise<void> {
    const data = await this.getByPk(id)
    await data.destroy()
  }
}

// Backward compatibility alias
export const ResidentRepository = StudentRepository
