import PageModel from "@/api/db/models/PageModel.js"
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
import {
  titleValidator,
  contentValidator,
  statusValidator,
} from "@/validators.js"
import { isAdminOrManager } from "@/autorisation.js"
import parseSession from "@/parseSession"

const handler = mw({
  POST: [
    validate({
      body: {
        title: titleValidator.required(),
        content: contentValidator,
        status: statusValidator.required(),
      },
    }),
    async ({
      locals: {
        body: { title, content, status },
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

      const querys = await PageModel.query().select("url")

      const urlSlug =
        title +
        "-" +
        (querys
          .map((items) => items.url.replace(/-\d+$/, ""))
          .filter((items) => items === title).length +
          1)

      await PageModel.query().insert({
        title,
        content,
        status,
        url: urlSlug,
        createdBy: token.user.id,
        publishedTime: status === "published" ? new Date() : null,
      })

      res.send({ result: "new page created" })
    },
  ],
})

export default handler
