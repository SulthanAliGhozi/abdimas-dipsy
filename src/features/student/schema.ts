import * as yup from 'yup'

export const createStudentSchema = yup.object().shape({
  fullname: yup.string().required('validation.required'),
  nisn: yup
    .string()
    .required('validation.required')
    .matches(/^[0-9]{10}$/, 'NISN harus berupa 10 digit angka'),
  birthDate: yup.date().required('validation.required'),
  gender: yup
    .string()
    .oneOf(['m', 'f'], 'validation.oneOf')
    .required('validation.required'),
  GradeId: yup.string().required('validation.required'),
  ClassId: yup.string().required('validation.required'),

  nis: yup.string().optional().nullable(),
  entryYear: yup.string().optional().nullable(),
  academicYear: yup.string().optional().nullable(),
  phoneNumber: yup.string().optional().nullable(),
  email: yup.string().email('validation.email').optional().nullable(),
  password: yup
    .string()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .nullable()
    .min(8, 'validation.min'),
  confirmPassword: yup
    .string()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .nullable()
    .when('password', {
      is: (val: string | null | undefined) =>
        val !== null && val !== undefined && val !== '',
      then: (schema) =>
        schema
          .required('validation.required')
          .oneOf([yup.ref('password')], 'validation.same'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
})

export const updateStudentSchema = yup.object().shape({
  fullname: yup.string().required('validation.required'),
  nisn: yup
    .string()
    .required('validation.required')
    .matches(/^[0-9]{10}$/, 'NISN harus berupa 10 digit angka'),
  birthDate: yup.date().required('validation.required'),
  gender: yup
    .string()
    .oneOf(['m', 'f'], 'validation.oneOf')
    .required('validation.required'),
  GradeId: yup.string().required('validation.required'),
  ClassId: yup.string().required('validation.required'),

  nis: yup.string().optional().nullable(),
  entryYear: yup.string().optional().nullable(),
  academicYear: yup.string().optional().nullable(),
  phoneNumber: yup.string().optional().nullable(),
  email: yup.string().email('validation.email').optional().nullable(),
  password: yup
    .string()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .nullable()
    .min(8, 'validation.min'),
  confirmPassword: yup
    .string()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .nullable()
    .when('password', {
      is: (val: string | null | undefined) =>
        val !== null && val !== undefined && val !== '',
      then: (schema) =>
        schema
          .required('validation.required')
          .oneOf([yup.ref('password')], 'validation.same'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
})

export const updateProfileSchema = yup.object().shape({
  phoneNumber: yup.string().optional().nullable(),
  password: yup
    .string()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .nullable()
    .min(8, 'validation.min'),
  confirmNewPassword: yup
    .string()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .nullable()
    .when('password', {
      is: (val: string | null | undefined) =>
        val !== null && val !== undefined && val !== '',
      then: (schema) =>
        schema
          .required('validation.required')
          .oneOf([yup.ref('password')], 'validation.same'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
})

export const studentQuerySchema = yup.object().shape({
  id: yup.string().required('validation.required'),
})

export const studentNisnQuerySchema = yup.object().shape({
  nisn: yup
    .string()
    .required('validation.required')
    .matches(/^[0-9]{10}$/, 'NISN harus berupa 10 digit angka'),
})

export const studentSearchQuerySchema = yup.object().shape({
  page: yup.number().optional().default(1),
  pageSize: yup.number().optional().default(10),
  fullname: yup.string().optional(),
  GradeId: yup.string().optional(),
  ClassId: yup.string().optional(),
  nisn: yup.string().optional(),
})

export type StudentQuery = yup.InferType<typeof studentQuerySchema>
export type StudentNisnQuery = yup.InferType<typeof studentNisnQuerySchema>

// Backward compatibility aliases
export const createResidentSchema = createStudentSchema
export const updateResidentSchema = updateStudentSchema
export const residentQuerySchema = studentQuerySchema
export const residentNikQuerySchema = yup.object().shape({
  nik: yup.string().required('validation.required'),
})
export type ResidentQuery = StudentQuery
export type ResidentNikQuery = yup.InferType<typeof residentNikQuerySchema>
