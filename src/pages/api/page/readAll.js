import PageModel from "@/api/db/models/PageModel.js"
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
import { limitValidator, pageValidator } from "@/validators.js"
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

      const query = PageModel.query().modify("paginate", limit, page)

      query.where("status", "draft").orWhere({
        status: "published",
        createdBy: token.user.id,
      })

      const [countResult] = await query.clone().limit(1).offset(0).count()

      const pages = await query
        .withGraphFetched("Creator")
        .withGraphFetched("ModifiedBy")
        .select(
          "id",
          "title",
          "content",
          "url",
          "publishedTime",
          "status",
          "createdAt",
          "updatedAt"
        )

      const count = Number.parseInt(countResult.count, 10)

      res.send({
        result: pages,
        meta: {
          count,
        },
      })
    },
  ],
})

export default handler
