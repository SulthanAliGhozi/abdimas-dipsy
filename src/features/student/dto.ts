import { RoleDto } from '../role/dto'
import { GradeDto } from '../grade/dto'
import { ClassDto } from '../class/dto'

export interface StudentDto {
  id: string
  fullname: string
  email: string
  roles: RoleDto[]
  profilePicture?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface StudentDetailDto extends StudentDto {
  userDetail: {
    nisn?: string | null
    nis?: string | null
    entryYear?: string | null
    academicYear?: string | null
    phoneNumber?: string | null
    UserId: string
    GradeId: string
    ClassId: string
    gender: string
    birthDate: Date
    grade?: GradeDto
    class?: ClassDto
  }
}

export interface CreateStudentDto {
  fullname: string
  nisn: string
  birthDate: Date
  gender: string
  GradeId: string
  ClassId: string
  nis?: string | null
  entryYear?: string | null
  academicYear?: string | null
  phoneNumber?: string | null
  email?: string | null
  password?: string | null
  confirmPassword?: string | null
}

export interface UpdateStudentDto {
  fullname: string
  nisn: string
  birthDate: Date
  gender: string
  GradeId: string
  ClassId: string
  nis?: string | null
  entryYear?: string | null
  academicYear?: string | null
  phoneNumber?: string | null
  email?: string | null
  password?: string | null
  confirmPassword?: string | null
}

export interface StudentQueryFilterDto {
  fullname?: string
}

export interface StudentDetailQueryFilterDto {
  GradeId?: string
  ClassId?: string
  nisn?: string
  entryYear?: string
  academicYear?: string
}

export interface StudentNisnQueryDto {
  nisn: string
}

export interface UpdateStudentProfileDto {
  phoneNumber?: string | null
  password?: string | null
  confirmNewPassword?: string | null
}

// Backward compatibility aliases
export type ResidentDto = StudentDto
export type ResidentDetailDto = any
export type CreateResidentDto = any
export type UpdateResidentDto = any
export type ResidentQueryFilterDto = StudentQueryFilterDto
export type ResidentDetailQueryFilterDto = any
export type ResidentNikQueryDto = any
export type UpdateProfileDto = UpdateStudentProfileDto
