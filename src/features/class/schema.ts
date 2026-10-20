import * as yup from 'yup'

export const createClassSchema = yup.object().shape({
  name: yup.string().required('validation.required'),
  GradeId: yup.string().required('validation.required'),
})

export const updateClassSchema = yup.object().shape({
  name: yup.string().required('validation.required'),
  GradeId: yup.string().optional(),
})

export const classQuerySchema = yup.object().shape({
  id: yup.string().required('validation.required'),
})

export type ClassQuery = yup.InferType<typeof classQuerySchema>
