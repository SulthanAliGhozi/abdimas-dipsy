export interface LoginDto {
  email: string
  password: string
}

export interface LoginWithNisnDto {
  nisn?: string | null
  nik?: string | null
  password: string
}

export type LoginWithNikDto = LoginWithNisnDto

export interface RegisterDto {
  fullname: string
  nisn: string
  birthDate: Date
  gender: string
  GradeId: string
  ClassId: string
  nis?: string | null
  entryYear?: string | null
  academicYear?: string | null
  email?: string | null
  phoneNumber?: string | null
  password: string
  confirmPassword: string

  // Backward compatibility fields
  nik?: string
  profession?: string
  RukunWargaId?: string
  RukunTetanggaId?: string
  MarriageStatusId?: string
  EducationId?: string
  SalaryRangeId?: string
  isKader?: boolean
}

export interface AuthResponseDto {
  fullname: string
  email: string
  RoleIds: string[]
  uid: string
  accessToken: string
  expiresAt: Date
  expiresIn: number
}
