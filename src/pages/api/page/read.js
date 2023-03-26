import PageModel from "@/api/db/models/PageModel.js"
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
import { idValidator } from "@/validators.js"
import { isMySelf } from "@/autorisation.js"
import parseSession from "@/parseSession"

const handler = mw({
  GET: [
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

      const Pages = await PageModel.query().findOne({ id })

      if (Pages.status === "published") {
        res.send({ result: Pages })

        return
      }

      if (!isMySelf(token, Pages.createdBy)) {
        res.status(401).send({ result: "no authorized" })

        return
      }

      res.send({ result: Pages })
    },
  ],
})

export default handler
