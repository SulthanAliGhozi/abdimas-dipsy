import * as yup from 'yup'

export const createGradeSchema = yup.object().shape({
  name: yup.string().required('validation.required'),
})

export const updateGradeSchema = yup.object().shape({
  name: yup.string().required('validation.required'),
})

export const gradeQuerySchema = yup.object().shape({
  id: yup.string().required('validation.required'),
})

export type GradeQuery = yup.InferType<typeof gradeQuerySchema>
