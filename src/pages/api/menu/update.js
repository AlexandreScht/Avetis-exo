import MenuModel from "@/api/db/models/MenuModel.js"
import MenuHasPageModel from "@/api/db/models/MenuHasPageModel.js"
import { isAdminOrManager } from "@/autorisation.js"
const { transaction } = require("objection")
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
import { idValidator, titleValidator } from "@/validators.js"
import parseSession from "@/parseSession"

const handler = mw({
  PUT: [
    validate({
      body: {
        id: idValidator.required(),
        name: titleValidator.required(),
        childPage: idValidator,
        childMenu: idValidator,
      },
    }),
    async ({
      locals: {
        body: { id, name, childPage, childMenu },
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

      if (!childPage && !childMenu) {
        await MenuModel.query().findOne({ id }).update({
          name,
        })

        res.send({ result: "menu modified" })

        return
      }

      await transaction(
        MenuModel,
        MenuHasPageModel,
        async (MenuModel, MenuHasPageModel) => {
          await MenuModel.query().findOne({ id }).update({
            name,
          })

          return MenuHasPageModel.query().insert({
            menuId: id,
            childrenPage: childPage ? childPage : null,
            childrenMenu: childMenu ? childMenu : null,
          })
        }
      )

      res.send({ result: "menu modified" })
    },
  ],
})

export default handler
