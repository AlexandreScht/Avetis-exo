import * as yup from "yup"

const validate = ({ body, headers, query }) => {
  const validator = yup.object().shape({
    ...(body ? { body: yup.object(body).shape() } : {}),
    ...(headers ? { headers: yup.object(headers).shape() } : {}),
    ...(query ? { query: yup.object(query).shape() } : {}),
  })

  return async (ctx) => {
    const { req, res, next, logger } = ctx

    try {
      const { body, headers, query } = await validator.validate(
        {
          body: req.body,
          headers: req.headers,
          query: req.query,
        },
        { abortEarly: false }
      )

      ctx.locals = {
        body,
        headers,
        query,
      }

      await next()
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        res.status(422).send({ error: err.errors })

        return
      }

      logger.error(err)

      res.status(500).send({ error: "Oops. Something went wrong." })
    }
  }
}

export default validate
