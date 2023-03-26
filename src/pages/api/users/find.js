import UserModel from "@/api/db/models/UserModel.js"
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
import { idValidator } from "@/validators.js"
import { isAdminOrMySelf } from "@/autorisation.js"
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

      if (!isAdminOrMySelf(token, id)) {
        res.status(401).send({ result: "no authorized" })

        return
      }

      const user = await UserModel.query()
        .withGraphFetched("role")
        .findOne({ id })

      if (!user) {
        res.status(401).send({ error: "Invalid user" })

        return
      }

      res.send({ result: user })
    },
  ],
})

export default handler
