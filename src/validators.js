import * as yup from "yup"

// generic
export const boolValidator = yup.bool()

export const idValidator = yup.number().integer().min(1)

export const stringValidator = yup.string()

// posts
export const titleValidator = yup.string().min(1).max(255)

export const contentValidator = yup.string()

export const statusValidator = yup.string().min(1)

export const uniqueStatusValidator = yup
  .string()
  .oneOf(["published"], "cannot put other status except published or nothing")
// role
export const roleValidator = yup.string().min(1)

// users
export const displayNameValidator = yup.string().min(1).max(255)

export const emailValidator = yup.string().email()

export const passwordValidator = yup
  .string()
  .min(8)
  .matches(
    /^(?=.*[\p{Ll}])(?=.*[\p{Lu}])(?=.*[0-9])(?=.*[^0-9\p{Lu}\p{Ll}])(?=.{12,}).*$/gu,
    "Password must contain at least 1 upper & 1 lower case letters, 1 digit, 1 spe. character and 12 characters minimum"
  )
  .label("Password")

// collection (pagination, order, etc.)
export const limitValidator = yup.number().integer().min(1).max(100).default(5)

export const pageValidator = yup.number().integer().min(1).default(1)

export const orderFieldValidator = (fields) => yup.string().oneOf(fields)

export const orderValidator = yup.string().lowercase().oneOf(["asc", "desc"])

export const createValidator = (object) => yup.object().shape(object)
