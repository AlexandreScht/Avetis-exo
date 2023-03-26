import PageModel from "@/api/db/models/PageModel.js"
import validate from "@/api/middlewares/validate.js"
import MenuHasPageModel from "@/api/db/models/MenuHasPageModel.js"
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

      await MenuHasPageModel.query().where({ childrenPage: id }).update({
        childrenPage: null,
      })

      await PageModel.query().findOne({ id }).del()

      res.send({ result: "page deleted" })
    },
  ],
})

export default handler
