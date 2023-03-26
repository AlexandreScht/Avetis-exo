import PageModel from "@/api/db/models/PageModel.js"
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
import {
  idValidator,
  titleValidator,
  contentValidator,
  uniqueStatusValidator,
} from "@/validators.js"
import parseSession from "@/parseSession"

const handler = mw({
  PUT: [
    validate({
      body: {
        id: idValidator.required(),
        title: titleValidator.required(),
        content: contentValidator,
        status: uniqueStatusValidator,
      },
    }),
    async ({
      locals: {
        body: { id, title, content, status },
        headers: { authorization },
      },
      res,
    }) => {
      if (!authorization) {
        res.status(401).send({ result: "you need to be connect" })

        return
      }

      const token = parseSession(authorization)

      const querys = await PageModel.query().select("url")

      const urlSlug =
        title +
        "-" +
        (querys
          .map((items) => items.url.replace(/-\d+$/, ""))
          .filter((items) => items === title).length +
          1)

      await PageModel.query()
        .findOne({ id })
        .update({
          title,
          content,
          status,
          url: urlSlug,
          modifiedBy: token.user.id,
          publishedTime: status === "published" ? new Date() : null,
        })

      res.send({ result: "page modified" })
    },
  ],
})

export default handler
