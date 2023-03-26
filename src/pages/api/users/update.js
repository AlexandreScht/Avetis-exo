import UserModel from "@/api/db/models/UserModel.js"
import validate from "@/api/middlewares/validate.js"
const { transaction } = require("objection")
import hashPassword from "@/api/db/hashPassword.js"
import RoleModel from "@/api/db/models/RoleModel.js"
import mw from "@/api/mw.js"
import {
  displayNameValidator,
  emailValidator,
  passwordValidator,
  roleValidator,
  idValidator,
} from "@/validators.js"
import { isAdminOrMySelf } from "@/autorisation.js"
import parseSession from "@/parseSession"

const handler = mw({
  PUT: [
    validate({
      body: {
        firstName: displayNameValidator.required(),
        lastName: displayNameValidator.required(),
        email: emailValidator.required(),
        password: passwordValidator.required(),
        role: roleValidator.required(),
        id: idValidator.required(),
      },
    }),
    async ({
      locals: {
        body: { firstName, lastName, email, password, role, id },
        headers: { authorization },
      },
      res,
    }) => {
      if (!authorization) {
        res.status(401).send({ result: "you need to be connect" })

        return
      }

      const token = parseSession(authorization)

      if (!isAdminOrMySelf(token, id)) {
        res.status(401).send({ result: "no authorized" })

        return
      }

      const [passwordHash, passwordSalt] = await hashPassword(password)
      await transaction(UserModel, RoleModel, async (UserModel, RoleModel) => {
        await UserModel.query().findOne({ id }).update({
          firstName,
          lastName,
          email,
          passwordHash,
          passwordSalt,
        })

        return RoleModel.query().where({ usersId: id }).update({
          role,
        })
      })

      res.send({ result: "update" })
    },
  ],
})

export default handler
