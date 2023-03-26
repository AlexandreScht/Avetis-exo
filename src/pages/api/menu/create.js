import MenuModel from "@/api/db/models/MenuModel.js"
import MenuHasPageModel from "@/api/db/models/MenuHasPageModel.js"
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
const { transaction } = require("objection")
import { titleValidator, idValidator } from "@/validators.js"
import { isAdminOrManager } from "@/autorisation.js"
import parseSession from "@/parseSession"

const handler = mw({
  POST: [
    validate({
      body: {
        name: titleValidator.required(),
        childMenu: idValidator,
        childPage: idValidator,
      },
    }),
    async ({
      locals: {
        body: { name, childMenu, childPage },
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

      if (!childMenu && !childPage) {
        await MenuModel.query().insert({
          name,
        })

        res.send({ result: "new menu created" })

        return
      }

      await transaction(
        MenuModel,
        MenuHasPageModel,
        async (MenuModel, MenuHasPageModel) => {
          const menu = await MenuModel.query().insert({
            name,
          })

          return MenuHasPageModel.query().insert({
            menuId: menu.id,
            childrenPage: childPage ? childPage : null,
            childrenMenu: childMenu ? childMenu : null,
          })
        }
      )

      res.send({ result: "new menu created" })
    },
  ],
})

export default handler
