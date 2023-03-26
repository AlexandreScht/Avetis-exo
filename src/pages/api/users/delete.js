import UserModel from "@/api/db/models/UserModel.js"
import PageModel from "@/api/db/models/PageModel.js"
import validate from "@/api/middlewares/validate.js"
const { transaction } = require("objection")
import RoleModel from "@/api/db/models/RoleModel.js"
import mw from "@/api/mw.js"
import { idValidator } from "@/validators.js"
import { isAdminOrMySelf } from "@/autorisation.js"
import parseSession from "@/parseSession"

const handler = mw({
  DELETE: [
    validate({
      body: {
        id: idValidator.required(),
      },
    }),
    async ({
      locals: {
        body: { id },
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

      await transaction(
        UserModel,
        RoleModel,
        PageModel,
        async (UserModel, RoleModel, PageModel) => {
          await RoleModel.query().findOne({ usersId: id }).del()

          await PageModel.query()
            .where("createdBy", id)
            .update({ createdBy: null })

          return UserModel.query().findOne({ id }).del()
        }
      )

      res.send({ result: "profil deleted" })
    },
  ],
})

export default handler
