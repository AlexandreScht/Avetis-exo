import hashPassword from "@/api/db/hashPassword.js"
import UserModel from "@/api/db/models/UserModel.js"
const { transaction } = require("objection")
import RoleModel from "@/api/db/models/RoleModel.js"
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
import {
  displayNameValidator,
  emailValidator,
  passwordValidator,
  roleValidator,
} from "@/validators.js"
import { isAdmin } from "@/autorisation.js"
import parseSession from "@/parseSession"

const handler = mw({
  POST: [
    validate({
      body: {
        firstName: displayNameValidator.required(),
        lastName: displayNameValidator.required(),
        email: emailValidator.required(),
        password: passwordValidator.required(),
        role: roleValidator.required(),
      },
    }),
    async ({
      locals: {
        body: { firstName, lastName, email, password, role },
        headers: { authorization },
      },
      res,
    }) => {
      if (!authorization) {
        res.status(401).send({ result: "you need to be connect" })

        return
      }

      const token = parseSession(authorization)

      if (!isAdmin(token)) {
        res.status(401).send({ result: "no authorized" })

        return
      }

      const user = await UserModel.query().findOne({ email })

      if (user) {
        res.send({ result: true })

        return
      }

      const [passwordHash, passwordSalt] = await hashPassword(password)

      await transaction(UserModel, RoleModel, async (UserModel, RoleModel) => {
        const account = await UserModel.query().insert({
          firstName,
          lastName,
          email,
          passwordHash,
          passwordSalt,
        })

        return RoleModel.query().insert({ usersId: account.id, role: role })
      })

      res.send({ result: true })
    },
  ],
})

export default handler
