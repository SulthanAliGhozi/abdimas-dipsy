import { GradeDto } from '../grade/dto'

export interface ClassDto {
  id: string
  name: string
  GradeId: string
  grade?: GradeDto
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateClassDto {
  name: string
  GradeId: string
}

export interface UpdateClassDto {
  name: string
  GradeId?: string
}
