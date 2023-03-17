import config from "@/api/config.js"
import sessionStorage from "@/web/sessionStorage.js"
import UserModel from "@/api/db/models/UserModel.js"
import RoleModel from "@/api/db/models/RoleModel.js"
import slowDown from "@/api/middlewares/slowDown.js"
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
import { emailValidator, stringValidator } from "@/validators.js"
import jsonwebtoken from "jsonwebtoken"

const handler = mw({
  POST: [
    slowDown(500),
    validate({
      body: {
        email: emailValidator.required(),
        password: stringValidator.required(),
      },
    }),
    async ({
      locals: {
        body: { email, password },
      },
      res,
    }) => {
      const user = await UserModel.query().findOne({ email })

      if (!user) {
        res.status(401).send({ error: "Invalid user" })

        return
      }

      if (!(await user.checkPassword(password))) {
        res.status(401).send({ error: password })

        return
      }

      const permision = await RoleModel.query()
        .findOne("usersId", user.id)
        .select("role")

      const jwt = jsonwebtoken.sign(
        {
          payload: {
            user: {
              id: user.id,
              role: permision.role,
            },
          },
        },
        config.security.jwt.secret,
        { expiresIn: config.security.jwt.expiresIn }
      )
      sessionStorage(jwt)

      res.send({ result: "connected" })
    },
  ],
})

export default handler
