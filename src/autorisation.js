export const isAdmin = (token) => token.user.role === "admin"

export const isAdminOrMySelf = (token, id) =>
  token.user.role === "admin" ||
  Number.parseInt(token.user.id) === Number.parseInt(id)

export const isAdminOrManager = (token) =>
  token.user.role === "admin" || token.user.role === "manager"

export const isMySelf = (token, id) =>
  Number.parseInt(token.user.id) === Number.parseInt(id)
