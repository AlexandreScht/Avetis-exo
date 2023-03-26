import MenuModel from "@/api/db/models/MenuModel.js"
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
import { limitValidator, pageValidator } from "@/validators.js"

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
      },
      res,
    }) => {
      const query = MenuModel.query().modify("paginate", limit, page)

      const [countResult] = await query.clone().limit(1).offset(0).count()

      const menus = await query
        .withGraphFetched("childrenMenu")
        .withGraphFetched("childrenPage")

      const count = Number.parseInt(countResult.count, 10)

      res.send({
        result: menus,
        meta: {
          count,
        },
      })
    },
  ],
})

export default handler
