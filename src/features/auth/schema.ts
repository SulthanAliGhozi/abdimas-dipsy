import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().email('validation.email').required('validation.required'),
  password: yup
    .string()
    .min(8, 'validation.min')
    .required('validation.required'),
})

export const loginWithNisnSchema = yup.object({
  nisn: yup.string().optional().nullable(),
  nik: yup.string().optional().nullable(),
  password: yup
    .string()
    .min(8, 'validation.min')
    .required('validation.required'),
}).test(
  'has-nisn-or-nik',
  'NISN wajib diisi',
  (value) => Boolean(value?.nisn || value?.nik)
)

export const loginWithNikSchema = loginWithNisnSchema

export const registerSchema = yup.object({
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
  email: yup.string().email('validation.email').optional().nullable(),
  phoneNumber: yup.string().optional().nullable(),
  password: yup
    .string()
    .min(8, 'validation.min')
    .required('validation.required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'validation.same')
    .required('validation.required'),
})
