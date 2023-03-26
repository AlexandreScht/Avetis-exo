import validate from "@/api/middlewares/validate.js"
import MenuModel from "@/api/db/models/MenuModel.js"
import MenuHasPageModel from "@/api/db/models/MenuHasPageModel.js"
const { transaction } = require("objection")
import mw from "@/api/mw.js"
import { idValidator } from "@/validators.js"
import { isAdminOrManager } from "@/autorisation.js"
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

      if (!isAdminOrManager(token)) {
        res.status(401).send({ result: "no authorized" })

        return
      }

      await transaction(
        MenuModel,
        MenuHasPageModel,
        async (MenuModel, MenuHasPageModel) => {
          await MenuHasPageModel.query().where({ childrenMenu: id }).update({
            childrenMenu: null,
          })

          await MenuHasPageModel.query().where({ menuId: id }).del()

          return MenuModel.query().findOne({ id }).del()
        }
      )

      res.send({ result: "menu deleted" })
    },
  ],
})

export default handler
