import UserModel from "@/api/db/models/UserModel.js"
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
import { limitValidator, pageValidator } from "@/validators.js"
import { isAdmin } from "@/autorisation.js"
import parseSession from "@/parseSession"

const handler = mw({
  GET: [
    validate({
      query: {
        limit: limitValidator,
        page: pageValidator,
      },
    }),
    async ({
      locals: {
        query: { limit, page },
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
        const user = await UserModel.query()
          .withGraphFetched("role")
          .findOne({ id: token.user.id })

        res.send({ result: user })

        return
      }

      const query = UserModel.query().modify("paginate", limit, page)

      const [countResult] = await query.clone().limit(1).offset(0).count()

      const count = Number.parseInt(countResult.count, 10)

      const users = await query.withGraphFetched("role")

      res.send({
        result: users,
        meta: {
          count,
        },
      })
    },
  ],
})

export default handler
