import { ClassDto } from '../class/dto'

export interface GradeDto {
  id: string
  name: string
  classes?: ClassDto[]
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateGradeDto {
  name: string
}

export interface UpdateGradeDto {
  name: string
}
