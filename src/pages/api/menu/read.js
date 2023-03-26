import MenuModel from "@/api/db/models/MenuModel.js"
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
import { idValidator } from "@/validators.js"

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
      },
      res,
    }) => {
      const menu = await MenuModel.query()
        .findOne({ id })
        .withGraphFetched("childrenMenu")
        .withGraphFetched("childrenPage")

      res.send({ result: menu })
    },
  ],
})

export default handler
